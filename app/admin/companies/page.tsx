"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { COMPANY_INDUSTRY_OPTIONS } from "@/components/company/registration-form"

interface Company {
  id: string;
  name: string;
  email: string;
  industry: string;
  location: string;
  revenue: number;
  offers: number;
  status: string;
  created_at: string;
}

interface RegistrationRequest {
  id: string;
  name: string;
  industry: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  website: string;
  tax_id: string;
  description: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  status: string;
  created_at: string;
}

interface CompanyForm {
  name: string;
  email: string;
  industry: string;
  location: string;
  revenue: string;
  offers: string;
  status: "Active" | "Pending";
}

// Add this interface for the registration request details modal
interface RegistrationRequestDetailsModalProps {
  request: RegistrationRequest
  isOpen: boolean
  onClose: () => void
}

// Add this component for the registration request details modal
function RegistrationRequestDetailsModal({ request, isOpen, onClose }: RegistrationRequestDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Registration Request Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Company Name</h3>
              <p className="mt-1">{request.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Industry</h3>
              <p className="mt-1">{request.industry}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
              <p className="mt-1">{request.website}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Tax ID</h3>
              <p className="mt-1">{request.tax_id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Contact Name</h3>
              <p className="mt-1">{request.contact_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Contact Email</h3>
              <p className="mt-1">{request.contact_email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Contact Phone</h3>
              <p className="mt-1">{request.contact_phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <p className="mt-1">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {request.status}
                </span>
              </p>
            </div>
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
              <p className="mt-1">{request.address}</p>
              <p className="text-sm text-muted-foreground">
                {request.city}, {request.state} {request.postal_code}
              </p>
              <p className="text-sm text-muted-foreground">{request.country}</p>
            </div>
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-1">{request.description}</p>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
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
    revenue: "",
    offers: "",
    status: "Active"
  });
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter()
  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null)
  const [showRequestDetails, setShowRequestDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchRegistrationRequests = useCallback(async () => {
    try {
      setRequestsLoading(true);
      setRequestsError(null);

      const response = await fetch("/api/companies/requests");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch registration requests");
      }

      setRegistrationRequests(data.requests || []);
    } catch (err) {
      console.error('Registration requests fetch error:', err);
      setRequestsError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Failed to fetch registration requests');
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchCompanies = async () => {
      try {
        setCompaniesLoading(true);
        setCompaniesError(null);

        const supabase = createClientComponentClient();

        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select('*')
          .order('created_at', { ascending: false });

        if (companiesError) {
          throw new Error(`Companies fetch error: ${companiesError.message}`);
        }

        if (mounted) {
          setCompanies(companiesData || []);
        }
      } catch (err) {
        console.error('Companies fetch error:', err);
        if (mounted) {
          setCompaniesError(err instanceof Error ? err.message : 'An unknown error occurred');
          toast.error('Failed to fetch companies data');
        }
      } finally {
        if (mounted) {
          setCompaniesLoading(false);
        }
      }
    };

    fetchCompanies();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    fetchRegistrationRequests();
  }, [fetchRegistrationRequests]);

  const recentCompanies = useMemo(() => {
    if (!companies.length) return []
    return [...companies]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime(),
      )
      .slice(0, 4)
  }, [companies])

  const handleApproveRequest = async (requestId: string) => {
    try {
      setIsLoading(true)

      const response = await fetch('/api/companies/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve company')
      }

      // Show success message with the temporary password
      toast.success('Company approved successfully', {
        description: `Temporary password: ${data.password}\nPlease save this password and share it with the company.`
      })

      // Refresh the lists
      await fetchRegistrationRequests()

      const supabase = createClientComponentClient()
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (companiesError) {
        throw new Error('Failed to refresh companies list')
      }

      setCompanies(companiesData || [])
    } catch (error) {
      console.error('Error in handleApproveRequest:', error)
      toast.error('Failed to approve company', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      setIsLoading(true)

      const response = await fetch('/api/companies/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to reject registration request')
      }

      toast.success('Registration request rejected')

      await fetchRegistrationRequests()

      const supabase = createClientComponentClient()
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (companiesError) {
        throw new Error('Failed to refresh companies list')
      }

      setCompanies(companiesData || [])
    } catch (error) {
      console.error('Error in handleRejectRequest:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to reject registration request'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company);
    setShowDetails(true);
  };

  const handleEdit = (company: Company) => {
    router.push(`/admin/companies/${company.id}/edit`);
  };

  const handleDelete = async (companyId: string) => {
    try {
      const supabase = createClientComponentClient();
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;

      toast.success('Company deleted successfully');
      setCompanies((prev) => prev.filter((c) => c.id !== companyId));
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Failed to delete company');
    }
  };

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
    toast.warning("This modal is deprecated. Please use the Add Company button above.");
    setShowAddModal(false);
  };

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewRequestDetails = (request: RegistrationRequest) => {
    setSelectedRequest(request)
    setShowRequestDetails(true)
  }

  if (companiesLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium">Loading Companies...</div>
            <div className="text-sm text-muted-foreground">Please wait while we fetch the data</div>
          </div>
        </div>
      </div>
    )
  }

  if (companiesError) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium text-red-600">Error</div>
            <div className="text-sm text-muted-foreground">{companiesError}</div>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setCompaniesError(null);
                setCompaniesLoading(true);
                setCompanies([]);
              }}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

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
                  <p className="text-2xl font-bold">{companies.length}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Companies</p>
                  <p className="text-2xl font-bold">{companies.filter(c => c.status === 'Active').length}</p>
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
              {recentCompanies.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No companies have been added yet.
                </p>
              ) : (
                recentCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span>{company.industry || "—"}</span>
                        <span className="text-xs">
                          Added {new Date(company.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={company.status === "Active" ? "default" : "secondary"}
                      >
                        {company.status}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(company)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
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
                    <TableHead>Revenue</TableHead>
                    <TableHead>Offers</TableHead>
                    <TableHead>Created</TableHead>
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
                      <TableCell>${formatNumber(company.revenue)}</TableCell>
                    <TableCell>{company.offers}</TableCell>
                      <TableCell>{new Date(company.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(company)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(company)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(company.id)}>
                            <Trash2 className="h-4 w-4" />
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
                  <Select
                    value={form.industry}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger id="industry" className="h-10">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_INDUSTRY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" value={form.location} onChange={handleChange} required />
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

      {/* Registration Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registration Requests</CardTitle>
              <CardDescription>Review and manage company registration requests</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
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
          {requestsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-lg font-medium">Loading Registration Requests...</div>
                <div className="text-sm text-muted-foreground">Please wait while we fetch the data</div>
              </div>
            </div>
          ) : requestsError ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="text-lg font-medium text-red-600">Error</div>
                <div className="text-sm text-muted-foreground">{requestsError}</div>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setRequestsError(null)
                    setRequestsLoading(true)
                    setRegistrationRequests([])
                  }}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Company</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrationRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{request.name}</span>
                        <span className="text-xs text-muted-foreground">{request.website}</span>
                      </div>
                    </TableCell>
                    <TableCell>{request.industry}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{request.contact_name}</span>
                        <span className="text-xs text-muted-foreground">{request.contact_email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{request.city}, {request.state}</span>
                        <span className="text-xs text-muted-foreground">{request.country}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        request.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(request.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewRequestDetails(request)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRejectRequest(request.id)}
                            className="text-red-600"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleApproveRequest(request.id)}
                            className="text-green-600"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add the Registration Request Details Modal */}
      {selectedRequest && (
        <RegistrationRequestDetailsModal
          request={selectedRequest}
          isOpen={showRequestDetails}
          onClose={() => {
            setShowRequestDetails(false)
            setSelectedRequest(null)
          }}
        />
      )}

      {/* Company Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Company Details</DialogTitle>
          </DialogHeader>
          {selectedCompany && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Company Name</h3>
                  <p className="mt-1">{selectedCompany.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Industry</h3>
                  <p className="mt-1">{selectedCompany.industry}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="mt-1">{selectedCompany.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                  <p className="mt-1">{selectedCompany.location}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Revenue</h3>
                  <p className="mt-1">${formatNumber(selectedCompany.revenue)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Offers</h3>
                  <p className="mt-1">{selectedCompany.offers}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="mt-1">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      selectedCompany.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {selectedCompany.status}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created Date</h3>
                  <p className="mt-1">{new Date(selectedCompany.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
                <Button onClick={() => handleEdit(selectedCompany)}>
                  Edit Company
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
