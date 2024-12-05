import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertTalentSchema, insertCompanySchema } from "@db/schema";
import type { InsertTalent, InsertCompany } from "@db/schema";
import { registerTalent, registerCompany } from "../lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LandingPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("talent");

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
      toast({
        title: "Registration successful",
        description: "We'll be in touch soon!",
      });
      talentForm.reset();
    },
    onError: () => {
      toast({
        title: "Registration failed",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const companyMutation = useMutation({
    mutationFn: registerCompany,
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "We'll be in touch soon!",
      });
      companyForm.reset();
    },
    onError: () => {
      toast({
        title: "Registration failed",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c")',
          }}
        >
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative z-10 text-center max-w-3xl px-4">
          <h1 className="text-5xl font-bold mb-6">Welcome to Urswat.com</h1>
          <p className="text-xl mb-8">
            Connecting exceptional talent with innovative companies
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>For Talents</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                  alt="Office Environment"
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                />
                <p>Find your dream company and take the next step in your career</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>For Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1590650046871-92c887180603"
                  alt="Diverse Workplace"
                  className="w-full h-48 object-cover mb-4 rounded-lg"
                />
                <p>Connect with top talent to build your dream team</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Forms */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="talent">For Talents</TabsTrigger>
              <TabsTrigger value="company">For Companies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="talent">
              <Card>
                <CardHeader>
                  <CardTitle>Talent Registration</CardTitle>
                </CardHeader>
                <CardContent>
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
                      <Button type="submit" className="w-full">
                        Register as Talent
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company">
              <Card>
                <CardHeader>
                  <CardTitle>Company Registration</CardTitle>
                </CardHeader>
                <CardContent>
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
                      <Button type="submit" className="w-full">
                        Register Company
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
