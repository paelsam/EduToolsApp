import { Component, OnInit } from '@angular/core';
import { Product } from '../../../shared/interfaces/product.interface';
import { ProductService } from '../../../shared/services/product.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { environment } from '../../../../environments/environment';
import { InventoryStatus } from '../../../shop/interfaces/inventory-status.enum';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.scss',
})
export class ListProductComponent implements OnInit {
  productDialog: boolean = false;

  deleteProductDialog: boolean = false;

  deleteProductsDialog: boolean = false;

  products: Product[] = [];

  product: Product = {} as Product;

  selectedProducts: Product[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  baseUrl: string = environment.BACKEND_URL;

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService
  ) {}

  private user_id = this.authenticationService.user()?.id as number;

  ngOnInit() {
    this.updateProducts();

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'product', header: 'Producto' },
      { field: 'price', header: 'Precio' },
      { field: 'categoryName', header: 'Categoria' },
      { field: 'inventoryStatus', header: 'Estado' },
    ];

    this.statuses = [
      { label: InventoryStatus.EN_STOCK, value: InventoryStatus.EN_STOCK },
      { label: InventoryStatus.BAJO_STOCK, value: InventoryStatus.BAJO_STOCK },
      { label: InventoryStatus.FUERA_DE_STOCK, value: InventoryStatus.FUERA_DE_STOCK },
    ];
  }

  updateProducts() {
    this.productService.getProducts(this.user_id).subscribe((products) => {
      this.products = products;
    });
  }

  getStatusClass(status: InventoryStatus): string {
    return this.productService.getStatusClass(status);
  }

  openNew() {
    this.product = {} as Product;
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.deleteProductsDialog = true;
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteProduct(product: Product) {
    this.deleteProductDialog = true;
    this.product = { ...product };
  }

  confirmDeleteSelected() {
    this.deleteProductsDialog = false;
    this.products = this.products.filter(
      (val) => !this.selectedProducts.includes(val)
    );
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Products Deleted',
      life: 3000,
    });
    this.selectedProducts = [];
  }

  confirmDelete() {
    this.deleteProductDialog = false;

    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Product Deleted',
      life: 3000,
    });
    this.product = {} as Product;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.name?.trim()) {
      if (this.product.id) {
        this.productService.editProduct(this.product).subscribe((product) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Updated',
            life: 3000,
          });
        });
      }

      this.updateProducts();
      this.productDialog = false;
      this.product = {} as Product;
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
