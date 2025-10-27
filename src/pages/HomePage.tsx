import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Clock, ShieldCheck, Star } from 'lucide-react';
import { MOCK_TESTIMONIALS } from '@shared/mock-data';
import { PublicRequestForm } from '@/components/PublicRequestForm';
import { api } from '@/lib/api-client';
import { Container } from '@/components/layout/Container';
export function HomePage() {
  const { t } = useTranslation();
  const valueProps = [
    {
      icon: Clock,
      title: t('homepage.valueProps.prop1.title'),
      description: t('homepage.valueProps.prop1.description'),
    },
    {
      icon: CheckCircle,
      title: t('homepage.valueProps.prop2.title'),
      description: t('homepage.valueProps.prop2.description'),
    },
    {
      icon: ShieldCheck,
      title: t('homepage.valueProps.prop3.title'),
      description: t('homepage.valueProps.prop3.description'),
    },
  ];
  const howItWorksSteps = [
      {
          step: 1,
          title: t('homepage.howItWorks.step1.title'),
          description: t('homepage.howItWorks.step1.description')
      },
      {
          step: 2,
          title: t('homepage.howItWorks.step2.title'),
          description: t('homepage.howItWorks.step2.description')
      },
      {
          step: 3,
          title: t('homepage.howItWorks.step3.title'),
          description: t('homepage.howItWorks.step3.description')
      }
  ];
  useEffect(() => {
    api('/api/page-view', { method: 'POST' }).catch(console.error);
  }, []);
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900/50">
        <Container className="text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <Trans i18nKey="hero.title">
              Find a certified plumber
              <span className="text-blue-600">near you in minutes.</span>
            </Trans>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            {t('hero.subtitle')}
          </p>
          <p className="mt-4 text-sm text-gray-600 text-center">
            {t('homepage.availabilityNote')}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 w-full sm:w-auto">
              <a href="/#request-form">{t('hero.cta_request')}</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 w-full sm:w-auto">
              <Link to="/for-plumbers">{t('hero.cta_partner')}</Link>
            </Button>
          </div>
        </Container>
      </section>
      {/* Public Request Form Section */}
      <section id="request-form" className="py-16 md:py-24 bg-background">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-display">{t('homepage.publicRequestForm.title')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('homepage.publicRequestForm.description')}</p>
          </div>
          <div className="max-w-2xl mx-auto">
             <PublicRequestForm />
          </div>
        </Container>
      </section>
      {/* Value Propositions Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <Container>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {valueProps.map((prop) => (
              <Card key={prop.title} className="text-center p-6 border-none shadow-none bg-transparent">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full">
                    <prop.icon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{prop.title}</h3>
                <p className="mt-2 text-muted-foreground">{prop.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>
      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-background">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-display">{t('homepage.howItWorks.title')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('homepage.howItWorks.subtitle')}</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3">
            {howItWorksSteps.map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white font-bold text-2xl">
                  {step.step}
                </div>
                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-display">{t('homepage.testimonials.title')}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t('homepage.testimonials.subtitle')}</p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_TESTIMONIALS.map((testimonial) => (
              <Card key={testimonial.id} className="flex flex-col justify-between p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-background">
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <p className="mt-4 text-foreground">"{t(`homepage.testimonials.${testimonial.id}`)}"</p>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${testimonial.name}`} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}