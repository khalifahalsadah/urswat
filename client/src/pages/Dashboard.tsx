import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTalents, fetchCompanies } from "../lib/api";
import type { Talent, Company } from "@db/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const talentsQuery = useQuery({
    queryKey: ["talents"],
    queryFn: fetchTalents,
  });

  const companiesQuery = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
  });

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
              <CardHeader>
                <CardTitle>Registered Talents</CardTitle>
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
                        <TableHead>Registered At</TableHead>
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
                            {new Date(talent.createdAt!).toLocaleDateString()}
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
              <CardHeader>
                <CardTitle>Registered Companies</CardTitle>
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
                        <TableHead>Registered At</TableHead>
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
                            {new Date(company.createdAt!).toLocaleDateString()}
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
    </div>
  );
}
