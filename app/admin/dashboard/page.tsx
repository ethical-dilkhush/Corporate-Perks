"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Users, Tag, Ticket, BarChart, Settings, Plus, Edit2, Trash2, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Mock data for companies
const initialCompanies = [
  { id: 1, name: "TechGadgets Inc.", email: "contact@techgadgets.com", offers: 5, status: "Active" },
  { id: 2, name: "CloudSoft Solutions", email: "info@cloudsoft.com", offers: 3, status: "Pending" },
  { id: 3, name: "Green Energy Co.", email: "hello@greenenergy.com", offers: 2, status: "Active" },
];
// Mock data for offers
const offers = [
  { id: 1, title: "20% off at TechGadgets", company: "TechGadgets Inc.", discount: "20%", validity: "30 days", status: "Active" },
  { id: 2, title: "50% off Premium Coffee", company: "BeanBrew Coffee", discount: "50%", validity: "60 days", status: "Active" },
];

export default function AdminDashboardPage() {
  const [companies, setCompanies] = useState(initialCompanies);
  const [showAddModal, setShowAddModal] = useState(false);
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
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
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
      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="w-full min-w-[220px] p-4 bg-blue-100 hover:bg-blue-200 hover:shadow-xl hover:scale-105 transition-all duration-200 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building className="h-4 w-4 text-blue-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{companies.length}</div>
            <p className="text-xs text-blue-800">+2 this month</p>
          </CardContent>
        </Card>
        <Card className="w-full min-w-[220px] p-4 bg-green-100 hover:bg-green-200 hover:shadow-xl hover:scale-105 transition-all duration-200 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-green-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">1,284</div>
            <p className="text-xs text-green-800">+16% from last month</p>
          </CardContent>
        </Card>
        <Card className="w-full min-w-[220px] p-4 bg-yellow-100 hover:bg-yellow-200 hover:shadow-xl hover:scale-105 transition-all duration-200 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
            <Tag className="h-4 w-4 text-yellow-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900">24</div>
            <p className="text-xs text-yellow-800">+4 this month</p>
          </CardContent>
        </Card>
        <Card className="w-full min-w-[220px] p-4 bg-purple-100 hover:bg-purple-200 hover:shadow-xl hover:scale-105 transition-all duration-200 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coupons Generated</CardTitle>
            <Ticket className="h-4 w-4 text-purple-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">3,891</div>
            <p className="text-xs text-purple-800">+12% from last month</p>
          </CardContent>
        </Card>
      </div>
      {/* Main Sections */}
      <div className="flex flex-col gap-10">
        <Card className="w-full p-10 min-h-[420px] min-w-[420px]">
          <CardHeader>
            <CardTitle>Companies</CardTitle>
            <CardDescription>Manage registered companies and their offers</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-4 flex flex-col justify-between h-full">
            <div className="w-full">
              <Table className="w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Offers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell>{company.email}</TableCell>
                      <TableCell>{company.offers}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${company.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{company.status}</span>
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <Card className="w-full p-10 min-h-[420px] min-w-[420px]">
          <CardHeader>
            <CardTitle>Offers</CardTitle>
            <CardDescription>View and manage all offers</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-4 flex flex-col justify-between h-full">
            <div className="w-full">
              <Table className="w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Validity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">{offer.title}</TableCell>
                      <TableCell>{offer.company}</TableCell>
                      <TableCell>{offer.discount}</TableCell>
                      <TableCell>{offer.validity}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">{offer.status}</span>
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
                  ))}
                </TableBody>
              </Table>
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
