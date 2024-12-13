import { Component, OnInit } from '@angular/core';
import { Product } from '../../../shared/interfaces/product.interface';
import { ProductService } from '../../../shared/services/product.service';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { InventoryStatus } from '../../../shop/interfaces/inventory-status.enum';
import { Category } from '../../../shared/interfaces/category.interface';

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

  categories: Category[] = [];

  product: Product = {} as Product;
  productImage: string = '';
  createProduct: boolean = false;

  selectedProducts: Product[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService
  ) {}

  private user_id = this.authenticationService.user()?.id as number;

  public isUploadingImage: boolean = false;

  ngOnInit() {
    this.updateProducts();

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'product', header: 'Producto' },
      { field: 'name', header: 'Nombre' },
      { field: 'image', header: 'Imagen' },
      { field: 'price', header: 'Precio' },
      { field: 'categoryName', header: 'Categoria' },
      { field: 'inventoryStatus', header: 'Estado' },
    ];

    this.statuses = [
      { label: InventoryStatus.EN_STOCK, value: InventoryStatus.EN_STOCK },
      { label: InventoryStatus.BAJO_STOCK, value: InventoryStatus.BAJO_STOCK },
      {
        label: InventoryStatus.FUERA_DE_STOCK,
        value: InventoryStatus.FUERA_DE_STOCK,
      },
    ];

    this.productService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
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
    this.createProduct = true;
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

  confirmDelete() {
    this.deleteProductDialog = false;

    this.productService
      .deleteProduct(this.product.id as number)
      .subscribe(() => {
        this.updateProducts();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Producto eliminado con éxito!`,
          life: 3000,
        });
        this.product = {} as Product;
      });

    this.product = {} as Product;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct(option?: 'create' | 'edit') {
    this.submitted = true;

    if (this.createProduct) {
      this.productService.createProduct(this.product).subscribe((product) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Exitoso',
          detail: 'Producto creado exitosamente!',
          life: 3000,
        });
        this.createProduct = false;
        this.updateProducts();
      });
    } else {
      if (this.product.name?.trim()) {
        if (this.product.id) {
          this.productService.editProduct(this.product).subscribe((product) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Exitoso',
              detail: 'Producto editado exitosamente!',
              life: 3000,
            });
            this.updateProducts();
          });
        }
      }

      this.isUploadingImage = false;
      this.productDialog = false;
      this.product = {} as Product;
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onUpload(event: any) {
    // Variable to know if the image is being uploaded
    this.isUploadingImage = true;

    // SHOW IMAGE IN THE IMG TAG
    const image = event.files[0].objectURL.changingThisBreaksApplicationSecurity;


    this.product.image = event.files[0];
  }
}
