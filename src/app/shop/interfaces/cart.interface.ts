import { InventoryStatus } from "./inventory-status.enum";

export interface Cart {
  id:         number;
  user:       number;
  products:   ProductElement[];
  total:      number;
  created_at: Date;
  updated_at: Date;
}

export interface ProductElement {
  id:            number;
  product:       number;
  product_name:  string;
  product_price: number;
  product_image: string;
  product_stock: number;
  quantity:      number;
  inventoryStatus: InventoryStatus;
  created_at:    Date;
  updated_at:    Date;
  disabled?:     boolean;
}
