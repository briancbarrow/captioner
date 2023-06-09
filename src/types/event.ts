export type DGEvent = {
  id: string;
  title: string;
  slug?: string;
  publisher_key?: string;
  approval_status: "approved" | "pending" | "rejected";
  start_date: string;
  total_days: number;
  user_id: string;
  contact_email: string;
};
