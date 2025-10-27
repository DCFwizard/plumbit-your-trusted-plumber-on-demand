import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth-store';
import type { Job, User } from '@shared/types';
import { JobStatus } from '@shared/types';
import { PageHeader } from '@/components/PageHeader';
import { JobStatusBadge } from '@/components/JobStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { User as UserIcon, Phone, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { NotificationBell } from '@/components/NotificationBell';
type JobWithCustomer = Job & { customer?: User | null };
const nextStatusMap: Partial<Record<JobStatus, JobStatus>> = {
  [JobStatus.ACCEPTED]: JobStatus.EN_ROUTE,
  [JobStatus.EN_ROUTE]: JobStatus.ON_SITE,
  [JobStatus.ON_SITE]: JobStatus.COMPLETED,
};
export function PlumberJobDetailPage() {
  const { t } = useTranslation();
  const { jobId } = useParams<{ jobId: string }>();
  const currentUser = useAuthStore((state) => state.currentUser);
  const navigate = useNavigate();
  const [job, setJob] = useState<JobWithCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'PLUMBER') {
      navigate('/login');
      return;
    }
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const data = await api<JobWithCustomer>(`/api/jobs/${jobId}`);
        setJob(data);
      } catch (error) {
        toast.error(t('plumberJobDetail.toast.loadFailed'));
        navigate('/plumber/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [jobId, currentUser, navigate, t]);
  const handleStatusUpdate = async (newStatus: JobStatus) => {
    const promise = api(`/api/jobs/${jobId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
    toast.promise(promise, {
      loading: t('plumberJobDetail.toast.updateLoading'),
      success: (updatedJob: Job) => {
        setJob(prev => prev ? { ...prev, ...updatedJob } : null);
        return t('plumberJobDetail.toast.updateSuccess', { status: newStatus.replace('_', ' ') });
      },
      error: t('plumberJobDetail.toast.updateError'),
    });
  };
  const handleAcceptJob = async () => {
    if (!currentUser) return;
    const promise = api(`/api/jobs/${jobId}/accept`, {
      method: 'PATCH',
      body: JSON.stringify({ plumberId: currentUser.id }),
    });
    toast.promise(promise, {
      loading: t('plumberJobDetail.toast.acceptLoading'),
      success: (updatedJob: Job) => {
        setJob(prev => prev ? { ...prev, ...updatedJob } : null);
        return t('plumberJobDetail.toast.acceptSuccess');
      },
      error: t('plumberJobDetail.toast.acceptError'),
    });
  };
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
        <Skeleton className="h-10 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6"><Skeleton className="h-64 w-full" /></div>
          <div className="space-y-6"><Skeleton className="h-48 w-full" /></div>
        </div>
      </div>
    );
  }
  if (!job) return null;
  const nextStatus = nextStatusMap[job.status];
  const isJobActionable = job.plumberId === currentUser?.id && job.status !== JobStatus.COMPLETED && job.status !== JobStatus.CANCELLED;
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={`Job #${job.id.slice(-6)}`}
        description={t('plumberJobDetail.scheduledFor', { date: new Date(job.scheduledAt).toLocaleString() })}
      >
        <div className="flex items-center gap-2">
          <NotificationBell message={`New job available in ${job.address.split(',')[1] || 'Milan'}.`} />
          <JobStatusBadge status={job.status} />
        </div>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>{t('plumberJobDetail.jobDetails')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">{t('plumberJobDetail.address')}</h4>
                <p className="text-muted-foreground">{job.address}</p>
              </div>
              <div>
                <h4 className="font-semibold">{t('plumberJobDetail.description')}</h4>
                <p className="text-muted-foreground">{job.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          {job.customer && (
            <Card>
              <CardHeader><CardTitle>{t('plumberJobDetail.customerDetails')}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3"><UserIcon className="h-5 w-5 text-muted-foreground" /><span>{job.customer.name}</span></div>
                <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-muted-foreground" /><span>{job.customer.phone}</span></div>
              </CardContent>
            </Card>
          )}
          {job.status === JobStatus.REQUESTED && (
             <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleAcceptJob}>{t('plumberJobDetail.acceptJob')}</Button>
          )}
          {isJobActionable && nextStatus && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  {t('plumberJobDetail.updateTo', { status: nextStatus.replace('_', ' ') })} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('plumberJobDetail.confirmUpdateTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('plumberJobDetail.confirmUpdateDesc', { status: nextStatus.replace('_', ' ') })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('plumberJobDetail.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleStatusUpdate(nextStatus)}>{t('plumberJobDetail.confirm')}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}