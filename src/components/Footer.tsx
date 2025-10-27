import { Link } from 'react-router-dom';
import { Wrench, Twitter, Facebook, Instagram } from 'lucide-react';
import { Container } from './layout/Container';
import { useTranslation } from 'react-i18next';
export function Footer() {
  const { t } = useTranslation();
  const legalLinks = [
    { to: '/legal/terms', label: t('footer.terms') },
    { to: '/legal/privacy', label: t('footer.privacy') },
    { to: '/legal/cookies', label: t('footer.cookies') },
  ];
  const socialLinks = [
    { icon: Twitter, href: '#' },
    { icon: Facebook, href: '#' },
    { icon: Instagram, href: '#' },
  ];
  return (
    <footer className="bg-muted text-muted-foreground">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="space-y-8 xl:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-foreground font-display text-2xl font-bold">
              <Wrench className="h-7 w-7 text-blue-500" />
              <span>Plumbit</span>
            </Link>
            <p className="text-base">{t('footer.tagline')}</p>
            <div className="flex space-x-6">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href} className="hover:text-foreground">
                  <span className="sr-only">{social.icon.displayName}</span>
                  <social.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">{t('footer.company')}</h3>
              <ul className="mt-4 space-y-4">
                <li><Link to="/about" className="text-base hover:text-foreground">{t('footer.about')}</Link></li>
                <li><Link to="/contact" className="text-base hover:text-foreground">{t('footer.contact')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">{t('footer.forUsers')}</h3>
              <ul className="mt-4 space-y-4">
                <li><Link to="/how-it-works" className="text-base hover:text-foreground">{t('footer.howItWorks')}</Link></li>
                <li><Link to="/services" className="text-base hover:text-foreground">{t('footer.services')}</Link></li>
                <li><Link to="/faq" className="text-base hover:text-foreground">{t('footer.faq')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">{t('footer.forPlumbers')}</h3>
              <ul className="mt-4 space-y-4">
                <li><Link to="/for-plumbers" className="text-base hover:text-foreground">{t('footer.becomePartner')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">{t('footer.legal')}</h3>
              <ul className="mt-4 space-y-4">
                {legalLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-base hover:text-foreground">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="text-base">&copy; {new Date().getFullYear()} Plumbit, Inc. All rights reserved.</p>
          <p className="text-center text-sm mt-2">Built with ❤️ at Cloudflare</p>
        </div>
      </Container>
    </footer>
  );
}