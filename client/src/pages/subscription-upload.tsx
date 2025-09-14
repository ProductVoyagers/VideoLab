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
import { packageTypes, type PackageType } from "@shared/old_schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, FileText, Calendar, CreditCard, CheckCircle, AlertCircle } from "lucide-react";

const subscriptionProjectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  brandName: z.string().min(1, "Brand name is required"),
  subscriptionPlan: z.enum(["starter", "pro", "premium"]),
  projectType: z.enum(["mocap", "photogrammetry", "video_enhancement", "mixed"]),
  projectGoals: z.string().min(10, "Please describe your project goals (minimum 10 characters)"),
  targetAudience: z.string().optional(),
  deliveryDeadline: z.string().min(1, "Delivery deadline is required"),
  additionalNotes: z.string().optional(),
  files: z.array(z.string()).optional(),
});

type SubscriptionProjectForm = z.infer<typeof subscriptionProjectSchema>;

export default function SubscriptionUploadPage() {
  const [, setLocation] = useLocation();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SubscriptionProjectForm>({
    resolver: zodResolver(subscriptionProjectSchema),
    defaultValues: {
      projectName: "",
      brandName: "",
      subscriptionPlan: "pro",
      projectType: "mocap",
      projectGoals: "",
      targetAudience: "",
      deliveryDeadline: "",
      additionalNotes: "",
      files: [],
    },
  });

  const submitProject = useMutation({
    mutationFn: async (data: SubscriptionProjectForm) => {
      const response = await apiRequest("POST", "/api/subscription-projects", {
        ...data,
        files: uploadedFiles.map(f => f.name),
        submissionDate: new Date().toISOString(),
        status: "received",
        creditsRequired: getCreditsRequired(data.projectType),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Project submitted successfully!",
        description: "Your subscription project has been queued for production.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription-projects"] });
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

  const getCreditsRequired = (projectType: string) => {
    switch (projectType) {
      case "mocap": return 2;
      case "photogrammetry": return 5;
      case "video_enhancement": return 3;
      case "mixed": return 8;
      default: return 2;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: SubscriptionProjectForm) => {
    setIsSubmitting(true);
    try {
      await submitProject.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cinema-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => setLocation("/subscription")}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Subscription Plans
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Submit Subscription Project</h1>
            <p className="text-gray-300">Use your subscription credits for priority production</p>
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

                    {/* Subscription Plan & Project Type */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="subscriptionPlan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Subscription Plan *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-subscription-plan">
                                  <SelectValue placeholder="Select your plan" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(packageTypes).map(([key, plan]) => (
                                  <SelectItem key={key} value={key}>
                                    {plan.name} - {plan.credits} credits
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="projectType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Project Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-project-type">
                                  <SelectValue placeholder="Select project type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="mocap">Motion Capture (2 credits)</SelectItem>
                                <SelectItem value="photogrammetry">Photogrammetry (5 credits)</SelectItem>
                                <SelectItem value="video_enhancement">Video Enhancement (3 credits)</SelectItem>
                                <SelectItem value="mixed">Mixed Project (8 credits)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Project Goals */}
                    <FormField
                      control={form.control}
                      name="projectGoals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Project Goals & Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your project goals, expected deliverables, and any specific requirements..."
                              className="bg-white/5 border-white/10 text-white min-h-[120px]"
                              data-testid="textarea-project-goals"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Target Audience & Deadline */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="targetAudience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Target Audience</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Who is this project for?"
                                className="bg-white/5 border-white/10 text-white"
                                data-testid="input-target-audience"
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
                              placeholder="Any additional information, special requests, or technical specifications..."
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
                        <p className="text-gray-300 mb-2">Upload reference materials, scripts, storyboards, or assets</p>
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
                      {isSubmitting ? "Submitting..." : "Submit Project"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Credit Usage */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-cinema-gold" />
                  Credit Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Project Type:</span>
                  <Badge className="bg-cinema-gold text-cinema-dark">
                    {form.watch("projectType") || "Motion Capture"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Credits Required:</span>
                  <span className="text-white font-semibold">
                    {getCreditsRequired(form.watch("projectType") || "mocap")} credits
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Credits will be deducted from your subscription balance upon approval.
                </div>
              </CardContent>
            </Card>

            {/* Subscription Benefits */}
            <Card className="bg-white/5 backdrop-blur-sm border-cinema-gold">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-cinema-gold" />
                  Subscription Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300 text-sm">Priority scheduling</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300 text-sm">Faster delivery times</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300 text-sm">Dedicated account manager</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-gray-300 text-sm">20% credit rollover</span>
                </div>
              </CardContent>
            </Card>

            {/* Processing Timeline */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cinema-gold" />
                  Processing Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Motion Capture:</span>
                  <span className="text-white text-sm">2-3 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Photogrammetry:</span>
                  <span className="text-white text-sm">5-7 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300 text-sm">Video Enhancement:</span>
                  <span className="text-white text-sm">3-4 days</span>
                </div>
                <div className="text-xs text-cinema-gold mt-2">
                  ⚡ Subscription clients get priority processing
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}