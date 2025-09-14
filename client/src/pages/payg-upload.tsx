import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { payAsYouGoKits, type PayAsYouGoKit } from "@shared/old_schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, FileText, Calendar, CreditCard, Package2, AlertCircle } from "lucide-react";

const paygProjectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  brandName: z.string().min(1, "Brand name is required"),
  selectedKit: z.enum([
    "mocapBasic", "mocapPro", "photoscanIndoor", "photoscanOutdoor", 
    "photoscanHybrid", "videoBoostStandard", "videoBoostPro"
  ]),
  projectDescription: z.string().min(10, "Please describe your project (minimum 10 characters)"),
  technicalRequirements: z.string().optional(),
  deliveryDeadline: z.string().min(1, "Delivery deadline is required"),
  contactEmail: z.string().email("Valid email is required"),
  additionalNotes: z.string().optional(),
  files: z.array(z.string()).optional(),
});

type PayGProjectForm = z.infer<typeof paygProjectSchema>;

export default function PayGUploadPage() {
  const [, setLocation] = useLocation();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PayGProjectForm>({
    resolver: zodResolver(paygProjectSchema),
    defaultValues: {
      projectName: "",
      brandName: "",
      selectedKit: "mocapBasic",
      projectDescription: "",
      technicalRequirements: "",
      deliveryDeadline: "",
      contactEmail: "",
      additionalNotes: "",
      files: [],
    },
  });

  const submitProject = useMutation({
    mutationFn: async (data: PayGProjectForm) => {
      const response = await apiRequest("POST", "/api/payg-projects", {
        ...data,
        files: uploadedFiles.map(f => f.name),
        submissionDate: new Date().toISOString(),
        status: "payment_pending",
        kitPrice: payAsYouGoKits[data.selectedKit].price,
        creditEquivalent: payAsYouGoKits[data.selectedKit].credits,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Project submitted successfully!",
        description: "Please proceed to payment to begin production.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/payg-projects"] });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PayGProjectForm) => {
    setIsSubmitting(true);
    try {
      await submitProject.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedKitData = payAsYouGoKits[form.watch("selectedKit") || "mocapBasic"];

  return (
    <div className="min-h-screen bg-cinema-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => setLocation("/pay-as-you-go")}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pay-As-You-Go Kits
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Submit Pay-As-You-Go Project</h1>
            <p className="text-gray-300">Individual production kit with fixed pricing</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cinema-gold" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="projectName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Project Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter project name"
                                className="bg-white/5 border-white/10 text-white"
                                data-testid="input-project-name"
                                {...field}
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
                            <FormLabel className="text-white">Brand/Company Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter brand name"
                                className="bg-white/5 border-white/10 text-white"
                                data-testid="input-brand-name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Kit Selection */}
                    <FormField
                      control={form.control}
                      name="selectedKit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Production Kit *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-kit">
                                <SelectValue placeholder="Select production kit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(payAsYouGoKits).map(([key, kit]) => (
                                <SelectItem key={key} value={key}>
                                  {kit.name} - {kit.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Project Description */}
                    <FormField
                      control={form.control}
                      name="projectDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Project Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your project requirements, expected deliverables, and specific goals..."
                              className="bg-white/5 border-white/10 text-white min-h-[120px]"
                              data-testid="textarea-project-description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Technical Requirements */}
                    <FormField
                      control={form.control}
                      name="technicalRequirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Technical Requirements</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Specify any technical requirements, output formats, quality settings, or special considerations..."
                              className="bg-white/5 border-white/10 text-white"
                              data-testid="textarea-technical-requirements"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Contact & Deadline */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Contact Email *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="your@email.com"
                                className="bg-white/5 border-white/10 text-white"
                                data-testid="input-contact-email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deliveryDeadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Delivery Deadline *</FormLabel>
                            <FormControl>
                              <Input 
                                type="date"
                                className="bg-white/5 border-white/10 text-white"
                                data-testid="input-delivery-deadline"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Additional Notes */}
                    <FormField
                      control={form.control}
                      name="additionalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Additional Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any additional information, special requests, or notes for our production team..."
                              className="bg-white/5 border-white/10 text-white"
                              data-testid="textarea-additional-notes"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* File Upload */}
                    <div>
                      <label className="block text-white mb-4 font-medium">Project Files</label>
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-cinema-gold mx-auto mb-2" />
                        <p className="text-gray-300 mb-2">Upload reference materials, assets, or source files</p>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                          data-testid="input-file-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('file-upload')?.click()}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Choose Files
                        </Button>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded">
                              <span className="text-gray-300 text-sm">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-red-400 hover:text-red-300 shrink-0"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gold-gradient text-cinema-dark font-semibold"
                      disabled={isSubmitting}
                      data-testid="button-submit-project"
                    >
                      {isSubmitting ? "Submitting..." : "Submit & Proceed to Payment"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Kit Info */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Package2 className="w-5 h-5 text-cinema-gold" />
                  Selected Kit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold">{selectedKitData.name}</h3>
                  <p className="text-gray-300 text-sm">{selectedKitData.description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Price:</span>
                  <Badge className="bg-cinema-gold text-cinema-dark font-semibold">
                    {selectedKitData.price}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Credit Equivalent:</span>
                  <span className="text-white">{selectedKitData.credits} credits</span>
                </div>
                <div className="text-xs text-gray-400">
                  Payment required before production begins
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cinema-gold" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedKitData.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-cinema-gold rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Notice */}
            <Card className="bg-orange-500/10 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                  Payment Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-300 text-sm">
                  Pay-as-you-go projects require upfront payment before production begins.
                </p>
                <div className="text-xs text-orange-400">
                  You'll be redirected to secure payment after submitting your project details.
                </div>
              </CardContent>
            </Card>

            {/* Processing Timeline */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cinema-gold" />
                  Expected Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {selectedKitData.features.find(f => f.includes("day"))?.match(/\d+-?\d*/)?.[0] || "3-5"} days
                  </div>
                  <div className="text-gray-300 text-sm">Production time</div>
                </div>
                <div className="text-xs text-gray-400 text-center">
                  Timeline starts after payment confirmation
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}