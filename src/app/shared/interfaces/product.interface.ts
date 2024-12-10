import { InventoryStatus } from "../../shop/interfaces/inventory-status.enum";
import { Category } from "./category.interface";


export interface Product {
  id?:         number;
  name:        string;
  description?: string;
  price:       string;
  stock?:       string;
  category?:    Category | number;
  image?:       string;
  inventoryStatus?: InventoryStatus;
}
