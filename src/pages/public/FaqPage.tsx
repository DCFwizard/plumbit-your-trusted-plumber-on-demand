import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/layout/Container";
import { useTranslation } from "react-i18next";
export function FaqPage() {
  const { t } = useTranslation();
  const customerFaqs = [
    { question: t('faq.customerQuestions.q1.question'), answer: t('faq.customerQuestions.q1.answer') },
    { question: t('faq.customerQuestions.q2.question'), answer: t('faq.customerQuestions.q2.answer') },
    { question: t('faq.customerQuestions.q3.question'), answer: t('faq.customerQuestions.q3.answer') },
    { question: t('faq.customerQuestions.q4.question'), answer: t('faq.customerQuestions.q4.answer') }
  ];
  const plumberFaqs = [
    { question: t('faq.plumberQuestions.q1.question'), answer: t('faq.plumberQuestions.q1.answer') },
    { question: t('faq.plumberQuestions.q2.question'), answer: t('faq.plumberQuestions.q2.answer') },
    { question: t('faq.plumberQuestions.q3.question'), answer: t('faq.plumberQuestions.q3.answer') },
    { question: t('faq.plumberQuestions.q4.question'), answer: t('faq.plumberQuestions.q4.answer') }
  ];
  return (
    <div className="bg-background">
      <Container className="py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold font-display tracking-tight sm:text-5xl md:text-6xl">{t('faq.title')}</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
            {t('faq.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold font-display mb-6">{t('faq.forCustomers')}</h2>
            <Accordion type="single" collapsible className="w-full">
              {customerFaqs.map((faq, index) => (
                <AccordionItem value={`customer-${index}`} key={index}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-display mb-6">{t('faq.forPlumbers')}</h2>
            <Accordion type="single" collapsible className="w-full">
              {plumberFaqs.map((faq, index) => (
                <AccordionItem value={`plumber-${index}`} key={index}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </Container>
    </div>
  );
}