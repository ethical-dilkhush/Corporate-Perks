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
import { MoreHorizontal, Eye, Edit, Trash, Check, X, Plus, User, Users, Shield, Mail, Building2, Search, Filter } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  company_id: string;
  company_name: string;
  department: string;
  position: string;
  phone: string;
  status: string;
  created_at: string;
}

// Mock data for user analytics
const userAnalytics = {
  totalUsers: 120,
  activeUsers: 110,
  adminUsers: 5,
  companyUsers: 115,
}

// Mock data for recent users
const recentUsers = [
  {
    id: "1",
    email: "john.doe@techcorp.com",
    first_name: "John",
    last_name: "Doe",
    role: "admin",
    company_id: "1",
    company_name: "TechCorp Inc.",
    department: "Engineering",
    position: "Senior Developer",
    phone: "+1 234 567 8900",
    status: "Active",
  },
  {
    id: "2",
    email: "sarah.smith@globalsolutions.com",
    first_name: "Sarah",
    last_name: "Smith",
    role: "user",
    company_id: "2",
    company_name: "Global Solutions",
    department: "Marketing",
    position: "Marketing Manager",
    phone: "+1 234 567 8901",
    status: "Active",
  },
  {
    id: "3",
    email: "michael.chen@innovatelabs.com",
    first_name: "Michael",
    last_name: "Chen",
    role: "user",
    company_id: "3",
    company_name: "Innovate Labs",
    department: "Research",
    position: "Research Scientist",
    phone: "+1 234 567 8902",
    status: "Inactive",
  },
]

// Mock data for companies
const mockCompanies = [
  { id: "1", name: "TechCorp Inc." },
  { id: "2", name: "Global Solutions" },
  { id: "3", name: "Innovate Labs" },
] as const;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<typeof recentUsers[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "user",
    company_id: "",
    department: "",
    position: "",
    phone: "",
    status: "active",
    password: "",
    confirmPassword: ""
  });
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter()

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select(`
          *,
          companies (
            name
          )
        `)
        .order("created_at", { ascending: false });
      if (!error) setUsers(data || []);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  async function activateUser(id: string) {
    const { error } = await supabase
      .from("users")
      .update({ status: "active" })
      .eq("id", id);
    if (!error) {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "active" } : u))
      );
    }
  }

  async function deactivateUser(id: string) {
    const { error } = await supabase
      .from("users")
      .update({ status: "inactive" })
      .eq("id", id);
    if (!error) {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "inactive" } : u))
      );
    }
  }

  async function deleteUser(id: string) {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);
    if (!error) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setModalOpen(false);
      setSelectedUser(null);
    }
  }

  function openModal(user: typeof recentUsers[0]) {
    setSelectedUser(user);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedUser(null);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      setSuccess(false);
      setFormError('Passwords do not match');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.first_name,
          last_name: form.last_name,
          role: form.role,
          company_id: form.company_id,
          department: form.department,
          position: form.position,
          phone: form.phone,
          status: form.status
        }
      }
    });

    if (error) {
      setFormError('Error adding user. Please try again.');
      return;
    }

    if (data?.user) {
      const newUser: User = {
        id: data.user.id,
        email: data.user.email || '',
        first_name: form.first_name,
        last_name: form.last_name,
        role: form.role,
        company_id: form.company_id,
        company_name: mockCompanies.find((c: { id: string; name: string }) => c.id === form.company_id)?.name || '',
        department: form.department,
        position: form.position,
        phone: form.phone,
        status: form.status,
        created_at: new Date().toISOString()
      };
      setUsers([newUser, ...users]);
      setForm({
        email: "",
        first_name: "",
        last_name: "",
        role: "user",
        company_id: "",
        department: "",
        position: "",
        phone: "",
        status: "active",
        password: "",
        confirmPassword: ""
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowAddModal(false);
      }, 1200);
    }
  };

  const handleViewDetails = (user: typeof recentUsers[0]) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleEdit = (user: typeof recentUsers[0]) => {
    router.push(`/admin/users/${user.id}/edit`)
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage and monitor user accounts</p>
        </div>
        <Link href="/admin/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Analytics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Overview</CardTitle>
              <CardDescription>Current platform statistics</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{userAnalytics.totalUsers}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{userAnalytics.activeUsers}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Admin Users</p>
                  <p className="text-2xl font-bold">{userAnalytics.adminUsers}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Building2 className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company Users</p>
                  <p className="text-2xl font-bold">{userAnalytics.companyUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest user additions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{user.first_name} {user.last_name}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{user.email}</span>
                      <span>{user.company_name}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === "Active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {user.status}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(user)}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - User List or Details */}
        {showDetails && selectedUser ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{selectedUser.first_name} {selectedUser.last_name}</CardTitle>
                  <CardDescription>User Details</CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium">{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{selectedUser.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{selectedUser.company_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedUser.department}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Contact Information</p>
                  <div className="mt-2 space-y-2">
                    <p className="font-medium">{selectedUser.email}</p>
                    <p>{selectedUser.phone}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="mt-2">{selectedUser.position}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleEdit(selectedUser)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit User
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>Manage user accounts and settings</CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
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
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(user)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
