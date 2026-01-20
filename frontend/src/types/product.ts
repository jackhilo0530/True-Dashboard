export type ProductStatus = "draft" | "active" | "blocked";

export interface Product {
  id: number;
  name: string;
  imgUrl: string;
  pdfUrl: string;
  description?: string | null;
  price: number;
  sku: string;
  stock: number;
  status: ProductStatus;
}