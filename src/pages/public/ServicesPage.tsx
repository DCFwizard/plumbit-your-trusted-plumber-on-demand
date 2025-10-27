import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Zap, Wrench, Heater, Hammer } from 'lucide-react';
import { Container } from "@/components/layout/Container";
import { useTranslation } from "react-i18next";
export function ServicesPage() {
  const { t } = useTranslation();
  const services = [
    { icon: Droplet, title: t('services.leakRepairs.title'), description: t('services.leakRepairs.description') },
    { icon: Wrench, title: t('services.blockedDrains.title'), description: t('services.blockedDrains.description') },
    { icon: Heater, title: t('services.boilersHeating.title'), description: t('services.boilersHeating.description') },
    { icon: Hammer, title: t('services.fixtureInstallation.title'), description: t('services.fixtureInstallation.description') },
    { icon: Zap, title: t('services.emergencies.title'), description: t('services.emergencies.description') },
  ];
  return (
    <div className="bg-background">
      <Container className="py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold font-display tracking-tight sm:text-5xl md:text-6xl">{t('services.title')}</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
            {t('services.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="flex flex-col text-center items-center p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full mb-4">
                <service.icon className="h-10 w-10 text-blue-600" />
              </div>
              <CardHeader className="p-0">
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-2">
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-20 text-center p-8 bg-muted rounded-lg">
          <h3 className="text-2xl font-bold">{t('services.pricingNote.title')}</h3>
          <p className="mt-2 text-muted-foreground max-w-3xl mx-auto">
            {t('services.pricingNote.description')}
          </p>
        </div>
      </Container>
    </div>
  );
}