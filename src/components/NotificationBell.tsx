import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { toast } from "sonner";
interface NotificationBellProps {
  message: string;
}
export function NotificationBell({ message }: NotificationBellProps) {
  const showNotification = () => {
    toast.info("Simulated Notification", {
      description: message,
      duration: 5000,
    });
  };
  return (
    <Button variant="ghost" size="icon" onClick={showNotification}>
      <Bell className="h-5 w-5" />
      <span className="sr-only">Show notification</span>
    </Button>
  );
}