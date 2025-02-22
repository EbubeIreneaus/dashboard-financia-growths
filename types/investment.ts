export type Investment = {
    active: boolean;
    amount: number; // Consider changing to number if needed
    createdAt: string; // Can be Date if parsed
    id: number;
    investmentId: number;
    next_due_date: number | null; // Can be Date if parsed
    plan: string;
    roi: number; // Consider changing to number if needed
    start_date: string | null; // Can be Date if parsed
    userId: number;
  };
  