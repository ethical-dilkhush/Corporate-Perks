import { supabase } from "./supabase";

let prisma: any;

// Try to import Prisma if it's available
try {
  const { PrismaClient } = require('@prisma/client');
  const globalForPrisma = global as unknown as { prisma: any };
  
  // If Prisma is available, initialize it
  prisma = globalForPrisma.prisma || new PrismaClient({ log: ["query"] });
  
  // Save prisma client to global object in development to prevent multiple instances
  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
} catch (error) {
  // If Prisma is not available, create a compatibility layer using Supabase
  console.log("Prisma client not available, using Supabase adapter instead");
  
  prisma = {
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
      findMany: async (params?: any) => {
        let query = supabase.from('companies').select('*');
        
        if (params?.where?.companyId) {
          query = query.eq('id', params.where.companyId);
        }
        
        const { data, error } = await query;
        
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
    offer: {
      create: async (data: { data: any }) => {
        const { data: newOffer, error } = await supabase
          .from('offers')
          .insert([{
            title: data.data.title,
            description: data.data.description,
            discount_value: data.data.discountValue,
            start_date: data.data.validFrom,
            end_date: data.data.validUntil,
            partner_id: data.data.companyId,
            eligible_companies: data.data.eligibleCompanies,
            created_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (error) throw error;
        return { ...newOffer, id: newOffer.id };
      },
      findMany: async (params?: any) => {
        let query = supabase.from('offers').select('*');
        
        if (params?.where?.companyId) {
          query = query.eq('partner_id', params.where.companyId);
        }
        
        if (params?.orderBy?.createdAt) {
          const direction = params.orderBy.createdAt === 'desc' ? 'desc' : 'asc';
          query = query.order('created_at', { ascending: direction === 'asc' });
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data || [];
      }
    }
  };
}

export { prisma };
export default prisma;
