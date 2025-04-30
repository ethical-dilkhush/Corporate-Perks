import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Function to generate a random coupon code
function generateCouponCode(): string {
  // Generate a code with format: XXX-YYY-ZZZ (where X, Y, Z are alphanumeric)
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like 0,O,1,I
  let code = '';
  
  // Generate three groups of 3 characters
  for (let group = 0; group < 3; group++) {
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters[randomIndex];
    }
    
    // Add hyphen between groups (but not after the last group)
    if (group < 2) {
      code += '-';
    }
  }
  
  return code;
}

export async function POST(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get employee session (await cookies())
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('employee_session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Parse the request body to get the offer ID
    const body = await request.json();
    const rawOfferId = body.offer_id;
    
    if (!rawOfferId) {
      return NextResponse.json({ error: "Offer ID is required" }, { status: 400 });
    }
    
    // Convert offerId to string for consistent comparison
    const offerIdStr = String(rawOfferId);
    
    // Get the session data
    const session = JSON.parse(sessionCookie.value);
    
    // Get employee ID from session email
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('id')
      .eq('email', session.email)
      .single();
    
    if (employeeError || !employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }
    
    // Get offer details to verify it exists using the string representation
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('id, valid_until')
      .eq('id', offerIdStr)
      .single();
    
    if (offerError || !offer) {
      console.error('[Backend] Offer lookup error:', { 
        offerIdReceived: offerIdStr, 
        typeOfId: typeof offerIdStr, 
        supabaseError: offerError 
      });
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }
    
    // Check if employee already has an active coupon for this offer
    const { data: existingCoupon, error: existingCouponError } = await supabase
      .from('coupons')
      .select('id, code')
      .eq('employee_id', employee.id)
      .eq('offer_id', offer.id)
      .eq('status', 'ACTIVE')
      .maybeSingle();
    
    if (existingCoupon) {
      return NextResponse.json({ 
        error: "You already have an active coupon for this offer",
        existingCoupon
      }, { status: 409 });
    }
    
    // Generate a unique coupon code
    let couponCode: string;
    let isUnique = false;
    
    // Keep generating codes until we find a unique one
    while (!isUnique) {
      couponCode = generateCouponCode();
      
      // Check if code exists
      const { data: codeExists } = await supabase
        .from('coupons')
        .select('id')
        .eq('code', couponCode)
        .maybeSingle();
      
      if (!codeExists) {
        isUnique = true;
      }
    }
    
    // Insert the new coupon into the database
    const { data: newCoupon, error: insertError } = await supabase
      .from('coupons')
      .insert({
        code: couponCode!,
        employee_id: employee.id,
        offer_id: offer.id,
        status: 'ACTIVE',
        valid_until: offer.valid_until
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating coupon:', insertError);
      return NextResponse.json({ 
        error: "Failed to create coupon",
        message: insertError.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: "Coupon generated successfully",
      coupon: newCoupon
    });
    
  } catch (error) {
    console.error('Generate coupon error:', error);
    return NextResponse.json({ 
      error: "Something went wrong. Please try again.",
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
