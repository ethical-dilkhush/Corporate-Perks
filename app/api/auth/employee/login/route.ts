import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Query the employees table
    const { data: employee, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .eq('password_hash', password)
      .single();

    if (error || !employee) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Store credentials in session for later use
    cookies().set('employee_session', JSON.stringify({
      id: employee.id,
      email: employee.email,
      password_hash: employee.password_hash, // Store password_hash for later queries
      role: 'employee'
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return NextResponse.json({
      user: {
        id: employee.id,
        email: employee.email
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 