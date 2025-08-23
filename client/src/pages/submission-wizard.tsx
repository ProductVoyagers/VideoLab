import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProgressSteps from "@/components/ui/progress-steps";
import PackageCard from "@/components/ui/package-card";
import FileUpload from "@/components/ui/file-upload";
import { insertSubmissionSchema, packageTypes, type PackageType, type InsertSubmission } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, CheckCircle, Plus, Search } from "lucide-react";
import { getEstimatedDeliveryDate } from "@/lib/utils";

const formSchema = insertSubmissionSchema.extend({
  packageType: z.enum(["starter", "pro", "premium"]),
});

export default function SubmissionWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      brandName: "",
      projectGoals: "",
      packageType: "pro" as PackageType,
      timeline: "",
      additionalNotes: "",
      status: "received",
      files: [],
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertSubmission) => {
      const response = await apiRequest("POST", "/api/submissions", data);
      return response.json();
    },
    onSuccess: (data) => {
      setSubmissionData(data);
      setCurrentStep(3);
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
      toast({
        title: "Project submitted successfully!",
        description: `Submission ID: ${data.id}`,
      });
    },
    onError: () => {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const steps = ["Choose Package", "Upload Content", "Submit & Track"];

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handlePackageSelect = (packageKey: PackageType) => {
    setSelectedPackage(packageKey);
    form.setValue("packageType", packageKey);
  };

  const handleStep1Next = () => {
    if (!selectedPackage) {
      toast({
        title: "Please select a package",
        description: "Choose one of the available production packages to continue.",
        variant: "destructive",
      });
      return;
    }
    goToStep(2);
  };

  const handleStep2Next = () => {
    const projectName = form.getValues("projectName");
    const projectGoals = form.getValues("projectGoals");
    
    if (!projectName || !projectGoals) {
      toast({
        title: "Required fields missing",
        description: "Please fill in the project name and goals.",
        variant: "destructive",
      });
      return;
    }
    
    const formData = form.getValues();
    const filesData = uploadedFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    submitMutation.mutate({
      ...formData,
      files: filesData,
    });
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setSelectedPackage(null);
    setUploadedFiles([]);
    setSubmissionData(null);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-cinema-gray">
      <div className="container mx-auto px-4 py-12">
        <ProgressSteps currentStep={currentStep} steps={steps} />

        {/* Step 1: Package Selection */}
        {currentStep === 1 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Choose Your Production Package
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <PackageCard
                packageKey="lite"
                isSelected={selectedPackage === "lite"}
                onSelect={handlePackageSelect}
              />
              <PackageCard
                packageKey="signature"
                isSelected={selectedPackage === "signature"}
                onSelect={handlePackageSelect}
                isPopular
              />
              <PackageCard
                packageKey="immersive"
                isSelected={selectedPackage === "immersive"}
                onSelect={handlePackageSelect}
              />
            </div>

            <div className="text-center">
              <Button
                onClick={handleStep1Next}
                disabled={!selectedPackage}
                className="bg-cinema-gold hover:bg-yellow-500 text-cinema-dark px-8 py-3 rounded-lg font-semibold"
              >
                Continue to Upload <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Content Upload */}
        {currentStep === 2 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Upload Content & Project Details
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* File Upload Section */}
              <div>
                <h3 className="text-2xl font-semibold mb-6">Upload Your Assets</h3>
                <FileUpload
                  onFilesChange={setUploadedFiles}
                  maxFiles={10}
                  acceptedTypes={["video/", "image/", "application/"]}
                />
              </div>

              {/* Project Details Form */}
              <div>
                <h3 className="text-2xl font-semibold mb-6">Project Information</h3>
                
                <Form {...form}>
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="projectName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 font-semibold">Project Name *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-cinema-slate border-gray-600 text-white focus:border-cinema-gold"
                              placeholder="Enter project name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="brandName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 font-semibold">Brand/Company</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-cinema-slate border-gray-600 text-white focus:border-cinema-gold"
                              placeholder="Enter brand or company name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="projectGoals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 font-semibold">Project Goals *</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={4}
                              className="bg-cinema-slate border-gray-600 text-white focus:border-cinema-gold"
                              placeholder="Describe your vision, target audience, key messages, and desired outcome..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="timeline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 font-semibold">Timeline Requirements</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-cinema-slate border-gray-600 text-white">
                                <SelectValue placeholder="Select timeline" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="standard">Standard (as per package)</SelectItem>
                              <SelectItem value="rush">Rush (+50% fee)</SelectItem>
                              <SelectItem value="flexible">Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="additionalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 font-semibold">Additional Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={3}
                              className="bg-cinema-slate border-gray-600 text-white focus:border-cinema-gold"
                              placeholder="Any special requirements, style preferences, or technical specifications..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </div>
            </div>

            <div className="flex justify-between mt-12">
              <Button
                onClick={() => goToStep(1)}
                variant="secondary"
                className="px-8 py-3 rounded-lg font-semibold"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleStep2Next}
                disabled={submitMutation.isPending}
                className="bg-cinema-gold hover:bg-yellow-500 text-cinema-dark px-8 py-3 rounded-lg font-semibold"
              >
                {submitMutation.isPending ? "Submitting..." : "Continue to Submit"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && submissionData && (
          <div className="max-w-4xl mx-auto text-center">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-12">
              <CardContent className="space-y-8">
                <div>
                  <CheckCircle className="text-green-400 h-16 w-16 mx-auto mb-4" />
                  <h2 className="text-4xl font-bold text-white mb-4">Project Submitted Successfully!</h2>
                  <p className="text-xl text-gray-300">Your cinematic video will be delivered in 5–7 days.</p>
                </div>

                {/* Submission Details */}
                <Card className="bg-cinema-slate">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold text-cinema-gold mb-6">Submission Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                      <div>
                        <p className="text-gray-400 mb-1">Submission ID</p>
                        <p className="text-white font-mono text-lg">#{submissionData.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Package Selected</p>
                        <p className="text-white font-semibold">
                          {packageTypes[submissionData.packageType as PackageType]?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Project Name</p>
                        <p className="text-white">{submissionData.projectName}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">Estimated Delivery</p>
                        <p className="text-white">
                          {getEstimatedDeliveryDate(submissionData.packageType).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Steps */}
                <div className="text-left">
                  <h4 className="text-xl font-semibold text-cinema-gold mb-4">What Happens Next?</h4>
                  <div className="space-y-3">
                    {[
                      "Our production team will review your submission within 24 hours",
                      "We'll send you a detailed production timeline and any clarification requests",
                      "Production begins and you'll receive regular status updates",
                      "Final delivery with revisions as per your package"
                    ].map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-cinema-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-cinema-dark text-sm font-bold">{index + 1}</span>
                        </div>
                        <p className="text-gray-300">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={resetWizard}
                    className="bg-cinema-gold hover:bg-yellow-500 text-cinema-dark px-8 py-3 rounded-lg font-semibold"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Start New Project
                  </Button>
                  <Button
                    onClick={() => setLocation("/admin")}
                    variant="secondary"
                    className="px-8 py-3 rounded-lg font-semibold"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Track This Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
