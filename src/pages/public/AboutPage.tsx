import { Container } from "@/components/layout/Container";
import { Lightbulb, ShieldCheck, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
export function AboutPage() {
  const { t } = useTranslation();
  const values = [
    {
      icon: ShieldCheck,
      title: t('about.value1Title'),
      description: t('about.value1Desc')
    },
    {
      icon: Lightbulb,
      title: t('about.value2Title'),
      description: t('about.value2Desc')
    },
    {
      icon: Users,
      title: t('about.value3Title'),
      description: t('about.value3Desc')
    }
  ];
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <Container className="text-center">
          <h1 className="text-4xl font-extrabold font-display tracking-tight sm:text-5xl md:text-6xl">
            {t('about.heroTitle')}
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-muted-foreground">
            {t('about.heroSubtitle')}
          </p>
        </Container>
      </section>
      {/* Main Content Section */}
      <section className="py-16 md:py-24">
        <Container className="max-w-3xl mx-auto space-y-12">
          <div>
            <h2 className="text-3xl font-bold font-display tracking-tight text-center">{t('about.storyTitle')}</h2>
            <div className="mt-6 space-y-4 text-lg text-muted-foreground">
              <p>{t('about.storyP1')}</p>
              <p>{t('about.storyP2')}</p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold font-display tracking-tight text-center">{t('about.missionTitle')}</h2>
            <div className="mt-6 space-y-4 text-lg text-muted-foreground">
              <p>{t('about.missionP1')}</p>
              <p>{t('about.missionP2')}</p>
            </div>
          </div>
        </Container>
      </section>
      {/* Our Values Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-display">{t('about.valuesTitle')}</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('about.valuesSubtitle')}
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 mx-auto">
                  <value.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-6 text-xl font-semibold">{value.title}</h3>
                <p className="mt-2 text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}