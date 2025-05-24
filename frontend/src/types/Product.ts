
export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  image: string;
  availability: 'shelf' | 'warehouse' | 'out_of_stock';
  stock: number;
  description: string;
}
