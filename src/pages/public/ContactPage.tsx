import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Clock } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { useTranslation } from "react-i18next";
export function ContactPage() {
  const { t } = useTranslation();
  return (
    <div className="bg-background">
      <Container className="py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold font-display tracking-tight sm:text-5xl md:text-6xl">{t('contact.title')}</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
            {t('contact.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <Mail className="h-8 w-8 text-blue-500 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">{t('contact.emailTitle')}</h3>
                <p className="text-muted-foreground">{t('contact.emailDesc')}</p>
                <a href="mailto:support@plumbit.com" className="text-blue-600 hover:underline">support@plumbit.com</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-8 w-8 text-blue-500 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">{t('contact.phoneTitle')}</h3>
                <p className="text-muted-foreground">{t('contact.phoneDesc')}</p>
                <a href="tel:+3902123456" className="text-blue-600 hover:underline">+39 02 123456</a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="h-8 w-8 text-blue-500 mt-1" />
              <div>
                <h3 className="text-xl font-semibold">{t('contact.hoursTitle')}</h3>
                <p className="text-muted-foreground">{t('contact.hoursP1')}</p>
                <p className="text-muted-foreground">{t('contact.hoursP2')}</p>
              </div>
            </div>
          </div>
          <form className="space-y-6 p-8 border rounded-lg bg-muted/50">
            <div className="space-y-2">
              <Label htmlFor="name">{t('contact.formName')}</Label>
              <Input id="name" placeholder={t('contact.formNamePlaceholder')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('contact.formEmail')}</Label>
              <Input id="email" type="email" placeholder={t('contact.formEmailPlaceholder')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">{t('contact.formMessage')}</Label>
              <Textarea id="message" placeholder={t('contact.formMessagePlaceholder')} rows={5} />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">{t('contact.formSubmit')}</Button>
          </form>
        </div>
      </Container>
    </div>
  );
}