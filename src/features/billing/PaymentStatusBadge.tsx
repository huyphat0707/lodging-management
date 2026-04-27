import { Badge } from "@/components/ui/badge";

type PaymentStatus = "Paid" | "Pending" | "Overdue";

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge
      variant={
        status === "Paid" ? "default" : status === "Pending" ? "secondary" : "destructive"
      }
    >
      {status}
    </Badge>
  );
}
