import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api-client";
import { Users, Wrench, Briefcase, CheckCircle } from "lucide-react";
import { toast } from "sonner";
interface DashboardStats {
  totalCustomers: number;
  totalPlumbers: number;
  activeJobs: number;
  completedJobs: number;
}
export function AdminDashboardPage() {
  const { t } = useTranslation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await api<DashboardStats>('/api/admin/dashboard-stats');
        setStats(data);
      } catch (error) {
        toast.error("Failed to load dashboard statistics.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [currentUser, navigate]);
  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={t('adminDashboard.title')}
        description={t('adminDashboard.description')}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('adminDashboard.totalCustomers')}
          value={stats?.totalCustomers ?? 0}
          icon={Users}
          isLoading={isLoading}
        />
        <StatCard
          title={t('adminDashboard.totalPlumbers')}
          value={stats?.totalPlumbers ?? 0}
          icon={Wrench}
          isLoading={isLoading}
        />
        <StatCard
          title={t('adminDashboard.activeJobs')}
          value={stats?.activeJobs ?? 0}
          icon={Briefcase}
          isLoading={isLoading}
        />
        <StatCard
          title={t('adminDashboard.completedJobs')}
          value={stats?.completedJobs ?? 0}
          icon={CheckCircle}
          isLoading={isLoading}
        />
      </div>
      <div className="mt-12 text-center text-muted-foreground">
        <p>{t('adminDashboard.moreTools')}</p>
      </div>
    </div>
  );
}