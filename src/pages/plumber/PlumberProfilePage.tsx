import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api-client";
import type { PlumberProfile } from "@shared/types";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
const profileSchema = z.object({
  bio: z.string().min(20, "Bio must be at least 20 characters."),
  radiusKm: z.coerce.number().min(1, "Service radius must be at least 1 km."),
  baseRate: z.coerce.number().min(0, "Base rate cannot be negative."),
  isAvailable: z.boolean(),
});
type ProfileFormData = z.infer<typeof profileSchema>;
export function PlumberProfilePage() {
  const { t } = useTranslation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PlumberProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: '',
      radiusKm: 10,
      baseRate: 50,
      isAvailable: true,
    }
  });
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'PLUMBER') {
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const userProfile = await api<PlumberProfile>(`/api/plumber-profiles/${currentUser.id}`);
        if (userProfile) {
          setProfile(userProfile);
          form.reset(userProfile);
        } else {
          toast.error(t('plumberProfile.errors.profileNotFound'));
        }
      } catch (error) {
        toast.error(t('plumberProfile.errors.loadFailed'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser, navigate, form, t]);
  const onSubmit: SubmitHandler<ProfileFormData> = async (values) => {
    if (!profile) {
      toast.error(t('plumberProfile.errors.cannotUpdate'));
      return;
    }
    const promise = api(`/api/plumber-profiles/${profile.id}`, {
      method: 'PATCH',
      body: JSON.stringify(values),
    }).then(updatedProfile => {
        setProfile(updatedProfile as PlumberProfile);
        form.reset(updatedProfile as ProfileFormData);
        return updatedProfile;
      });
    toast.promise(promise, {
      loading: t('plumberProfile.toast.loading'),
      success: t('plumberProfile.toast.success'),
      error: t('plumberProfile.toast.error'),
    });
  };
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <PageHeader title={t('plumberProfile.title')} />
        <Card>
          <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
          <CardContent className="space-y-8">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!profile) return null;
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader title={t('plumberProfile.title')} description={t('plumberProfile.description')} />
      <Card>
        <CardHeader>
          <CardTitle>{currentUser?.name}</CardTitle>
          <CardDescription>{currentUser?.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control} name="isAvailable" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{t('plumberProfile.availability.label')}</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {t('plumberProfile.availability.description')}
                    </p>
                  </div>
                  <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="bio" render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('plumberProfile.bio.label')}</FormLabel>
                  <FormControl><Textarea placeholder={t('plumberProfile.bio.placeholder')} rows={4} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField control={form.control} name="radiusKm" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('plumberProfile.radius.label')}</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="baseRate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('plumberProfile.rate.label')}</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t('plumberProfile.saving') : t('plumberProfile.save')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}