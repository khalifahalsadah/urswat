import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTalents, fetchCompanies, updateTalent, updateCompany, deleteTalent, deleteCompany, registerTalent, registerCompany } from "../lib/api";
import type { Talent, Company, InsertTalent, InsertCompany } from "@db/schema";
import { insertTalentSchema, insertCompanySchema } from "@db/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("talents");
  const [editingTalent, setEditingTalent] = useState<Talent | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const talentForm = useForm<InsertTalent>({
    resolver: zodResolver(insertTalentSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      skills: "",
      experience: "",
    },
  });

  const companyForm = useForm<InsertCompany>({
    resolver: zodResolver(insertCompanySchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      industry: "",
      requirements: "",
    },
  });

  const talentMutation = useMutation({
    mutationFn: registerTalent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talents"] });
      toast({ title: "Talent added successfully" });
      talentForm.reset();
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to add talent", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const companyMutation = useMutation({
    mutationFn: registerCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Company added successfully" });
      companyForm.reset();
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to add company", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const talentsQuery = useQuery({
    queryKey: ["talents"],
    queryFn: fetchTalents,
  });

  const companiesQuery = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });

  const updateTalentMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<InsertTalent>) => updateTalent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talents"] });
      toast({ title: "Talent updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update talent", variant: "destructive" });
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<InsertCompany>) => updateCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Company updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update company", variant: "destructive" });
    },
  });

  const deleteTalentMutation = useMutation({
    mutationFn: deleteTalent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talents"] });
      toast({ title: "Talent deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete talent", variant: "destructive" });
    },
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({ title: "Company deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete company", variant: "destructive" });
    },
  });

  const handleDeleteTalent = (id: number) => {
    if (confirm("Are you sure you want to delete this talent?")) {
      deleteTalentMutation.mutate(id);
    }
  };

  const handleDeleteCompany = (id: number) => {
    if (confirm("Are you sure you want to delete this company?")) {
      deleteCompanyMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="talents">Talents</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
          </TabsList>

          <TabsContent value="talents" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">Registered Talents</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add Talent</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add New Talent</DialogTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        Fill in the talent information below. All fields are required.
                      </p>
                    </DialogHeader>
                    <Form {...talentForm}>
                      <form onSubmit={talentForm.handleSubmit((data) => talentMutation.mutate(data))} className="space-y-4">
                        <FormField
                          control={talentForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={talentForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={talentForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={talentForm.control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skills</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={talentForm.control}
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Experience</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit">Add Talent</Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {talentsQuery.isLoading ? (
                  <p>Loading talents...</p>
                ) : talentsQuery.error ? (
                  <p className="text-red-500">Error loading talents</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Registered At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {talentsQuery.data?.map((talent: Talent) => (
                        <TableRow key={talent.id}>
                          <TableCell>{talent.fullName}</TableCell>
                          <TableCell>{talent.email}</TableCell>
                          <TableCell>{talent.phone}</TableCell>
                          <TableCell>{talent.skills}</TableCell>
                          <TableCell>{talent.experience}</TableCell>
                          <TableCell>
                            <Select
                              value={talent.status}
                              onValueChange={(value) => 
                                updateTalentMutation.mutate({ id: talent.id, status: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue>{talent.status}</SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="lead">Lead</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="client">Client</SelectItem>
                                <SelectItem value="discarded">Discarded</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {new Date(talent.createdAt!).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingTalent(talent)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteTalent(talent.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">Registered Companies</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add Company</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add New Company</DialogTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        Fill in the company information below. All fields are required.
                      </p>
                    </DialogHeader>
                    <Form {...companyForm}>
                      <form onSubmit={companyForm.handleSubmit((data) => companyMutation.mutate(data))} className="space-y-4">
                        <FormField
                          control={companyForm.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={companyForm.control}
                          name="contactPerson"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Person</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={companyForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={companyForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={companyForm.control}
                          name="industry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Industry</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={companyForm.control}
                          name="requirements"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Requirements</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit">Add Company</Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {companiesQuery.isLoading ? (
                  <p>Loading companies...</p>
                ) : companiesQuery.error ? (
                  <p className="text-red-500">Error loading companies</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Requirements</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Registered At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companiesQuery.data?.map((company: Company) => (
                        <TableRow key={company.id}>
                          <TableCell>{company.companyName}</TableCell>
                          <TableCell>{company.contactPerson}</TableCell>
                          <TableCell>{company.email}</TableCell>
                          <TableCell>{company.phone}</TableCell>
                          <TableCell>{company.industry}</TableCell>
                          <TableCell>{company.requirements}</TableCell>
                          <TableCell>
                            <Select
                              value={company.status}
                              onValueChange={(value) => 
                                updateCompanyMutation.mutate({ id: company.id, status: value })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue>{company.status}</SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="lead">Lead</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="client">Client</SelectItem>
                                <SelectItem value="discarded">Discarded</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {new Date(company.createdAt!).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingCompany(company)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCompany(company.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Talent Dialog */}
      <Dialog open={editingTalent !== null} onOpenChange={() => setEditingTalent(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Talent</DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Update the talent information below. All fields are required.
            </p>
          </DialogHeader>
          {editingTalent && (
            <Form {...talentForm}>
              <form onSubmit={talentForm.handleSubmit((data) => {
                updateTalentMutation.mutate({ id: editingTalent.id, ...data });
                setEditingTalent(null);
              })} className="space-y-4">
                <FormField
                  control={talentForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={editingTalent.fullName} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={talentForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} value={editingTalent.email} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={talentForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} value={editingTalent.phone} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={talentForm.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={editingTalent.skills} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={talentForm.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={editingTalent.experience} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingTalent(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Company Dialog */}
      <Dialog open={editingCompany !== null} onOpenChange={() => setEditingCompany(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Update the company information below. All fields are required.
            </p>
          </DialogHeader>
          {editingCompany && (
            <Form {...companyForm}>
              <form onSubmit={companyForm.handleSubmit((data) => {
                updateCompanyMutation.mutate({ id: editingCompany.id, ...data });
                setEditingCompany(null);
              })} className="space-y-4">
                <FormField
                  control={companyForm.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={editingCompany.companyName} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyForm.control}
                  name="contactPerson"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input {...field} value={editingCompany.contactPerson} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} value={editingCompany.email} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} value={editingCompany.phone} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyForm.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input {...field} value={editingCompany.industry} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyForm.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements</FormLabel>
                      <FormControl>
                        <Textarea {...field} value={editingCompany.requirements} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingCompany(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
