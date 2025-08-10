import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Download, Home, Eye, Edit, Play, Check, Clock, Cog, Inbox, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import type { Submission } from "@shared/schema";
import { packageTypes } from "@shared/schema";

export default function AdminDashboard() {
  const [statusFilter, setStatusFilter] = useState("");
  const [packageFilter, setPackageFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery<Submission[]>({
    queryKey: ["/api/submissions"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/submissions/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
      toast({
        title: "Status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const exportCSV = async () => {
    try {
      const response = await fetch("/api/submissions/export/csv");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'submissions_export.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export successful",
        description: "Submissions exported to CSV file",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export submissions",
        variant: "destructive",
      });
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (statusFilter && statusFilter !== "all" && submission.status !== statusFilter) return false;
    if (packageFilter && packageFilter !== "all" && submission.packageType !== packageFilter) return false;
    if (dateFilter) {
      const submissionDate = new Date(submission.submissionDate).toISOString().split('T')[0];
      if (submissionDate !== dateFilter) return false;
    }
    return true;
  });

  const stats = {
    total: submissions.length,
    inProduction: submissions.filter(s => s.status === 'in-production').length,
    delivered: submissions.filter(s => s.status === 'delivered').length,
    revenue: submissions.length * 7999, // Mock revenue calculation
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received':
        return <Clock className="h-4 w-4" />;
      case 'in-production':
        return <Cog className="h-4 w-4 animate-spin" />;
      case 'delivered':
        return <Check className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'received':
        return 'secondary';
      case 'in-production':
        return 'default';
      case 'delivered':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getPackageColor = (packageType: string) => {
    switch (packageType) {
      case 'lite':
        return 'bg-blue-500/20 text-blue-400';
      case 'signature':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'immersive':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cinema-gray flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cinema-gray">
      <div className="container mx-auto px-4 py-12">
        
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage client submissions and project status</p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={exportCSV}
              className="bg-cinema-gold hover:bg-yellow-500 text-cinema-dark font-semibold"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button
              onClick={() => setLocation("/")}
              variant="secondary"
              className="font-semibold"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Submissions</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <Inbox className="text-cinema-gold h-8 w-8" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">In Production</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.inProduction}</p>
                </div>
                <Cog className="text-yellow-400 h-8 w-8 animate-spin" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Delivered</p>
                  <p className="text-3xl font-bold text-green-400">{stats.delivered}</p>
                </div>
                <Check className="text-green-400 h-8 w-8" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Revenue</p>
                  <p className="text-3xl font-bold text-cinema-gold">${(stats.revenue / 1000000).toFixed(1)}M</p>
                </div>
                <DollarSign className="text-cinema-gold h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/5 border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <h3 className="text-lg font-semibold text-white">Filter Submissions:</h3>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-cinema-slate border-gray-600 text-white">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="in-production">In Production</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={packageFilter} onValueChange={setPackageFilter}>
                <SelectTrigger className="w-48 bg-cinema-slate border-gray-600 text-white">
                  <SelectValue placeholder="All Packages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Packages</SelectItem>
                  <SelectItem value="lite">Virtual Ad Lite</SelectItem>
                  <SelectItem value="signature">Signature Scene</SelectItem>
                  <SelectItem value="immersive">Immersive Experience</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-48 bg-cinema-slate border-gray-600 text-white"
              />
              
              <Button
                onClick={() => {
                  setStatusFilter("all");
                  setPackageFilter("all");
                  setDateFilter("");
                }}
                variant="secondary"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <Card className="bg-white/5 border-white/10">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Submission ID</TableHead>
                  <TableHead className="text-gray-300">Project Name</TableHead>
                  <TableHead className="text-gray-300">Brand</TableHead>
                  <TableHead className="text-gray-300">Package</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                      No submissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id} className="border-gray-700 hover:bg-white/5">
                      <TableCell className="text-white font-mono">#{submission.id}</TableCell>
                      <TableCell className="text-white">{submission.projectName}</TableCell>
                      <TableCell className="text-white">{submission.brandName || "—"}</TableCell>
                      <TableCell>
                        <Badge className={getPackageColor(submission.packageType)}>
                          {packageTypes[submission.packageType as keyof typeof packageTypes]?.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(submission.status)} className="flex items-center w-fit">
                          {getStatusIcon(submission.status)}
                          <span className="ml-2 capitalize">{submission.status.replace('-', ' ')}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(submission.submissionDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="secondary">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          {submission.status === 'received' ? (
                            <Button
                              size="sm"
                              onClick={() => updateStatusMutation.mutate({ 
                                id: submission.id, 
                                status: 'in-production' 
                              })}
                              disabled={updateStatusMutation.isPending}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                          ) : submission.status === 'in-production' ? (
                            <Button
                              size="sm"
                              onClick={() => updateStatusMutation.mutate({ 
                                id: submission.id, 
                                status: 'delivered' 
                              })}
                              disabled={updateStatusMutation.isPending}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Complete
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-cinema-gold hover:bg-yellow-500 text-cinema-dark"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8">
          <p className="text-gray-400">
            Showing {filteredSubmissions.length} of {submissions.length} submissions
          </p>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="sm" className="bg-cinema-gold text-cinema-dark">1</Button>
            <Button variant="secondary" size="sm">2</Button>
            <Button variant="secondary" size="sm">3</Button>
            <Button variant="secondary" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
