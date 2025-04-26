"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Eye, Edit, Trash, Check, X, Plus, Building2, Users, Package, Activity, Search, Filter } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface Company {
  id: string;
  name: string;
  industry: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  tax_id: string;
  description: string;
  status: string;
  created_at: string;
  employees?: number;
  deals?: number;
}

// Mock data for company analytics
const companyAnalytics = {
  totalCompanies: 45,
  activeCompanies: 38,
  totalEmployees: 1250,
  totalDeals: 320,
}

// Mock data for recent companies
const recentCompanies: Company[] = [
  {
    id: "1",
    name: "TechCorp Inc.",
    industry: "Technology",
    address: "123 Tech Street",
    city: "Silicon Valley",
    state: "CA",
    country: "USA",
    postal_code: "94025",
    contact_name: "John Smith",
    contact_email: "john@techcorp.com",
    contact_phone: "+1 234 567 8900",
    website: "https://techcorp.com",
    tax_id: "123456789",
    description: "Leading technology solutions provider",
    status: "approved",
    created_at: "2024-01-01",
    employees: 250,
    deals: 15
  },
  {
    id: "2",
    name: "Global Solutions",
    industry: "Consulting",
    address: "456 Global Avenue",
    city: "New York",
    state: "NY",
    country: "USA",
    postal_code: "10001",
    contact_name: "Sarah Johnson",
    contact_email: "sarah@globalsolutions.com",
    contact_phone: "+1 234 567 8901",
    website: "https://globalsolutions.com",
    tax_id: "987654321",
    description: "International business consulting firm",
    status: "pending",
    created_at: "2024-01-02",
    employees: 180,
    deals: 12
  },
  {
    id: "3",
    name: "Innovate Labs",
    industry: "Research",
    address: "789 Innovation Drive",
    city: "Boston",
    state: "MA",
    country: "USA",
    postal_code: "02108",
    contact_name: "Michael Chen",
    contact_email: "michael@innovatelabs.com",
    contact_phone: "+1 234 567 8902",
    website: "https://innovatelabs.com",
    tax_id: "456789123",
    description: "Cutting-edge research and development",
    status: "approved",
    created_at: "2024-01-03",
    employees: 95,
    deals: 8
  }
]

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    name: "",
    industry: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    taxId: "",
    description: "",
    status: "pending",
    assignedEmail: "",
    assignedPassword: "",
    confirmAssignedPassword: ""
  });
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter()

  useEffect(() => {
    async function fetchCompanies() {
      setLoading(true);
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setCompanies(data || []);
      setLoading(false);
    }
    fetchCompanies();
  }, []);

  async function approveCompany(id: string) {
    const { error } = await supabase
      .from("companies")
      .update({ status: "approved" })
      .eq("id", id);
    if (!error) {
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "approved" } : c))
      );
    }
  }

  async function deleteCompany(id: string) {
    const { error } = await supabase
      .from("companies")
      .delete()
      .eq("id", id);
    if (!error) {
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      setModalOpen(false);
      setSelectedCompany(null);
    }
  }

  function openModal(company: Company) {
    setSelectedCompany(company);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedCompany(null);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.assignedPassword !== form.confirmAssignedPassword) {
      setSuccess(false);
      setFormError('Passwords do not match');
      return;
    }

    const { data, error } = await supabase.from("companies").insert([
      {
        name: form.name,
        industry: form.industry,
        address: form.address,
        city: form.city,
        state: form.state,
        country: form.country,
        postal_code: form.postalCode,
        contact_name: form.contactName,
        contact_email: form.contactEmail,
        contact_phone: form.contactPhone,
        website: form.website,
        tax_id: form.taxId,
        description: form.description,
        status: form.status
      }
    ]).select();

    if (error) {
      setFormError('Error adding company. Please try again.');
      return;
    }

    if (data) {
      setCompanies([data[0], ...companies]);
      setForm({
        name: "",
        industry: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        website: "",
        taxId: "",
        description: "",
        status: "pending",
        assignedEmail: "",
        assignedPassword: "",
        confirmAssignedPassword: ""
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowAddModal(false);
      }, 1200);
    }
  };

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company);
    setShowDetails(true);
  };

  const handleEdit = (company: Company) => {
    router.push(`/admin/companies/${company.id}/edit`);
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contact_email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-muted-foreground">Manage and monitor company accounts</p>
        </div>
        <Link href="/admin/companies/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Analytics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Overview</CardTitle>
              <CardDescription>Current platform statistics</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Companies</p>
                  <p className="text-2xl font-bold">{companyAnalytics.totalCompanies}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Companies</p>
                  <p className="text-2xl font-bold">{companyAnalytics.activeCompanies}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Employees</p>
                  <p className="text-2xl font-bold">{companyAnalytics.totalEmployees}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Deals</p>
                  <p className="text-2xl font-bold">{companyAnalytics.totalDeals}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Companies</CardTitle>
              <CardDescription>Latest company additions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCompanies.map((company) => (
                <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{company.industry}</span>
                      <span>{company.employees} employees</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={company.status === "approved" ? "default" : "secondary"}
                    >
                      {company.status}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(company)}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Company List or Details */}
        {showDetails && selectedCompany ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{selectedCompany.name}</CardTitle>
                  <CardDescription>Company Details</CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p className="font-medium">{selectedCompany.industry}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{selectedCompany.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employees</p>
                  <p className="font-medium">{selectedCompany.employees}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Deals</p>
                  <p className="font-medium">{selectedCompany.deals}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contact Information</p>
                  <div className="mt-2 space-y-2">
                    <p className="font-medium">{selectedCompany.contact_name}</p>
                    <p>{selectedCompany.contact_email}</p>
                    <p>{selectedCompany.contact_phone}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="mt-2">{selectedCompany.address}, {selectedCompany.city}, {selectedCompany.state}, {selectedCompany.country}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <a 
                    href={selectedCompany.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mt-2 block"
                  >
                    {selectedCompany.website}
                  </a>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="mt-2">{selectedCompany.description}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleEdit(selectedCompany)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Company
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Companies</CardTitle>
                  <CardDescription>Manage company accounts and settings</CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search companies..."
                      className="pl-8"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{company.name}</p>
                            <p className="text-sm text-muted-foreground">{company.website}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{company.industry}</TableCell>
                      <TableCell>{company.employees}</TableCell>
                      <TableCell>
                        <Badge
                          variant={company.status === "approved" ? "default" : "secondary"}
                        >
                          {company.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(company)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteCompany(company.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(company)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative border-2 border-blue-200 animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-blue-600 hover:text-blue-800"
              onClick={() => setShowAddModal(false)}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-bold mb-2 text-blue-700">Add New Company</h3>
            <form onSubmit={handleAddCompany} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Company Information */}
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input id="name" name="name" value={form.name} onChange={handleChange} required className="mt-1" />
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" name="industry" value={form.industry || ''} onChange={handleChange} required className="mt-1" />
                  <Label htmlFor="address">Company Address</Label>
                  <Input id="address" name="address" value={form.address || ''} onChange={handleChange} required className="mt-1" />
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={form.city || ''} onChange={handleChange} required className="mt-1" />
                  <Label htmlFor="state">State/Province</Label>
                  <Input id="state" name="state" value={form.state || ''} onChange={handleChange} required className="mt-1" />
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" value={form.country || ''} onChange={handleChange} required className="mt-1" />
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" name="postalCode" value={form.postalCode || ''} onChange={handleChange} required className="mt-1" />
                </div>
                {/* Contact Information */}
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person Name</Label>
                  <Input id="contactName" name="contactName" value={form.contactName || ''} onChange={handleChange} required className="mt-1" />
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input id="contactEmail" name="contactEmail" type="email" value={form.contactEmail || ''} onChange={handleChange} required className="mt-1" />
                  <Label htmlFor="contactPhone">Contact Phone Number</Label>
                  <Input id="contactPhone" name="contactPhone" value={form.contactPhone || ''} onChange={handleChange} required className="mt-1" />
                  <Label htmlFor="website">Website URL</Label>
                  <Input id="website" name="website" value={form.website || ''} onChange={handleChange} required className="mt-1" />
                </div>
                {/* Additional Details */}
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID/VAT Number</Label>
                  <Input id="taxId" name="taxId" value={form.taxId || ''} onChange={handleChange} required className="mt-1" />
                  <Label htmlFor="description">Company Description</Label>
                  <Input id="description" name="description" value={form.description || ''} onChange={handleChange} required className="mt-1" />
                </div>
              </div>
              {/* Assigned Email & Password */}
              <div className="space-y-4 mt-4">
                <h4 className="text-sm font-medium text-blue-700 mb-2">Account Credentials</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assignedEmail">Assigned Email</Label>
                    <Input id="assignedEmail" name="assignedEmail" type="email" value={form.assignedEmail || ''} onChange={handleChange} required className="mt-1" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assignedPassword">Assigned Password</Label>
                      <Input id="assignedPassword" name="assignedPassword" type="password" value={form.assignedPassword || ''} onChange={handleChange} required className="mt-1" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmAssignedPassword">Confirm Password</Label>
                      <Input id="confirmAssignedPassword" name="confirmAssignedPassword" type="password" value={form.confirmAssignedPassword || ''} onChange={handleChange} required className="mt-1" />
                    </div>
                  </div>
                </div>
              </div>
              {formError && <div className="text-red-600 text-center font-medium mt-2">{formError}</div>}
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:text-white mt-2"
              >
                Add Company
              </Button>
              {success && <div className="text-green-600 text-center font-medium mt-2">Company added successfully!</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
