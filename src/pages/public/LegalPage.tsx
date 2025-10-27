import { useParams } from "react-router-dom";
import { Container } from "@/components/layout/Container";
const legalContent = {
  terms: {
    title: "Terms of Service",
    content: `
      <p>Welcome to Plumbit. These terms and conditions outline the rules and regulations for the use of Plumbit's Website.</p>
      <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Plumbit if you do not agree to take all of the terms and conditions stated on this page.</p>
      <h2>1. The Service</h2>
      <p>Plumbit provides a platform to connect users ("Customers") seeking plumbing services with independent plumbing professionals ("Plumbers"). Plumbit does not provide plumbing services itself. All payment transactions are handled directly between the Customer and the Plumber.</p>
      <h2>2. User Accounts</h2>
      <p>To access most features of the service, you must register for an account. You are responsible for maintaining the confidentiality of your account and password.</p>
      <h2>3. Limitation of Liability</h2>
      <p>Plumbit is a technology platform and is not liable for the actions, quality of work, or conduct of any Plumber. Any disputes regarding services rendered must be resolved directly between the Customer and the Plumber.</p>
    `
  },
  privacy: {
    title: "Privacy Policy",
    content: `
      <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service.</p>
      <h2>1. Information We Collect</h2>
      <p>We collect information you provide directly to us, such as when you create an account, request a job, or contact us for support. This may include your name, email address, phone number, and address.</p>
      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to operate, maintain, and provide the features and functionality of the Service, including connecting Customers with Plumbers.</p>
      <h2>3. Information Sharing</h2>
      <p>We may share your information, such as your name, job description, and address, with Plumbers to facilitate the service request.</p>
    `
  },
  cookies: {
    title: "Cookie Policy",
    content: `
      <p>This Cookie Policy explains what cookies are and how we use them.</p>
      <h2>1. What are cookies?</h2>
      <p>Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>
      <h2>2. How we use cookies</h2>
      <p>We use cookies to understand how you use our site and to improve your experience. This includes personalizing content. We use essential cookies for authentication and session management.</p>
    `
  }
};
export function LegalPage() {
  const { slug } = useParams<{ slug: keyof typeof legalContent }>();
  const page = slug ? legalContent[slug] : null;
  if (!page) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="mt-4 text-lg text-muted-foreground">The legal document you are looking for could not be found.</p>
      </Container>
    );
  }
  return (
    <div className="bg-background">
      <Container className="py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold font-display tracking-tight sm:text-5xl md:text-6xl">{page.title}</h1>
        </div>
        <div
          className="prose prose-lg dark:prose-invert mx-auto max-w-4xl"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </Container>
    </div>
  );
}