import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { ProductService } from '../../../shared/services/product.service';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Product } from '../../../shared/interfaces/product.interface';
import { InventoryStatus } from '../../interfaces/inventory-status.enum';
import { InputNumber } from 'primeng/inputnumber';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../../interfaces/cart.interface';
import { LoadingService } from '../../../shared/services/loading.service';
import { AuthStatus } from '../../../authentication/interfaces/auth-status.enum';
import { Category } from '../../../shared/interfaces/category.interface';

@Component({
  selector: 'shop-produts-container',
  templateUrl: './shop-produts-container.component.html',
  styleUrl: './shop-produts-container.component.scss',
})
export class ShopProdutsContainerComponent implements OnInit {
  public backendUrl = environment.BACKEND_URL;

  products: Product[] = [];

  sortOptions: SelectItem[] = [];

  sortOrder: number = 0;

  sortField: string = '';

  inventoryStatus = InventoryStatus;

  displayLoginDialog: boolean = false;
  displayConfirmPopup: boolean = false;

  quantity: number = 1;
  selectedProductName: string = '';
  selectedProductStock: number = 0;
  loading: boolean = false;

  constructor(
    private productService: ProductService,
    private authenticationService: AuthenticationService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private loadingService: LoadingService
  ) {}

  private user_id = this.authenticationService.user()?.id as number;

  ngOnInit(): void {
    this.updateProducts();

    this.loadingService.loading$.subscribe((loading) => {
      this.loading = loading;
    });

    this.sortOptions = [
      { label: 'Ordenar precios descendientemente', value: '!price' },
      { label: 'Ordenar precios ascendentemente', value: 'price' },
      // Ordenar por productos favoritos
      { label: 'Mostrar productos favoritos', value: 'favorite' },
    ];
  }

  updateProducts() {
    this.productService.getProducts(this.user_id).subscribe((products) => {
      this.products = products;
    });
  }

  onSortChange(event: any) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      // Ordenar concurrencias descendientemente
      this.products.sort((data1, data2) => {
        return parseFloat(data2.price) - parseFloat(data1.price);
      });
    } else if (value === 'price') {
      // Ordenar concurrencias ascendentemente
      this.products.sort((data1, data2) => {
        return parseFloat(data1.price) - parseFloat(data2.price);
      });
    } else if (value === 'favorite') {
      // is_favorite: boolean
      this.products.sort((data1, data2) => {
        return data2.is_favorite ? 1 : -1;
      });
    }
  }

  onFilter(dv: DataView, event: Event) {
    dv.filter((event.target as HTMLInputElement).value);
  }

  getStatusClass(status: InventoryStatus): string {
    return this.productService.getStatusClass(status);
  }

  addToFavorites(product: Product) {
    this.loadingService.setLoading(true);

    if (this.authenticationService.user()) {
      this.productService.addFavoriteProduct(product).subscribe((response) => {
        if (!product.is_favorite) {
          this.messageService.add({
            severity: 'success',
            summary: `Producto ${product.name} eliminado de favoritos con éxito`,
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: `Producto ${product.name} marcado como favorito con éxito`,
          });
        }
        this.loadingService.setLoading(false);
        this.updateProducts();
      });
    } else {
      this.displayLoginDialog = true;
    }
  }

  addToCart(product: Product, quantity: number) {
    if (this.authenticationService.user()) {
      this.productService.addToCart(product, quantity).subscribe((cart) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Producto añadido al carrito con éxito',
          detail: `${quantity} ${product.name} añadidos al carrito`,
        });
        this.loadingService.setLoading(false);
        this.updateProducts();
      });
    } else {
      this.displayLoginDialog = true;
    }
  }

  openConfirmPopup(event: Event, product: Product) {
    if (this.authenticationService.authStatus() === AuthStatus.notAuthenticated) {
      this.displayLoginDialog = true;
      return;
    }
    this.selectedProductName = product.name;
    this.selectedProductStock = parseInt(product.stock as string);

    this.confirmationService.confirm({
      target: event.target as EventTarget,

      accept: () => {
        this.loadingService.setLoading(true);
        this.addToCart(product, this.quantity);
      },
      reject: () => {
        this.confirmationService.close();
      },
    });
  }
}
