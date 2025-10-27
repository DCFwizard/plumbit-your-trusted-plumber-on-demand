import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, DataTableColumn } from "@/components/DataTable";
import { StatCard } from "@/components/StatCard";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api-client";
import type { MarketRequest, AnalyticsData } from "@shared/types";
import { toast } from "sonner";
import { Eye, Users } from "lucide-react";
export function AdminValidationPage() {
  const { t } = useTranslation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const navigate = useNavigate();
  const [requests, setRequests] = useState<MarketRequest[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [reqs, anlts] = await Promise.all([
          api<MarketRequest[]>('/api/admin/market-requests'),
          api<AnalyticsData>('/api/admin/analytics'),
        ]);
        setRequests(reqs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setAnalytics(anlts);
      } catch (error) {
        toast.error(t('admin.validation.toast.loadFailed'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentUser, navigate, t]);
  const columns: DataTableColumn<MarketRequest>[] = [
    { accessorKey: "name", header: t('admin.validation.columns.name'), cell: (name: string) => name },
    { accessorKey: "contact", header: t('admin.validation.columns.contact'), cell: (contact: string) => contact },
    { accessorKey: "address", header: t('admin.validation.columns.address'), cell: (address: string) => address },
    { accessorKey: "description", header: t('admin.validation.columns.description'), cell: (desc: string) => <p className="max-w-md truncate">{desc}</p> },
    { accessorKey: "createdAt", header: t('admin.validation.columns.submitted'), cell: (date: string) => new Date(date).toLocaleString() },
  ];
  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={t('admin.validation.title')}
        description={t('admin.validation.description')}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title={t('admin.validation.pageViews')}
          value={analytics?.pageViews ?? 0}
          icon={Eye}
          isLoading={isLoading}
        />
        <StatCard
          title={t('admin.validation.totalLeads')}
          value={requests.length}
          icon={Users}
          isLoading={isLoading}
        />
      </div>
      <DataTable columns={columns} data={requests} isLoading={isLoading} />
    </div>
  );
}