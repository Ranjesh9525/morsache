// Product type
export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    salePrice?: number;
    sizes: string[];
    colors: string[];
    image: string;
    rating: number;
    stock: number;
    isNew: boolean;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
