import { supabase } from "./supabase";

// This is a compatibility layer to make it easier to migrate from Prisma to Supabase
const prismaAdapter = {
  company: {
    create: async (data: { data: any }) => {
      const { data: newCompany, error } = await supabase
        .from('companies')
        .insert([{
          name: data.data.name,
          industry: data.data.industry,
          address: data.data.address,
          city: data.data.city,
          state: data.data.state,
          country: data.data.country,
          postal_code: data.data.postalCode,
          website: data.data.website,
          tax_id: data.data.taxId,
          description: data.data.description,
          status: data.data.status,
        }])
        .select()
        .single();

      if (error) throw error;
      return newCompany;
    },
    findMany: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
    findUnique: async (params: { where: { id: string } }) => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', params.where.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  },
  user: {
    create: async (data: { data: any }) => {
      // For user creation, we're using Supabase's auth system
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: data.data.email,
        password: Math.random().toString(36).slice(-8), // Generate a random password
        email_confirm: true,
      });

      if (authError) throw authError;

      // Then create the profile in the employees table
      const { data: userData, error: userError } = await supabase
        .from('employees')
        .insert([{
          auth_id: authData.user.id,
          name: data.data.name,
          email: data.data.email,
          phone: data.data.phone,
          role: data.data.role.toLowerCase(),
          company_id: data.data.companyId,
          status: 'active'
        }])
        .select()
        .single();

      if (userError) throw userError;
      return userData;
    },
    findMany: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  },
  // Add other models as needed
};

export const prisma = prismaAdapter;
export default prismaAdapter;
