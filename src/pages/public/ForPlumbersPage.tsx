import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, DollarSign, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { useTranslation } from "react-i18next";
export function ForPlumbersPage() {
  const { t } = useTranslation();
  const benefits = [
    { icon: MapPin, title: t('forPlumbers.benefits.localJobs.title'), description: t('forPlumbers.benefits.localJobs.description') },
    { icon: Calendar, title: t('forPlumbers.benefits.flexibleSchedule.title'), description: t('forPlumbers.benefits.flexibleSchedule.description') },
    { icon: DollarSign, title: t('forPlumbers.benefits.keepEarnings.title'), description: t('forPlumbers.benefits.keepEarnings.description') },
    { icon: Check, title: t('forPlumbers.benefits.simpleManagement.title'), description: t('forPlumbers.benefits.simpleManagement.description') },
  ];
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <Container className="py-20 text-center">
          <h1 className="text-4xl font-extrabold font-display tracking-tight sm:text-5xl md:text-6xl">{t('forPlumbers.heroTitle')}</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-blue-100">
            {t('forPlumbers.heroSubtitle')}
          </p>
          <Button size="lg" asChild className="mt-8 bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
            <Link to="/signup">{t('forPlumbers.cta')}</Link>
          </Button>
        </Container>
      </section>
      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-display">{t('forPlumbers.whyPartner')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('forPlumbers.whySubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="flex items-start p-6 gap-6">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full">
                  <benefit.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="mt-2 text-muted-foreground">{benefit.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}