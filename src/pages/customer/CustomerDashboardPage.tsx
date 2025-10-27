import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Wrench } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api-client";
import type { Job } from "@shared/types";
import { JobStatus } from "@shared/types";
import { JobStatusBadge } from "@/components/JobStatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
export function CustomerDashboardPage() {
  const { t } = useTranslation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const data = await api<Job[]>(`/api/jobs?customerId=${currentUser.id}`);
        setJobs(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        toast.error("Could not load your jobs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, [currentUser, navigate]);
  const activeJobs = jobs.filter(job => job.status !== JobStatus.COMPLETED && job.status !== JobStatus.CANCELLED);
  const pastJobs = jobs.filter(job => job.status === JobStatus.COMPLETED || job.status === JobStatus.CANCELLED);
  const renderJobList = (jobList: Job[], title: string) => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {jobList.length === 0 ? (
        <p className="text-muted-foreground">{t('customerDashboard.noJobs')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobList.map(job => (
            <Card key={job.id} className="flex flex-col transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">Job #{job.id.slice(-6)}</CardTitle>
                  <JobStatusBadge status={job.status} />
                </div>
                <CardDescription>{new Date(job.scheduledAt).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">{job.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/customer/jobs/${job.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={t('customerDashboard.title')}
        description={t('customerDashboard.description')}
      >
        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
          <Link to="/customer/jobs/new">
            <PlusCircle className="mr-2 h-4 w-4" /> {t('customerDashboard.newJob')}
          </Link>
        </Button>
      </PageHeader>
      {isLoading ? (
        renderSkeleton()
      ) : jobs.length > 0 ? (
        <div className="space-y-12">
          {renderJobList(activeJobs, t('customerDashboard.activeJobs'))}
          {renderJobList(pastJobs, t('customerDashboard.pastJobs'))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Wrench className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">{t('customerDashboard.noJobsYet.title')}</h2>
          <p className="text-muted-foreground mt-2">{t('customerDashboard.noJobsYet.description')}</p>
        </div>
      )}
    </div>
  );
}