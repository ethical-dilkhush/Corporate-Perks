"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Users, Tag, Ticket, BarChart, Settings, Plus, Edit2, Trash2, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { formatNumber } from "@/lib/utils"
import { supabase } from "@/lib/supabase";

// Define interfaces for type safety
interface Company {
  id: string | number;
  name: string;
  email: string;
  offers: number;
  status: string;
}

interface Offer {
  id: string | number;
  title: string;
  company: string;
  discount: string;
  validity: string;
  status: string;
}

// Initial companies state with proper typing
const initialCompanies: Company[] = [];

export default function AdminDashboardPage() {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
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
    offers: "",
    status: "Active",
    assignedEmail: "",
    assignedPassword: "",
    confirmAssignedPassword: ""
  });
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    pendingCompanies: 0,
    totalEmployees: 0,
    activeEmployees: 0,
    totalOffers: 0,
    activeOffers: 0,
    totalCoupons: 0,
    redeemedCoupons: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel for better performance
      const [
        { data: companiesData, error: companiesError },
        { data: employeesData, error: employeesError },
        { data: offersData, error: offersError },
        { data: couponsData, error: couponsError }
      ] = await Promise.all([
        supabase.from('companies').select('*'),
        supabase.from('employees').select('*'),
        supabase.from('offers').select('*'),
        supabase.from('coupons').select('*')
      ]);

      if (companiesError) throw companiesError;
      if (employeesError) throw employeesError;
      if (offersError) throw offersError;
      
      // Set companies data
      if (companiesData) {
        setCompanies(companiesData.map(company => ({
          id: company.id,
          name: company.name || company.company_name,
          email: company.email || company.contact_email,
          offers: 0, // Will be updated below
          status: company.status || 'Active'
        })));
      }

      // Set offers data with companies
      if (offersData) {
        setOffers(offersData.slice(0, 5).map(offer => ({
          id: offer.id,
          title: offer.title,
          company: offer.company_name || "Unknown",
          discount: offer.discount_type === "Percentage" ? `${offer.discount_value}%` : `$${offer.discount_value}`,
          validity: `${new Date(offer.end_date).toLocaleDateString()}`,
          status: offer.status || "Active"
        })));
      }

      // Calculate statistics
      const activeCompanies = companiesData?.filter(c => c.status === "Active").length || 0;
      const pendingCompanies = companiesData?.filter(c => c.status === "Pending").length || 0;
      
      setStats({
        totalCompanies: companiesData?.length || 0,
        activeCompanies,
        pendingCompanies,
        totalEmployees: employeesData?.length || 0,
        activeEmployees: employeesData?.filter(e => e.status === "active").length || 0,
        totalOffers: offersData?.length || 0,
        activeOffers: offersData?.filter(o => o.status === "Active").length || 0,
        totalCoupons: couponsData?.length || 0,
        redeemedCoupons: couponsData?.filter(c => c.redeemed).length || 0,
        totalRevenue: 0, // Set to 0 as required
        monthlyRevenue: 0 // Set to 0 as required
      });
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    setCompanies([
      ...companies,
      {
        id: companies.length + 1,
        name: form.name,
        email: form.assignedEmail,
        offers: Number(form.offers),
        status: form.status,
      },
    ]);
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
      offers: "",
      status: "Active",
      assignedEmail: "",
      assignedPassword: "",
      confirmAssignedPassword: ""
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowAddModal(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/admin/companies/new">
            <Button
              variant="outline"
              className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:text-white transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Company
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="w-full min-w-[220px] p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl hover:scale-105 transition-all duration-200 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building className="h-4 w-4 text-blue-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.totalCompanies}</div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-blue-800">Active: {stats.activeCompanies}</span>
              <span className="text-xs text-yellow-800">Pending: {stats.pendingCompanies}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full min-w-[220px] p-4 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl hover:scale-105 transition-all duration-200 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-green-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.totalEmployees}</div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-green-800">Active: {stats.activeEmployees}</span>
              <span className="text-xs text-gray-800">+16% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full min-w-[220px] p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-xl hover:scale-105 transition-all duration-200 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offers & Coupons</CardTitle>
            <Tag className="h-4 w-4 text-yellow-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">{stats.totalOffers}</div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-yellow-800">Active: {stats.activeOffers}</span>
              <span className="text-xs text-gray-800">Coupons: {stats.totalCoupons}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full min-w-[220px] p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl hover:scale-105 transition-all duration-200 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <BarChart className="h-4 w-4 text-purple-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">$0</div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-purple-800">Monthly: $0</span>
              <span className="text-xs text-green-800">+0% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Companies Section */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Companies</CardTitle>
              <CardDescription>Latest registered companies</CardDescription>
            </div>
            <Link href="/admin/companies">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Offers</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : companies.length > 0 ? (
                    companies.slice(0, 5).map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            company.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {company.status}
                          </span>
                        </TableCell>
                        <TableCell>{company.offers}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No companies found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Offers Section */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Offers</CardTitle>
              <CardDescription>Latest offers and their status</CardDescription>
            </div>
            <Link href="/admin/offers">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : offers.length > 0 ? (
                    offers.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell className="font-medium">{offer.title}</TableCell>
                        <TableCell>{offer.company}</TableCell>
                        <TableCell>{offer.discount}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            {offer.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No offers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Coupon Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Generated</span>
                <span className="font-medium">{stats.totalCoupons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Redeemed</span>
                <span className="font-medium">{stats.redeemedCoupons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Redemption Rate</span>
                <span className="font-medium">{(stats.redeemedCoupons / stats.totalCoupons * 100).toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employee Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Employees</span>
                <span className="font-medium">{stats.activeEmployees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Inactive Employees</span>
                <span className="font-medium">{stats.totalEmployees - stats.activeEmployees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Engagement Rate</span>
                <span className="font-medium">{(stats.activeEmployees / stats.totalEmployees * 100).toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Revenue</span>
                <span className="font-medium">${formatNumber(stats.totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                <span className="font-medium">${formatNumber(stats.monthlyRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Growth Rate</span>
                <span className="font-medium text-green-600">+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
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
            <form
              onSubmit={e => {
                e.preventDefault();
                if (form.assignedPassword !== form.confirmAssignedPassword) {
                  setSuccess(false);
                  setFormError('Passwords do not match');
                  return;
                }
                setFormError('');
                handleAddCompany(e);
              }}
              className="space-y-4"
            >
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
                  <Label htmlFor="offers">Number of Offers</Label>
                  <Input id="offers" name="offers" type="number" min="0" value={form.offers} onChange={handleChange} required className="mt-1" />
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-blue-200 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              {/* Assigned Email & Password */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="assignedEmail">Assigned Email</Label>
                  <Input id="assignedEmail" name="assignedEmail" type="email" value={form.assignedEmail || ''} onChange={handleChange} required className="mt-1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedPassword">Assigned Password</Label>
                  <Input id="assignedPassword" name="assignedPassword" type="password" value={form.assignedPassword || ''} onChange={handleChange} required className="mt-1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmAssignedPassword">Confirm Assigned Password</Label>
                  <Input id="confirmAssignedPassword" name="confirmAssignedPassword" type="password" value={form.confirmAssignedPassword || ''} onChange={handleChange} required className="mt-1" />
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
