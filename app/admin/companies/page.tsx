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
import { MoreHorizontal, Eye, Edit, Trash, Check, X, Plus, Building2, Users, Package, Activity, Search, Filter, Edit2, Trash2, CheckCircle2, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/lib/utils";

interface Company {
  id: number;
  name: string;
  email: string;
  industry: string;
  location: string;
  employees: number;
  revenue: number;
  offers: number;
  status: "Active" | "Pending";
  joined: string;
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
    id: 1,
    name: "TechGadgets Inc.",
    email: "contact@techgadgets.com",
    industry: "Technology",
    location: "San Francisco, CA",
    employees: 150,
    revenue: 2500000,
    offers: 5,
    status: "Active",
    joined: "2023-01-15"
  },
  {
    id: 2,
    name: "CloudSoft Solutions",
    email: "info@cloudsoft.com",
    industry: "Cloud Services",
    location: "Austin, TX",
    employees: 75,
    revenue: 1200000,
    offers: 3,
    status: "Pending",
    joined: "2023-03-22"
  },
  {
    id: 3,
    name: "Green Energy Co.",
    email: "hello@greenenergy.com",
    industry: "Renewable Energy",
    location: "Denver, CO",
    employees: 200,
    revenue: 3500000,
    offers: 2,
    status: "Active",
    joined: "2023-02-10"
  }
]

interface CompanyForm {
  name: string;
  email: string;
  industry: string;
  location: string;
  employees: string;
  revenue: string;
  offers: string;
  status: "Active" | "Pending";
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(recentCompanies);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState<CompanyForm>({
    name: "",
    email: "",
    industry: "",
    location: "",
    employees: "",
    revenue: "",
    offers: "",
    status: "Active"
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

  async function approveCompany(id: number) {
    const { error } = await supabase
      .from("companies")
      .update({ status: "Active" })
      .eq("id", id);
    if (!error) {
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "Active" } : c))
      );
    }
  }

  async function deleteCompany(id: number) {
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

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const newCompany: Company = {
      id: companies.length + 1,
      name: form.name,
      email: form.email,
      industry: form.industry,
      location: form.location,
      employees: Number(form.employees),
      revenue: Number(form.revenue),
      offers: Number(form.offers),
      status: form.status,
      joined: new Date().toISOString().split('T')[0]
    };
    setCompanies([...companies, newCompany]);
    setForm({
      name: "",
      email: "",
      industry: "",
      location: "",
      employees: "",
      revenue: "",
      offers: "",
      status: "Active"
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowAddModal(false);
    }, 1200);
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
    c.email.toLowerCase().includes(search.toLowerCase())
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
                      variant={company.status === "Active" ? "default" : "secondary"}
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
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="font-medium">${formatNumber(selectedCompany.revenue)}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="mt-2">{selectedCompany.location}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="mt-2">{selectedCompany.email}</p>
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
                    <TableHead className="w-[200px]">Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Offers</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{company.name}</span>
                          <span className="text-xs text-muted-foreground">{company.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          company.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {company.status}
                        </span>
                      </TableCell>
                      <TableCell>{company.industry}</TableCell>
                      <TableCell>{company.location}</TableCell>
                      <TableCell>{formatNumber(company.employees)}</TableCell>
                      <TableCell>${formatNumber(company.revenue)}</TableCell>
                      <TableCell>{company.offers}</TableCell>
                      <TableCell>{new Date(company.joined).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(company)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteCompany(company.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
              <XCircle className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-bold mb-2 text-blue-700">Add New Company</h3>
            <form onSubmit={handleAddCompany} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input id="name" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" name="industry" value={form.industry} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" value={form.location} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employees">Number of Employees</Label>
                  <Input id="employees" name="employees" type="number" value={form.employees} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revenue">Annual Revenue</Label>
                  <Input id="revenue" name="revenue" type="number" value={form.revenue} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="offers">Number of Offers</Label>
                  <Input id="offers" name="offers" type="number" value={form.offers} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as "Active" | "Pending" })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                  </select>
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
