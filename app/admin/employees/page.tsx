"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, X, Search, Users, Building2, Activity, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

// Define interface for employee data
interface Employee {
  id: string | number;
  name: string;
  email: string;
  company: string;
  department: string;
  status: string;
  joinDate: string;
}

// Empty initial employees array with proper typing
const initialEmployees: Employee[] = [];

// Analytics interface
interface EmployeeAnalytics {
  totalEmployees: number;
  activeEmployees: number;
  companies: number;
  departments: number;
  recentJoins: number;
  recentLeaves: number;
}

// Initial analytics state
const initialAnalytics: EmployeeAnalytics = {
  totalEmployees: 0,
  activeEmployees: 0,
  companies: 0,
  departments: 0,
  recentJoins: 0,
  recentLeaves: 0,
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [employeeAnalytics, setEmployeeAnalytics] = useState<EmployeeAnalytics>(initialAnalytics);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    department: "",
    status: "Active",
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Function to fetch employees data from Supabase
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      
      // Fetch employees data
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*');
      
      if (employeesError) {
        console.error('Error fetching employees:', employeesError);
        return;
      }

      // Fetch company data for counting
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('id');
      
      if (companiesError) {
        console.error('Error fetching companies:', companiesError);
      }

      // Format employee data
      if (employeesData) {
        // Transform the data to match our interface
        const formattedEmployees: Employee[] = employeesData.map(emp => ({
          id: emp.id,
          name: emp.name || emp.full_name || 'Unknown',
          email: emp.email || 'No email',
          company: emp.company_name || emp.company_id || 'Unknown',
          department: emp.department || emp.role || 'General',
          status: emp.status || 'Active',
          joinDate: emp.created_at || emp.join_date || new Date().toISOString().split('T')[0],
        }));

        setEmployees(formattedEmployees);

        // Calculate analytics
        const activeEmps = employeesData.filter(emp => emp.status === 'active' || emp.status === 'Active').length;
        const uniqueDepartments = new Set(employeesData.map(emp => emp.department || emp.role)).size;
        
        // Get recent joins (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentJoins = employeesData.filter(emp => {
          const joinDate = new Date(emp.created_at || emp.join_date);
          return joinDate >= thirtyDaysAgo;
        }).length;

        // Recent leaves estimation
        const recentLeaves = Math.floor(employeesData.filter(emp => 
          emp.status === 'inactive' || emp.status === 'Inactive'
        ).length * 0.3); // Assuming 30% of inactive are recent

        setEmployeeAnalytics({
          totalEmployees: employeesData.length,
          activeEmployees: activeEmps,
          companies: companiesData?.length || 0,
          departments: uniqueDepartments,
          recentJoins,
          recentLeaves,
        });
      }
    } catch (error) {
      console.error('Error in fetchEmployees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Add the employee to Supabase
      const { data, error } = await supabase
        .from('employees')
        .insert([{
          name: form.name,
          email: form.email,
          company_id: form.company, // Assuming company is the ID
          department: form.department,
          status: form.status,
          created_at: new Date().toISOString(),
        }])
        .select();

      if (error) {
        console.error('Error adding employee:', error);
        return;
      }

      // Refresh the employee list
      fetchEmployees();
      
      // Reset form and close modal
      setForm({
        name: "",
        email: "",
        company: "",
        department: "",
        status: "Active",
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error in handleAddEmployee:', error);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.company.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Employees
            </h2>
          </div>
          <p className="text-muted-foreground">Manage your employees and their details</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl hover:scale-105 transition-all duration-200 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-blue-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{employeeAnalytics.totalEmployees}</div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-blue-800">Active: {employeeAnalytics.activeEmployees}</span>
              <span className="text-xs text-gray-800">From database</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl hover:scale-105 transition-all duration-200 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building2 className="h-4 w-4 text-green-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{employeeAnalytics.companies}</div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-green-800">Departments: {employeeAnalytics.departments}</span>
              <span className="text-xs text-gray-800">Real data</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl hover:scale-105 transition-all duration-200 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-purple-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{employeeAnalytics.recentJoins}</div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-purple-800">New Joins</span>
              <span className="text-xs text-gray-800">Leaves: {employeeAnalytics.recentLeaves}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl hover:scale-105 transition-all duration-200 border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-orange-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {employeeAnalytics.totalEmployees ? 
                Math.round((employeeAnalytics.activeEmployees / employeeAnalytics.totalEmployees) * 100) : 0}%
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-orange-800">Active Rate</span>
              <span className="text-xs text-gray-800">Based on status</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-background"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Employees Table */}
      <Card className="bg-background border-border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-foreground">Employee List</CardTitle>
          <CardDescription>View and manage all employees in the system</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-foreground">Name</TableHead>
                  <TableHead className="text-foreground">Email</TableHead>
                  <TableHead className="text-foreground">Company</TableHead>
                  <TableHead className="text-foreground">Department</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="text-foreground">Join Date</TableHead>
                  <TableHead className="text-right text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={String(employee.id)} className="hover:bg-accent/50">
                      <TableCell className="font-medium text-foreground">{employee.name}</TableCell>
                      <TableCell className="text-foreground">{employee.email}</TableCell>
                      <TableCell className="text-foreground">{employee.company}</TableCell>
                      <TableCell className="text-foreground">{employee.department}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            employee.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          )}
                        >
                          {employee.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-foreground">
                        {new Date(employee.joinDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No employees found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative border border-border max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              onClick={() => setShowAddModal(false)}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-bold mb-2 text-foreground">Add New Employee</h3>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-foreground">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="department" className="text-foreground">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="status" className="text-foreground">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) => setForm({ ...form, status: value })}
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Add Employee
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 