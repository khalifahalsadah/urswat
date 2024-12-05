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

  const talentForm = useForm<InsertTalent & { cvFile?: File }>({
    resolver: zodResolver(insertTalentSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      cvPath: "",
    },
  });

  const companyForm = useForm<InsertCompany>({
    resolver: zodResolver(insertCompanySchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
    },
  });

  const talentMutation = useMutation({
    mutationFn: registerTalent,
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "We'll be in touch soon!",
      });
      talentForm.reset({
        fullName: "",
        email: "",
        phone: "",
        cvPath: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
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
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/90" />
        </div>
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-6xl font-bold mb-8 tracking-tight">Welcome to Urswat.com</h1>
          <p className="text-2xl mb-12 leading-relaxed font-light">
            Connecting exceptional talent with innovative companies. Your next opportunity awaits.
          </p>
          <div className="flex gap-6 justify-center items-center">
            <a href="/dashboard" className="text-white hover:text-gray-200 mr-6">
              Company Dashboard
            </a>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 hover:bg-white/20 border-white/20"
              onClick={() => {
                setActiveTab("talent");
                document.querySelector(".registration-section")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              I'm a Talent
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/10 hover:bg-white/20 border-white/20"
              onClick={() => {
                setActiveTab("company");
                document.querySelector(".registration-section")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              I'm a Company
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Choose Your Path</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-2 hover:border-black/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">For Talents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                    alt="Office Environment"
                    className="w-full h-56 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                </div>
                <div className="mt-6 space-y-4">
                  <p className="text-lg">Find your dream company and take the next step in your career</p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Showcase your skills and experience</li>
                    <li>• Connect with leading companies</li>
                    <li>• Fast-track your career growth</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-black/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">For Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1590650046871-92c887180603"
                    alt="Diverse Workplace"
                    className="w-full h-56 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                </div>
                <div className="mt-6 space-y-4">
                  <p className="text-lg">Connect with top talent to build your dream team</p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Access a pool of qualified candidates</li>
                    <li>• Streamlined recruitment process</li>
                    <li>• Find the perfect match for your team</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Our Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 hover:border-black/20 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 mb-4 bg-black text-white rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                </div>
                <CardTitle className="text-xl">Talent Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Advanced algorithms to match your skills with the perfect opportunities in top companies.</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-black/20 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 mb-4 bg-black text-white rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
                </div>
                <CardTitle className="text-xl">Interview Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Streamlined interview process with automated scheduling and reminders.</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-black/20 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 mb-4 bg-black text-white rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M8 9h2"/></svg>
                </div>
                <CardTitle className="text-xl">Resume Review</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Expert review and optimization of your resume to highlight your strongest qualifications.</p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-black/20 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 mb-4 bg-black text-white rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"/><rect width="18" height="18" x="3" y="4" rx="2"/><circle cx="12" cy="10" r="2"/><line x1="8" x2="8" y1="2" y2="4"/><line x1="16" x2="16" y1="2" y2="4"/></svg>
                </div>
                <CardTitle className="text-xl">Career Coaching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">One-on-one guidance to help you navigate your career path and achieve your goals.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Forms */}
      <section className="py-24 bg-white registration-section">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Register Now</h2>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8 h-14 p-1 bg-gray-100 rounded-lg">
              <TabsTrigger value="talent" className="text-lg data-[state=active]:bg-white rounded-lg">For Talents</TabsTrigger>
              <TabsTrigger value="company" className="text-lg data-[state=active]:bg-white rounded-lg">For Companies</TabsTrigger>
            </TabsList>
            
            <TabsContent value="talent">
              <Card>
                <CardHeader>
                  <CardTitle>Talent Registration</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...talentForm}>
                    <form onSubmit={talentForm.handleSubmit((data) => talentMutation.mutate(data))} className="space-y-8">
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
                        name="cvPath"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Upload CV (PDF)</FormLabel>
                            <FormControl>
                              <div className="flex flex-col gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    const fileInput = document.createElement('input');
                                    fileInput.type = 'file';
                                    fileInput.accept = '.pdf';
                                    fileInput.onchange = (e) => {
                                      const file = (e.target as HTMLInputElement).files?.[0];
                                      if (file) {
                                        talentForm.setValue('cvFile', file as any);
                                        talentForm.setValue('cvPath', file.name);
                                      }
                                    };
                                    fileInput.click();
                                  }}
                                  className="w-full"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                                  Choose PDF File
                                </Button>
                                {talentForm.watch('cvPath') && (
                                  <div className="text-sm text-gray-600">
                                    Selected file: {talentForm.watch('cvPath')}
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full bg-black text-white hover:bg-black/90 transition-all duration-300 py-6"
                        >
                          Register as Talent
                        </Button>
                      </div>
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
                    <form onSubmit={companyForm.handleSubmit((data) => companyMutation.mutate(data))} className="space-y-8">
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
                      
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full bg-black text-white hover:bg-black/90 transition-all duration-300 py-6"
                        >
                          Register Company
                        </Button>
                      </div>
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
