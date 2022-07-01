import {Product} from "./product";

export class CartItem {

  // @ts-ignore
  id:string;
  // @ts-ignore
  name: string;
  // @ts-ignore
  imageUrl: string;
  // @ts-ignore
  unitPrice: number;

  // @ts-ignore
  quantity: number;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.imageUrl = product.imageUrl;
    this.unitPrice = product.unitPrice;

    this.quantity = 1;
  }
}
