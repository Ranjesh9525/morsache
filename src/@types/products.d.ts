// Product type
export interface Product {

    id: string;
    name: string;
    description: string;
    category?: string[];
    price: number;
    slug:string;
    salePrice?: number;
    sizes: string[];
    tags?:string[];
    variants?: {variant:string,image:string}[];
    images: string[];
    rating?: number;
    purchaseQuantity:number;
    stock?: number;
    isFeatured?: boolean;
    offers?:{title:string,description:string}[];
    exchangeAndReturnPolicy?:string;
    moreInformation?:string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
