import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Wrench } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { useTranslation } from "react-i18next";
export function HowItWorksPage() {
  const { t } = useTranslation();
  const customerSteps = [
    { title: t('howItWorks.customerSteps.step1.title'), description: t('howItWorks.customerSteps.step1.description') },
    { title: t('howItWorks.customerSteps.step2.title'), description: t('howItWorks.customerSteps.step2.description') },
    { title: t('howItWorks.customerSteps.step3.title'), description: t('howItWorks.customerSteps.step3.description') },
    { title: t('howItWorks.customerSteps.step4.title'), description: t('howItWorks.customerSteps.step4.description') },
  ];
  const plumberSteps = [
    { title: t('howItWorks.plumberSteps.step1.title'), description: t('howItWorks.plumberSteps.step1.description') },
    { title: t('howItWorks.plumberSteps.step2.title'), description: t('howItWorks.plumberSteps.step2.description') },
    { title: t('howItWorks.plumberSteps.step3.title'), description: t('howItWorks.plumberSteps.step3.description') },
    { title: t('howItWorks.plumberSteps.step4.title'), description: t('howItWorks.plumberSteps.step4.description') },
  ];
  return (
    <div className="bg-background">
      <Container className="py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold font-display tracking-tight sm:text-5xl md:text-6xl">{t('howItWorks.title')}</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
            {t('howItWorks.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* For Customers */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <User className="h-10 w-10 text-blue-500" />
              <h2 className="text-3xl font-bold font-display">{t('howItWorks.forCustomers')}</h2>
            </div>
            {customerSteps.map((step, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* For Plumbers */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Wrench className="h-10 w-10 text-amber-500" />
              <h2 className="text-3xl font-bold font-display">{t('howItWorks.forPlumbers')}</h2>
            </div>
            {plumberSteps.map((step, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}