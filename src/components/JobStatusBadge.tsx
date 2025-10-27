import { Badge } from "@/components/ui/badge";
import { JobStatus } from "@shared/types";
import { cn } from "@/lib/utils";
interface JobStatusBadgeProps {
  status: JobStatus;
  className?: string;
}
const statusStyles: Record<JobStatus, string> = {
  [JobStatus.REQUESTED]: "bg-gray-100 text-gray-800",
  [JobStatus.MATCHING]: "bg-yellow-100 text-yellow-800 animate-pulse",
  [JobStatus.ACCEPTED]: "bg-blue-100 text-blue-800",
  [JobStatus.EN_ROUTE]: "bg-indigo-100 text-indigo-800",
  [JobStatus.ON_SITE]: "bg-purple-100 text-purple-800",
  [JobStatus.COMPLETED]: "bg-green-100 text-green-800",
  [JobStatus.CANCELLED]: "bg-red-100 text-red-800",
};
export function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
  const formattedStatus = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return (
    <Badge className={cn("border-transparent", statusStyles[status], className)}>
      {formattedStatus}
    </Badge>
  );
}