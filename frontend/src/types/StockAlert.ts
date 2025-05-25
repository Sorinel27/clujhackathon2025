export interface StockAlert {
  id: string;
  product_id: string;
  alert_type: string;
  message: string;
  created_at: string;
  resolved_at: string | null;
  resolved_by: string | null;
}
