import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
const marketRequestSchema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  contact: z.string().min(5, 'Please enter a valid email or phone number.'),
  address: z.string().min(10, 'Please enter a full address.'),
  description: z.string().min(20, 'Please describe the issue in at least 20 characters.'),
});
export function PublicRequestForm() {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof marketRequestSchema>>({
    resolver: zodResolver(marketRequestSchema),
    defaultValues: {
      name: '',
      contact: '',
      address: '',
      description: '',
    },
  });
  async function onSubmit(values: z.infer<typeof marketRequestSchema>) {
    const promise = api('/api/market-request', {
      method: 'POST',
      body: JSON.stringify(values),
    });
    toast.promise(promise, {
      loading: 'Submitting your request...',
      success: () => {
        form.reset();
        return 'Request received! We will be in touch soon.';
      },
      error: 'Failed to submit request. Please try again.',
    });
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{t('publicRequestForm.title')}</CardTitle>
        <CardDescription>{t('publicRequestForm.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('publicRequestForm.nameLabel')}</FormLabel>
                    <FormControl><Input placeholder={t('publicRequestForm.namePlaceholder')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('publicRequestForm.contactLabel')}</FormLabel>
                    <FormControl><Input placeholder={t('publicRequestForm.contactPlaceholder')} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('publicRequestForm.addressLabel')}</FormLabel>
                  <FormControl><Input placeholder={t('publicRequestForm.addressPlaceholder')} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('publicRequestForm.issueLabel')}</FormLabel>
                  <FormControl><Textarea placeholder={t('publicRequestForm.issuePlaceholder')} rows={4} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? t('publicRequestForm.submittingButton') : t('publicRequestForm.submitButton')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}