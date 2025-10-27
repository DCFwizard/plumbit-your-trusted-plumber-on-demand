import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { DataTable, DataTableColumn } from "@/components/DataTable";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api-client";
import type { Review } from "@shared/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Star, Trash2 } from "lucide-react";
export function AdminReviewsPage() {
  const { t } = useTranslation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchReviews = useCallback(() => {
    setIsLoading(true);
    api<Review[]>('/api/admin/reviews')
      .then(data => setReviews(data))
      .catch(() => toast.error(t('admin.reviews.toast.loadFailed')))
      .finally(() => setIsLoading(false));
  }, [t]);
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    fetchReviews();
  }, [currentUser, navigate, fetchReviews]);
  const handleDeleteReview = (reviewId: string) => {
    if (!window.confirm(t('admin.reviews.confirmDelete'))) return;
    api(`/api/admin/reviews/${reviewId}`, { method: 'DELETE' })
      .then(() => {
        toast.success(t('admin.reviews.toast.deleteSuccess'));
        fetchReviews();
      })
      .catch(() => toast.error(t('admin.reviews.toast.deleteFailed')));
  };
  const columns: DataTableColumn<Review>[] = [
    { accessorKey: "rating", header: t('admin.reviews.columns.rating'), cell: (rating: number) => (
      <div className="flex items-center">
        {rating} <Star className="h-4 w-4 ml-1 text-amber-400 fill-amber-400" />
      </div>
    )},
    { accessorKey: "comment", header: t('admin.reviews.columns.comment'), cell: (comment: string) => <p className="max-w-md truncate">{comment}</p> },
    { accessorKey: "authorId", header: t('admin.reviews.columns.authorId'), cell: (id: string) => id.slice(-6) },
    { accessorKey: "plumberId", header: t('admin.reviews.columns.plumberId'), cell: (id: string) => id.slice(-6) },
    { accessorKey: "createdAt", header: t('admin.reviews.columns.date'), cell: (date: string) => new Date(date).toLocaleDateString() },
    { accessorKey: "actions", header: t('admin.reviews.columns.actions'), cell: (_: any, review: Review) => (
      <Button variant="destructive" size="sm" onClick={() => handleDeleteReview(review.id)}>
        <Trash2 className="h-4 w-4 mr-2" /> {t('admin.reviews.deleteButton')}
      </Button>
    )},
  ];
  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title={t('admin.reviews.title')}
        description={t('admin.reviews.description')}
      />
      <DataTable columns={columns} data={reviews} isLoading={isLoading} />
    </div>
  );
}