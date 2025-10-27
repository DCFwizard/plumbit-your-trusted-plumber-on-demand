import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, DataTableColumn } from "@/components/DataTable";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api-client";
import type { User } from "@shared/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
export function AdminUsersPage() {
  const { t } = useTranslation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    api<User[]>('/api/admin/users')
      .then(data => setUsers(data))
      .catch(() => toast.error(t('admin.users.toast.loadFailed')))
      .finally(() => setIsLoading(false));
  }, [currentUser, navigate, t]);
  const columns: DataTableColumn<User>[] = [
    { accessorKey: "name", header: t('admin.users.columns.name'), cell: (name: string) => name },
    { accessorKey: "email", header: t('admin.users.columns.email'), cell: (email: string) => email },
    { accessorKey: "phone", header: t('admin.users.columns.phone'), cell: (phone: string) => phone },
    { accessorKey: "role", header: t('admin.users.columns.role'), cell: (role: User['role']) => <Badge variant="secondary">{role}</Badge> },
    { accessorKey: "createdAt", header: t('admin.users.columns.joined'), cell: (date: string) => new Date(date).toLocaleDateString() },
  ];
  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={t('admin.users.title')}
        description={t('admin.users.description')}
      />
      <DataTable columns={columns} data={users} isLoading={isLoading} />
    </div>
  );
}