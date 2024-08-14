export type Offer = {
  title: string;
  description: string;
  description2?: string;
  discount:  string;
  code: string;
  quantityEffect:  string;
  effect: "flat" | "percentage" | "quantity";
  active: boolean;
};


// Product type
export interface Product {
    id: string;
    SKU:string;
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
    offers?:Offer[];
    exchangeAndReturnPolicy?:string;
    moreInformation?:string;
    payOnDelivery?:boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  // title: generateRandomTitle(),
  // description: generateRandomDescription(),
  // description2: "Additional description here",
  // discount: Math.floor(Math.random() * 51), // Generate random discount between 0 and 50
  // image: generateRandomImage(),
  // quantityEffect: Math.floor(Math.random() * 10) + 1, // Generate random quantity effect between 1 and 10
  // effect: ["flat", "percentage", "quantity"][Math.floor(Math.random() * 3)],
  // active: Math.random() < 0.5