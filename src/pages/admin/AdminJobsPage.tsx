import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, DataTableColumn } from "@/components/DataTable";
import { JobStatusBadge } from "@/components/JobStatusBadge";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api-client";
import type { Job } from "@shared/types";
import { JobStatus } from "@shared/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
export function AdminJobsPage() {
  const { t } = useTranslation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchJobs = useCallback(() => {
    setIsLoading(true);
    api<Job[]>('/api/admin/jobs')
      .then(data => setJobs(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())))
      .catch(() => toast.error(t('admin.jobs.toast.loadFailed')))
      .finally(() => setIsLoading(false));
  }, [t]);
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    fetchJobs();
  }, [currentUser, navigate, fetchJobs]);
  const handleCancelJob = (jobId: string) => {
    if (!window.confirm(t('admin.jobs.confirmCancel'))) return;
    api(`/api/admin/jobs/${jobId}/cancel`, { method: 'PATCH' })
      .then(() => {
        toast.success(t('admin.jobs.toast.cancelSuccess'));
        fetchJobs();
      })
      .catch(() => toast.error(t('admin.jobs.toast.cancelFailed')));
  };
  const columns: DataTableColumn<Job>[] = [
    { accessorKey: "id", header: t('admin.jobs.columns.jobId'), cell: (id: string) => `#${id.slice(-6)}` },
    { accessorKey: "status", header: t('admin.jobs.columns.status'), cell: (status: JobStatus) => <JobStatusBadge status={status} /> },
    { accessorKey: "customerId", header: t('admin.jobs.columns.customerId'), cell: (id: string) => id.slice(-6) },
    { accessorKey: "plumberId", header: t('admin.jobs.columns.plumberId'), cell: (id?: string) => id ? id.slice(-6) : 'N/A' },
    { accessorKey: "scheduledAt", header: t('admin.jobs.columns.scheduled'), cell: (date: string) => new Date(date).toLocaleString() },
    { accessorKey: "actions", header: t('admin.jobs.columns.actions'), cell: (_: any, job: Job) => (
      job.status !== JobStatus.COMPLETED && job.status !== JobStatus.CANCELLED ? (
        <Button variant="destructive" size="sm" onClick={() => handleCancelJob(job.id)}>
          <XCircle className="h-4 w-4 mr-2" /> {t('admin.jobs.cancelButton')}
        </Button>
      ) : null
    )},
  ];
  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={t('admin.jobs.title')}
        description={t('admin.jobs.description')}
      />
      <DataTable columns={columns} data={jobs} isLoading={isLoading} />
    </div>
  );
}