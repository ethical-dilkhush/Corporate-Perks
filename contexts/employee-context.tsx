"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface Employee {
  id: string;
  email: string;
  name: string;
}

interface EmployeeContextType {
  employee: Employee | null;
  loading: boolean;
  refetchEmployee: () => Promise<void>;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchEmployee = async () => {
    try {
      const response = await fetch('/api/employee/me');
      if (response.ok) {
        const data = await response.json();
        setEmployee(data.employee);
      } else if (response.status === 401) {
        // If unauthorized, redirect to login
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  return (
    <EmployeeContext.Provider value={{ employee, loading, refetchEmployee: fetchEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployee() {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
} 