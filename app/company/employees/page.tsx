"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, Edit2, Trash2, Mail, Phone, Check, X, MoreHorizontal, Eye, User, MapPin, ChartBar } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Remove mock data and add interface
interface RegistrationRequest {
  id: number
  name: string
  email: string
  mobile: string
  role: string
  status: string
  requested_at: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
}

interface Employee {
  id: number
  name: string
  email: string
  mobile: string
  role: string
  status: string
  department: string
  address: string
  city: string
  state: string
  country: string
  postal_code: string
  redemptions: number
  savings: number
  created_at: string
}

export default function EmployeesPage() {
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [employeeForms, setEmployeeForms] = useState([{ id: 1 }])
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isEmployeeDetailsOpen, setIsEmployeeDetailsOpen] = useState(false)
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchRegistrationRequests()
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEmployees(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch employees",
        variant: "destructive",
      })
    }
  }

  const fetchRegistrationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('pending_employee_registrations')
        .select('*')
        .eq('status', 'pending')
        .order('requested_at', { ascending: false })

      if (error) throw error
      setRegistrationRequests(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch registration requests",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (request: RegistrationRequest) => {
    setSelectedRequest(request)
    setIsViewDetailsOpen(true)
  }

  const handleApprove = async (requestId: number) => {
    try {
      // Start transaction
      const { data: pendingData, error: fetchError } = await supabase
        .from('pending_employee_registrations')
        .select('*')
        .eq('id', requestId)
        .single()

      if (fetchError) throw fetchError

      // Create employee account
      const { error: insertError } = await supabase
        .from('employees')
        .insert({
          name: pendingData.name,
          email: pendingData.email,
          mobile: pendingData.mobile,
          role: pendingData.role,
          address: pendingData.address,
          city: pendingData.city,
          state: pendingData.state,
          country: pendingData.country,
          postal_code: pendingData.postal_code,
          password_hash: pendingData.password_hash,
          company_id: pendingData.company_id,
          status: 'active'
        })

      if (insertError) throw insertError

      // Update registration status
      const { error: updateError } = await supabase
        .from('pending_employee_registrations')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', requestId)

      if (updateError) throw updateError

      toast({
        title: "Success",
        description: "Employee registration approved successfully",
      })

      // Refresh the lists
      fetchRegistrationRequests()
      fetchEmployees()
      setIsViewDetailsOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve registration",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (requestId: number) => {
    try {
      const { error } = await supabase
        .from('pending_employee_registrations')
        .update({ 
          status: 'rejected',
          rejected_at: new Date().toISOString()
        })
        .eq('id', requestId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Registration request rejected",
      })

      // Refresh the list
      fetchRegistrationRequests()
      setIsViewDetailsOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject registration",
        variant: "destructive",
      })
    }
  }

  const addNewEmployeeForm = () => {
    setEmployeeForms([...employeeForms, { id: employeeForms.length + 1 }])
  }

  const removeEmployeeForm = (id: number) => {
    if (employeeForms.length > 1) {
      setEmployeeForms(employeeForms.filter(form => form.id !== id))
    }
  }

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsEmployeeDetailsOpen(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsEditEmployeeOpen(true)
  }

  const handleDeleteEmployee = async (employeeId: number) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId)

      if (error) throw error

      // Update local state
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId))
      setIsDeleteConfirmOpen(false)
      setSelectedEmployee(null)

      toast({
        title: "Success",
        description: "Employee deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      })
    }
  }

  const handleUpdateEmployee = async (updatedData: Partial<Employee>) => {
    if (!selectedEmployee) return

    try {
      const { data, error } = await supabase
        .from('employees')
        .update(updatedData)
        .eq('id', selectedEmployee.id)
        .select()

      if (error) throw error

      // Update local state
      setEmployees(prev => 
        prev.map(emp => emp.id === selectedEmployee.id ? { ...emp, ...updatedData } : emp)
      )
      setIsEditEmployeeOpen(false)
      setSelectedEmployee(null)

      toast({
        title: "Success",
        description: "Employee details updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employee details",
        variant: "destructive",
      })
    }
  }

  // Update the employee table row actions
  const employeeActions = (employee: Employee) => (
    <TableCell className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => window.location.href = `mailto:${employee.email}`}>
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleViewEmployee(employee)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
            <Edit2 className="mr-2 h-4 w-4 text-blue-600" />
            Edit Employee
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => {
              setSelectedEmployee(employee)
              setIsDeleteConfirmOpen(true)
            }}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Employee
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  )

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Employee{employeeForms.length > 1 ? `s (${employeeForms.length})` : ''}</DialogTitle>
                <DialogDescription>
                  Enter the details of the new employee{employeeForms.length > 1 ? 's' : ''}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {employeeForms.map((form, index) => (
                  <div key={form.id} className="space-y-4">
                    {index > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Employee {index + 1}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEmployeeForm(form.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`name-${form.id}`}>Full Name</Label>
                        <Input id={`name-${form.id}`} placeholder="Enter full name" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`email-${form.id}`}>Email</Label>
                        <Input id={`email-${form.id}`} type="email" placeholder="Enter email" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`mobile-${form.id}`}>Mobile Number</Label>
                        <Input id={`mobile-${form.id}`} placeholder="Enter mobile number" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`role-${form.id}`}>Role</Label>
                        <Input id={`role-${form.id}`} placeholder="Enter role" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`address-${form.id}`}>Address</Label>
                      <Textarea
                        id={`address-${form.id}`}
                        placeholder="Enter complete address"
                        className="min-h-[80px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                        <Label htmlFor={`city-${form.id}`}>City</Label>
                        <Input id={`city-${form.id}`} placeholder="Enter city" />
                </div>
                <div className="grid gap-2">
                        <Label htmlFor={`state-${form.id}`}>State/Province</Label>
                        <Input id={`state-${form.id}`} placeholder="Enter state/province" />
                </div>
                <div className="grid gap-2">
                        <Label htmlFor={`country-${form.id}`}>Country</Label>
                        <Input id={`country-${form.id}`} placeholder="Enter country" />
                </div>
                <div className="grid gap-2">
                        <Label htmlFor={`postalCode-${form.id}`}>Postal Code</Label>
                        <Input id={`postalCode-${form.id}`} placeholder="Enter postal code" />
                      </div>
                    </div>
                    {index === employeeForms.length - 1 && (
                      <div className="flex justify-between items-center">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addNewEmployeeForm}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add More
                        </Button>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setIsAddEmployeeOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" onClick={() => {
                            setIsAddEmployeeOpen(false)
                            router.push("/company/employees/new")
                          }}>
                            Register Employee{employeeForms.length > 1 ? 's' : ''}
                          </Button>
                        </div>
                      </div>
                    )}
                </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
          <CardDescription>
            Manage your employees and their benefits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Redemptions</TableHead>
                <TableHead>Savings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      employee.status === "Active" 
                        ? "bg-green-500 text-white" 
                        : "bg-green-100 text-gray-800"
                    }`}>
                      {employee.status}
                    </span>
                  </TableCell>
                  <TableCell>{employee.redemptions}</TableCell>
                  <TableCell>{employee.savings}</TableCell>
                  {employeeActions(employee)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

        <Card>
          <CardHeader>
            <CardTitle>New Registration Requests</CardTitle>
            <CardDescription>
              Review and manage employee registration requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrationRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.mobile}</TableCell>
                      <TableCell>{request.role}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(request.requested_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleApprove(request.id)}>
                              <Check className="mr-2 h-4 w-4 text-green-600" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(request.id)}>
                              <X className="mr-2 h-4 w-4 text-red-600" />
                              Reject
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
      </div>

      {/* View Details Modal */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-2xl">Employee Registration Details</DialogTitle>
            <DialogDescription>
              Review the employee registration information before making a decision
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="mt-6">
              {/* Status Badge */}
              <div className="mb-6 flex items-center justify-center">
                <span className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium bg-yellow-100 text-yellow-800">
                  Pending Approval
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information Card */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Full Name</span>
                      <span className="font-medium">{selectedRequest.name}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Email Address</span>
                      <span className="font-medium">{selectedRequest.email}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Mobile Number</span>
                      <span className="font-medium">{selectedRequest.mobile}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Role</span>
                      <span className="font-medium">{selectedRequest.role}</span>
                    </div>
                  </div>
                </div>

                {/* Address Information Card */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Street Address</span>
                      <span className="font-medium">{selectedRequest.address}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-500">City</span>
                        <span className="font-medium">{selectedRequest.city}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-500">State/Province</span>
                        <span className="font-medium">{selectedRequest.state}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-500">Country</span>
                        <span className="font-medium">{selectedRequest.country}</span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-gray-500">Postal Code</span>
                        <span className="font-medium">{selectedRequest.postal_code}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Date */}
              <div className="mt-6 text-center text-sm text-gray-500">
                Registration submitted on {new Date(selectedRequest.requested_at).toLocaleDateString()} at {new Date(selectedRequest.requested_at).toLocaleTimeString()}
              </div>
            </div>
          )}
          <DialogFooter className="mt-8 flex items-center justify-between border-t pt-6">
            <div className="flex items-center gap-3">
              <Button
                variant="destructive"
                onClick={() => selectedRequest && handleReject(selectedRequest.id)}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Reject Request
              </Button>
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700 gap-2"
                onClick={() => selectedRequest && handleApprove(selectedRequest.id)}
              >
                <Check className="h-4 w-4" />
                Approve Request
              </Button>
            </div>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Details Modal */}
      <Dialog open={isEmployeeDetailsOpen} onOpenChange={setIsEmployeeDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-2xl">Employee Details</DialogTitle>
            <DialogDescription>
              View employee information and performance metrics
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information Card */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Full Name</span>
                      <span className="font-medium">{selectedEmployee.name}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Email Address</span>
                      <span className="font-medium">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Role</span>
                      <span className="font-medium">{selectedEmployee.role}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Department</span>
                      <span className="font-medium">{selectedEmployee.department}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics Card */}
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <ChartBar className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Total Redemptions</span>
                      <span className="font-medium">{selectedEmployee.redemptions}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Total Savings</span>
                      <span className="font-medium">${selectedEmployee.savings.toFixed(2)}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        selectedEmployee.status === "Active" 
                          ? "bg-green-500 text-white" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {selectedEmployee.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Employee Modal */}
      <Dialog open={isEditEmployeeOpen} onOpenChange={setIsEditEmployeeOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information and details
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleUpdateEmployee({
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                mobile: formData.get('mobile') as string,
                role: formData.get('role') as string,
                department: formData.get('department') as string,
                status: formData.get('status') as string,
                address: formData.get('address') as string,
                city: formData.get('city') as string,
                state: formData.get('state') as string,
                country: formData.get('country') as string,
                postal_code: formData.get('postal_code') as string
              })
            }} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={selectedEmployee.name}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={selectedEmployee.email}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      defaultValue={selectedEmployee.mobile}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      name="role"
                      defaultValue={selectedEmployee.role}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      defaultValue={selectedEmployee.department}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={selectedEmployee.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Address Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      defaultValue={selectedEmployee.address}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        defaultValue={selectedEmployee.city}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        defaultValue={selectedEmployee.state}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        defaultValue={selectedEmployee.country}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal_code">Postal Code</Label>
                      <Input
                        id="postal_code"
                        name="postal_code"
                        defaultValue={selectedEmployee.postal_code}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics Section (Read-only) */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Total Redemptions</Label>
                    <div className="p-2 bg-gray-50 rounded border">
                      {selectedEmployee.redemptions}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Total Savings</Label>
                    <div className="p-2 bg-gray-50 rounded border">
                      ${selectedEmployee.savings.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditEmployeeOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-x-2 flex justify-end">
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedEmployee && handleDeleteEmployee(selectedEmployee.id)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 