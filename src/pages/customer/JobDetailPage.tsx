import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth-store';
import type { Job, User, PlumberProfile } from '@shared/types';
import { JobStatus } from '@shared/types';
import { PageHeader } from '@/components/PageHeader';
import { JobStatusBadge } from '@/components/JobStatusBadge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Star, User as UserIcon, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { NotificationBell } from '@/components/NotificationBell';
type JobWithDetails = Job & {
  plumber?: {
    user: User | null;
    profile: PlumberProfile | null;
  };
  customer?: User | null;
  hasReview?: boolean;
};
const reviewSchema = z.object({
  rating: z.string().nonempty("Please select a rating."),
  comment: z.string().min(10, "Please provide a comment of at least 10 characters."),
});
export function JobDetailPage() {
  const { t } = useTranslation();
  const { jobId } = useParams<{ jobId: string }>();
  const currentUser = useAuthStore((state) => state.currentUser);
  const navigate = useNavigate();
  const [job, setJob] = useState<JobWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: "", comment: "" },
  });
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const data = await api<JobWithDetails>(`/api/jobs/${jobId}`);
        if (data.customerId !== currentUser.id) {
          toast.error(t('jobDetail.toast.unauthorized'));
          navigate('/customer/dashboard');
          return;
        }
        setJob(data);
      } catch (error) {
        toast.error(t('jobDetail.toast.loadFailed'));
        navigate('/customer/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [jobId, currentUser, navigate, t]);
  async function onReviewSubmit(values: z.infer<typeof reviewSchema>) {
    if (!job || !job.plumberId || !currentUser) return;
    const promise = api('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({
        jobId: job.id,
        authorId: currentUser.id,
        plumberId: job.plumberId,
        rating: parseInt(values.rating, 10),
        comment: values.comment,
      }),
    });
    toast.promise(promise, {
      loading: t('jobDetail.toast.reviewLoading'),
      success: () => {
        setJob(prev => prev ? { ...prev, hasReview: true } : null);
        return t('jobDetail.toast.reviewSuccess');
      },
      error: t('jobDetail.toast.reviewError'),
    });
  }
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
        <Skeleton className="h-10 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }
  if (!job) return null;
  const getNotificationMessage = () => {
    if (job.status === JobStatus.ACCEPTED) return `Plumber ${job.plumber?.user?.name} has accepted your job!`;
    if (job.status === JobStatus.EN_ROUTE) return `Your plumber is on the way.`;
    if (job.status === JobStatus.ON_SITE) return `Your plumber has arrived at your location.`;
    return `Job #${job.id.slice(-6)} status is now ${job.status.replace('_', ' ')}.`;
  };
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={t('jobDetail.title', { jobId: job.id.slice(-6) })}
        description={t('jobDetail.requestedOn', { date: new Date(job.createdAt).toLocaleDateString() })}
      >
        <div className="flex items-center gap-2">
          <NotificationBell message={getNotificationMessage()} />
          <JobStatusBadge status={job.status} />
        </div>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>{t('jobDetail.jobDetails')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">{t('jobDetail.address')}</h4>
                <p className="text-muted-foreground">{job.address}</p>
              </div>
              <div>
                <h4 className="font-semibold">{t('jobDetail.description')}</h4>
                <p className="text-muted-foreground">{job.description}</p>
              </div>
              <div>
                <h4 className="font-semibold">{t('jobDetail.scheduledFor')}</h4>
                <p className="text-muted-foreground">{new Date(job.scheduledAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('jobDetail.timeline')}</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {job.timeline.map((event, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${index === job.timeline.length - 1 ? 'bg-blue-500 ring-4 ring-blue-500/30' : 'bg-gray-300'}`}></div>
                      {index < job.timeline.length - 1 && <div className="w-px h-full bg-gray-300"></div>}
                    </div>
                    <div>
                      <p className="font-semibold"><JobStatusBadge status={event.status} /></p>
                      <p className="text-sm text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          {job.plumber?.user ? (
            <Card>
              <CardHeader><CardTitle>{t('jobDetail.assignedPlumber')}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <UserIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{job.plumber.user.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>{job.plumber.user.phone}</span>
                </div>
                {job.plumber.profile && (
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-muted-foreground" />
                    <span>{job.plumber.profile.avgRating} ★ ({job.plumber.profile.reviewCount} {t('jobDetail.reviews')})</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader><CardTitle>{t('jobDetail.plumberStatus')}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t('jobDetail.matching')}</p>
              </CardContent>
            </Card>
          )}
          {job.status === JobStatus.COMPLETED && (
            <Card>
              <CardHeader>
                <CardTitle>{job.hasReview ? t('jobDetail.yourReview') : t('jobDetail.leaveReview')}</CardTitle>
                <CardDescription>{job.hasReview ? t('jobDetail.feedbackThanks') : t('jobDetail.feedbackHelp')}</CardDescription>
              </CardHeader>
              {!job.hasReview && (
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onReviewSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>{t('jobDetail.rating')}</FormLabel>
                            <FormControl>
                              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex">
                                {[1, 2, 3, 4, 5].map(n => (
                                  <FormItem key={n} className="flex items-center space-x-1 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value={String(n)} className="sr-only" />
                                    </FormControl>
                                    <FormLabel>
                                      <Star className={`cursor-pointer h-7 w-7 ${parseInt(field.value) >= n ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                                    </FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('jobDetail.comment')}</FormLabel>
                            <FormControl>
                              <Textarea placeholder={t('jobDetail.commentPlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">{t('jobDetail.submitReview')}</Button>
                    </form>
                  </Form>
                </CardContent>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}