import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api-client";
import type { Job } from "@shared/types";
import { JobStatus } from "@shared/types";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
export function PlumberDashboardPage() {
  const { t } = useTranslation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const navigate = useNavigate();
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [assignedJobs, setAssignedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'PLUMBER') {
      navigate('/login');
      return;
    }
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const [available, assigned] = await Promise.all([
          api<Job[]>('/api/plumber/jobs/available'),
          api<Job[]>(`/api/plumber/jobs/assigned?plumberId=${currentUser.id}`)
        ]);
        setAvailableJobs(available.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setAssignedJobs(assigned.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        toast.error(t('plumberDashboard.toast.loadFailed'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, [currentUser, navigate, t]);
  const handleAcceptJob = async (jobId: string) => {
    if (!currentUser) return;
    const promise = api(`/api/jobs/${jobId}/accept`, {
      method: 'PATCH',
      body: JSON.stringify({ plumberId: currentUser.id }),
    });
    toast.promise(promise, {
      loading: t('plumberDashboard.toast.acceptLoading'),
      success: (updatedJob: Job) => {
        setAvailableJobs(prev => prev.filter(j => j.id !== jobId));
        setAssignedJobs(prev => [updatedJob, ...prev]);
        return t('plumberDashboard.toast.acceptSuccess');
      },
      error: t('plumberDashboard.toast.acceptError'),
    });
  };
  const renderJobList = (jobList: Job[], title: string, isAvailableList: boolean) => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {jobList.length === 0 ? (
        <p className="text-muted-foreground">{t('plumberDashboard.noJobs')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobList.map(job => (
            <Card key={job.id} className="flex flex-col transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Job #{job.id.slice(-6)}</CardTitle>
                <CardDescription>{new Date(job.scheduledAt).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="font-semibold">Address:</p>
                <p className="text-muted-foreground mb-2">{job.address}</p>
                <p className="font-semibold">Issue:</p>
                <p className="text-muted-foreground line-clamp-3">{job.description}</p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/plumber/jobs/${job.id}`}>{t('plumberDashboard.viewDetails')}</Link>
                </Button>
                {isAvailableList && (
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleAcceptJob(job.id)}>
                    {t('plumberDashboard.accept')}
                  </Button>
                )}
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
          <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
          <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
        </Card>
      ))}
    </div>
  );
  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={t('plumberDashboard.title')}
        description={t('plumberDashboard.description')}
      />
      {isLoading ? (
        <div className="space-y-12">{renderSkeleton()}{renderSkeleton()}</div>
      ) : (
        <div className="space-y-12">
          {renderJobList(availableJobs, t('plumberDashboard.availableJobs'), true)}
          {renderJobList(assignedJobs.filter(j => j.status !== JobStatus.COMPLETED && j.status !== JobStatus.CANCELLED), t('plumberDashboard.myActiveJobs'), false)}
        </div>
      )}
    </div>
  );
}