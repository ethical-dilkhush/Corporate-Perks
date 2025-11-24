import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: offers, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch offers' },
        { status: 500 }
      );
    }

    // Format the dates using end_date and prepare the response
    const formattedOffers = offers.map(offer => {
      // Use end_date instead of valid_until
      const date = offer.end_date ? new Date(offer.end_date) : null;
      const validUntilFormatted = date && !isNaN(date.getTime())
        ? date.toLocaleDateString() 
        : null;
        
      return {
        ...offer,
        image_url: offer.image_url || offer.image || offer.logo_url || null,
        validUntilFormatted // Keep the formatted property name for consistency
      };
    });

    return NextResponse.json(formattedOffers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 