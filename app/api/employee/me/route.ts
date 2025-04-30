import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET() {
  try {
    // Get session data (await cookies())
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('employee_session');
    
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const session = JSON.parse(sessionCookie.value);
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch employee data using stored email and password_hash
    const { data: employee, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', session.email)
      .eq('password_hash', session.password_hash)
      .single();

    if (error || !employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Return employee data
    return NextResponse.json({
      employee: {
        id: employee.id,
        email: employee.email,
        name: employee.name || employee.first_name || employee.email.split('@')[0],
        // Add any other employee fields you want to display
      }
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 