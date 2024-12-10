import { Product } from "../../shared/interfaces/product.interface";

export interface Cart {
  id:         number;
  user:       number;
  products:   ProductElement[];
  total:      string;
  created_at: Date;
  updated_at: Date;
}

export interface ProductElement {
  id:          number;
  product:     Product;
  quantity:    number;
  total_price: string;
}


