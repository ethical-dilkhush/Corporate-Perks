"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Eye, Edit, Trash, Check, X } from "lucide-react";

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
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

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

  const filteredCompanies = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contact_email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
        <p className="text-muted-foreground">Manage registered companies</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="Search companies..."
            className="pl-8 pr-3 py-2 border rounded-md w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-2.5 top-2.5 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
        </div>
        <Button variant="outline">Filter</Button>
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium cursor-pointer" onClick={() => openModal(company)}>
                  {company.name}
                </TableCell>
                <TableCell>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {company.website}
                  </a>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      company.status === "approved"
                        ? "default"
                        : company.status === "pending"
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(company.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openModal(company)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          <Edit className="mr-2 h-4 w-4" />
                          Visit Website
                        </a>
                      </DropdownMenuItem>
                      {company.status === "pending" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => approveCompany(company.id)}>
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            Approve
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteCompany(company.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal for company details */}
      {modalOpen && selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-0 relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-2xl font-bold">{selectedCompany.name}</h2>
                <span className="inline-block mt-1">
                  <Badge
                    variant={
                      selectedCompany.status === "approved"
                        ? "default"
                        : selectedCompany.status === "pending"
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {selectedCompany.status.charAt(0).toUpperCase() + selectedCompany.status.slice(1)}
                  </Badge>
                </span>
              </div>
              <button
                className="text-gray-400 hover:text-gray-700 text-2xl"
                onClick={closeModal}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            {/* Modal Content */}
            <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div><strong>Industry:</strong> {selectedCompany.industry}</div>
                <div><strong>Address:</strong> {selectedCompany.address}</div>
                <div><strong>City:</strong> {selectedCompany.city}</div>
                <div><strong>State:</strong> {selectedCompany.state}</div>
                <div><strong>Country:</strong> {selectedCompany.country}</div>
                <div><strong>Postal Code:</strong> {selectedCompany.postal_code}</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold">Contact:</span>
                  <span>{selectedCompany.contact_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Email:</span>
                  <a href={`mailto:${selectedCompany.contact_email}`} className="text-blue-600 underline">
                    {selectedCompany.contact_email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Phone:</span>
                  <a href={`tel:${selectedCompany.contact_phone}`} className="text-blue-600 underline">
                    {selectedCompany.contact_phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Website:</span>
                  <a
                    href={selectedCompany.website}
                    className="text-blue-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedCompany.website}
                  </a>
                </div>
                <div><strong>Tax ID:</strong> {selectedCompany.tax_id}</div>
              </div>
              <div className="col-span-1 md:col-span-2 mt-4">
                <div><strong>Description:</strong> {selectedCompany.description}</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <strong>Created At:</strong> {new Date(selectedCompany.created_at).toLocaleString()}
                </div>
              </div>
            </div>
            {/* Modal Actions */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
              {selectedCompany.status === "pending" && (
                <Button onClick={() => approveCompany(selectedCompany.id)}>
                  Approve
                </Button>
              )}
              <Button variant="destructive" onClick={() => deleteCompany(selectedCompany.id)}>
                Delete
              </Button>
              <Button variant="outline" onClick={closeModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
