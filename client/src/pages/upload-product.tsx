import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import FileUpload from "@/components/ui/file-upload";
import { v4 as uuidv4 } from "uuid";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  price: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number().positive("Price must be a positive number")),
});

export default function UploadProductPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [zipFile, setZipFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
    },
  });

  const handleUpload = async (values: z.infer<typeof productSchema>) => {
    if (!user) {
      toast({ title: "You must be logged in to upload a product.", variant: "destructive" });
      return;
    }
    if (images.length === 0 || !zipFile) {
      toast({ title: "Please upload at least one image and a zip file.", variant: "destructive" });
      return;
    }

    // 1. Upload zip file
    const zipFilePath = `${user.id}/${zipFile.name}`;
    const { error: zipError } = await supabase.storage.from("products").upload(zipFilePath, zipFile, {
      upsert: true,
    });
    if (zipError && zipError.message !== "The resource already exists") {
      toast({ title: "Error uploading zip file.", description: zipError.message, variant: "destructive" });
      return;
    }

    // 2. Upload images
    const imageUrls: string[] = [];
    for (const image of images) {
      const imagePath = `${user.id}/${image.name}`;
      const { error: imageError } = await supabase.storage.from("product_images").upload(imagePath, image, {
        upsert: true,
      });
      if (imageError && imageError.message !== "The resource already exists") {
        toast({ title: `Error uploading ${image.name}.`, description: imageError.message, variant: "destructive" });
        continue;
      }
      const { data } = supabase.storage.from("product_images").getPublicUrl(imagePath);
      imageUrls.push(data.publicUrl);
    }

    // 3. Insert product into database
    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert({
        id: uuidv4(),
        user_id: user.id,
        name: values.name,
        description: values.description,
        price: Math.round(values.price * 100), // Convert to cents
        zip_file_url: zipFilePath,
      })
      .select()
      .single();

    if (productError) {
      toast({ title: "Error creating product.", description: productError.message, variant: "destructive" });
      return;
    }

    // 4. Insert product images into database
    const imageInserts = imageUrls.map((url) => ({
      id: uuidv4(),
      product_id: productData.id,
      url,
    }));

    const { error: imagesError } = await supabase.from("product_images").insert(imageInserts);
    if (imagesError) {
      toast({ title: "Error saving product images.", description: imagesError.message, variant: "destructive" });
    }

    toast({ title: "Product uploaded successfully!" });
    setLocation("/");
  };
  
  if (user?.user_metadata.role !== "seller") {
    return (
      <div className="min-h-screen bg-cinema-gray flex items-center justify-center">
        <p className="text-white">You must be a seller to access this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cinema-gray flex items-center justify-center py-12">
      <Card className="w-full max-w-2xl bg-white/5 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-cinema-gold">Upload Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpload)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-cinema-slate border-gray-600 focus:border-cinema-gold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} className="bg-cinema-slate border-gray-600 focus:border-cinema-gold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (SAR)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="bg-cinema-slate border-gray-600 focus:border-cinema-gold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel>Product Images (up to 3)</FormLabel>
                <FileUpload onFilesChange={setImages} maxFiles={3} acceptedTypes={["image/"]} />
              </FormItem>

              <FormItem>
                <FormLabel>Product File (ZIP)</FormLabel>
                <FileUpload onFilesChange={(files) => setZipFile(files[0] || null)} maxFiles={1} acceptedTypes={["application/zip"]} />
              </FormItem>

              <Button type="submit" className="w-full gold-gradient text-cinema-dark font-semibold">
                Upload Product
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
