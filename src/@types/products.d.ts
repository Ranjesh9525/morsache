// Product type
export interface Product {

    id: string;
    name: string;
    description: string;
    category?: string[];
    price: string;
    slug:string;
    salePrice?: string;
    sizes: string[];
    tags?:string[];
    variants?: {variant:string,image:string}[];
    images: string[];
    rating?: number;
    purchaseQuantity:number;
    stock?: string;
    offers?:{title:string,description:string,description2?:string,discount:number}[];
    exchangeAndReturnPolicy?:string;
    moreInformation?:string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
