import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import './i18n'; // Initialize i18next
import { HomePage } from '@/pages/HomePage'
import { AppLayout } from '@/components/AppLayout';
// Public Pages
import { HowItWorksPage } from '@/pages/public/HowItWorksPage';
import { ServicesPage } from '@/pages/public/ServicesPage';
import { ForPlumbersPage } from '@/pages/public/ForPlumbersPage';
import { AboutPage } from '@/pages/public/AboutPage';
import { FaqPage } from '@/pages/public/FaqPage';
import { ContactPage } from '@/pages/public/ContactPage';
import { LegalPage } from '@/pages/public/LegalPage';
// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignUpPage } from '@/pages/auth/SignUpPage';
// Customer Portal
import { CustomerDashboardPage } from '@/pages/customer/CustomerDashboardPage';
import { RequestJobPage } from '@/pages/customer/RequestJobPage';
import { JobDetailPage } from '@/pages/customer/JobDetailPage';
// Plumber Portal
import { PlumberDashboardPage } from '@/pages/plumber/PlumberDashboardPage';
import { PlumberJobDetailPage } from '@/pages/plumber/PlumberJobDetailPage';
import { PlumberEarningsPage } from '@/pages/plumber/PlumberEarningsPage';
import { PlumberProfilePage } from '@/pages/plumber/PlumberProfilePage';
// Admin Portal
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminPlumbersPage } from '@/pages/admin/AdminPlumbersPage';
import { AdminJobsPage } from '@/pages/admin/AdminJobsPage';
import { AdminReviewsPage } from '@/pages/admin/AdminReviewsPage';
import { AdminValidationPage } from '@/pages/admin/AdminValidationPage';
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: "/", element: <HomePage /> },
      // Public pages
      { path: "/how-it-works", element: <HowItWorksPage /> },
      { path: "/services", element: <ServicesPage /> },
      { path: "/for-plumbers", element: <ForPlumbersPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/faq", element: <FaqPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/legal/:slug", element: <LegalPage /> },
      // Auth pages
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignUpPage /> },
      // Customer Portal
      {
        path: "/customer",
        children: [
          { path: "dashboard", element: <CustomerDashboardPage /> },
          { path: "jobs/new", element: <RequestJobPage /> },
          { path: "jobs/:jobId", element: <JobDetailPage /> },
        ]
      },
      // Plumber Portal
      {
        path: "/plumber",
        children: [
          { path: "dashboard", element: <PlumberDashboardPage /> },
          { path: "jobs/:jobId", element: <PlumberJobDetailPage /> },
          { path: "earnings", element: <PlumberEarningsPage /> },
          { path: "profile", element: <PlumberProfilePage /> },
        ]
      },
      // Admin Portal
      {
        path: "/admin",
        children: [
          { path: "dashboard", element: <AdminDashboardPage /> },
          { path: "users", element: <AdminUsersPage /> },
          { path: "plumbers", element: <AdminPlumbersPage /> },
          { path: "jobs", element: <AdminJobsPage /> },
          { path: "reviews", element: <AdminReviewsPage /> },
          { path: "validation", element: <AdminValidationPage /> },
        ]
      },
    ]
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>,
)