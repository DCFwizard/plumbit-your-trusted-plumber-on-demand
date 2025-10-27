import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, DataTableColumn } from "@/components/DataTable";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api-client";
import type { User, PlumberProfile } from "@shared/types";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
type PlumberWithProfile = User & { profile?: PlumberProfile };
export function AdminPlumbersPage() {
  const { t } = useTranslation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const navigate = useNavigate();
  const [plumbers, setPlumbers] = useState<PlumberWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchPlumbers = useCallback(() => {
    setIsLoading(true);
    api<PlumberWithProfile[]>('/api/admin/plumbers')
      .then((data) => setPlumbers(data))
      .catch(() => toast.error(t('admin.plumbers.toast.loadFailed')))
      .finally(() => setIsLoading(false));
  }, [t]);
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    fetchPlumbers();
  }, [currentUser, navigate, fetchPlumbers]);
  const handleApprovalChange = (plumberId: string, isAvailable: boolean) => {
    const originalPlumbers = [...plumbers];
    const plumberToUpdate = plumbers.find(p => p.id === plumberId);
    if (!plumberToUpdate || !plumberToUpdate.profile) {
      toast.error(t('admin.plumbers.toast.noProfile'));
      return;
    }
    // Optimistically update UI
    setPlumbers((prev) => prev.map((p) => p.id === plumberId && p.profile ? { ...p, profile: { ...p.profile, isAvailable } } : p));
    api(`/api/admin/plumbers/${plumberToUpdate.profile.id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ isAvailable })
    }).catch(() => {
      toast.error(t('admin.plumbers.toast.updateFailed'));
      setPlumbers(originalPlumbers); // Revert on failure
    });
  };
  const columns: DataTableColumn<PlumberWithProfile>[] = [
    { accessorKey: "name", header: t('admin.plumbers.columns.name'), cell: (name: string) => name },
    { accessorKey: "email", header: t('admin.plumbers.columns.email'), cell: (email: string) => email },
    { accessorKey: "profile.avgRating", header: t('admin.plumbers.columns.rating'), cell: (rating: number) => rating ? `${rating} ★` : 'N/A' },
    {
      accessorKey: "profile.isAvailable", header: t('admin.plumbers.columns.status'), cell: (isAvailable: boolean) => (
        <Badge variant={isAvailable ? "default" : "destructive"} className={isAvailable ? "bg-green-600" : ""}>
          {isAvailable ? t('admin.plumbers.status.approved') : t('admin.plumbers.status.pending')}
        </Badge>
      )
    },
    {
      accessorKey: "profile", header: t('admin.plumbers.columns.approve'), cell: (profile: PlumberProfile, plumber: PlumberWithProfile) => (
        profile ? (
          <Switch
            checked={profile.isAvailable}
            onCheckedChange={(checked) => handleApprovalChange(plumber.id, checked)}
          />
        ) : t('admin.plumbers.noProfile')
      )
    }
  ];
  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={t('admin.plumbers.title')}
        description={t('admin.plumbers.description')}
      />
      <DataTable columns={columns} data={plumbers} isLoading={isLoading} />
    </div>
  );
}