import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api-client";
import type { Job, PlumberProfile } from "@shared/types";
import { JobStatus } from "@shared/types";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
export function PlumberEarningsPage() {
  const { t } = useTranslation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const navigate = useNavigate();
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
  const [profile, setProfile] = useState<PlumberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'PLUMBER') {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [assigned, plumberProfile] = await Promise.all([
          api<Job[]>(`/api/plumber/jobs/assigned?plumberId=${currentUser.id}`),
          api<PlumberProfile>(`/api/plumber-profiles/${currentUser.id}`)
        ]);
        setCompletedJobs(assigned.filter(j => j.status === JobStatus.COMPLETED));
        setProfile(plumberProfile);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error(t('plumberEarnings.toast.loadFailed'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentUser, navigate, t]);
  const totalEarnings = completedJobs.reduce((acc) => acc + (profile?.baseRate || 50) + 25, 0); // Simulated calculation
  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={t('plumberEarnings.title')}
        description={t('plumberEarnings.description')}
      />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('plumberEarnings.completedJobs')}</CardTitle>
              <CardDescription>{t('plumberEarnings.paymentNote')}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('plumberEarnings.jobId')}</TableHead>
                      <TableHead>{t('plumberEarnings.completedOn')}</TableHead>
                      <TableHead className="text-right">{t('plumberEarnings.payout')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedJobs.length > 0 ? completedJobs.map(job => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">#{job.id.slice(-6)}</TableCell>
                        <TableCell>{new Date(job.timeline.find(t => t.status === JobStatus.COMPLETED)?.timestamp || job.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">€{( (profile?.baseRate || 50) + 25).toFixed(2)}</TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">{t('plumberEarnings.noJobs')}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="sticky top-24">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('plumberEarnings.totalEarnings')}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-3/4" /> : (
                <div className="text-2xl font-bold">€{totalEarnings.toFixed(2)}</div>
              )}
              <p className="text-xs text-muted-foreground">{t('plumberEarnings.pocNote')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}