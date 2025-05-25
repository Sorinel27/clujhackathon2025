export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  shelf_stock: number;
  warehouse_stock: number;
  total_stock: number;
  aile: string;
  section: string;
  shelf: string;
  last_updated: string;

  // Add these optional frontend-only fields
  brand?: string;
  image?: string; // ⬅️ add this line
  availability?: 'warehouse' | 'out_of_stock' | 'shelf';
}