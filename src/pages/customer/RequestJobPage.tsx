import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/PageHeader';
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
const jobRequestSchema = z.object({
  address: z.string().min(10, 'Please enter a full address.'),
  description: z.string().min(20, 'Please describe the issue in at least 20 characters.'),
  scheduledAt: z.string().min(1, 'Please select a date and time.'),
});
export function RequestJobPage() {
  const { t } = useTranslation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof jobRequestSchema>>({
    resolver: zodResolver(jobRequestSchema),
    defaultValues: {
      address: '',
      description: '',
      scheduledAt: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16), // Default to 1 hour from now
    },
  });
  async function onSubmit(values: z.infer<typeof jobRequestSchema>) {
    if (!currentUser) {
      toast.error('You must be logged in to request a job.');
      navigate('/login');
      return;
    }
    const promise = api('/api/jobs', {
      method: 'POST',
      body: JSON.stringify({
        ...values,
        customerId: currentUser.id,
      }),
    });
    toast.promise(promise, {
      loading: 'Submitting your job request...',
      success: () => {
        navigate('/customer/dashboard');
        return 'Job request submitted successfully!';
      },
      error: 'Failed to submit job request. Please try again.',
    });
  }
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={t('requestJob.title')}
        description={t('requestJob.description')}
      />
      <Card>
        <CardHeader>
          <CardTitle>{t('requestJob.jobDetails')}</CardTitle>
          <CardDescription>{t('requestJob.detailsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('requestJob.address')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('requestJob.addressPlaceholder')} {...field} />
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
                    <FormLabel>{t('requestJob.issueDescription')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('requestJob.issuePlaceholder')}
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('requestJob.preferredTime')}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t('requestJob.submitting') : t('requestJob.findPlumber')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}