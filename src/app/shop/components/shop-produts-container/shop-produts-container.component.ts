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

  constructor(
    private productService: ProductService,
    private authenticationService: AuthenticationService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  private user_id = this.authenticationService.user()?.id as number;

  ngOnInit(): void {
    this.productService.getProducts2(this.user_id).subscribe((products) => {
      this.products = products;
    });

    this.sortOptions = [
      { label: 'Ordenar precios descendientemente', value: '!price' },
      { label: 'Ordenar precios ascendentemente', value: 'price' },
    ];
  }

  onSortChange(event: any) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      // Ordenar concurrencias descendientemente
      this.products.sort((data1, data2) => {
        return parseFloat(data2.price) - parseFloat(data1.price);
      });
    } else {
      // Ordenar concurrencias ascendentemente
      this.products.sort((data1, data2) => {
        return parseFloat(data1.price) - parseFloat(data2.price);
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
    if (this.authenticationService.user()) {
      console.log('Añadir a favoritos');
    } else {
      this.displayLoginDialog = true;
    }
  }

  addToCart(product: Product, quantity: number) {
    if (this.authenticationService.user()) {
      console.log('Añadir al carrito');
    } else {
      this.displayLoginDialog = true;
    }
  }

  openConfirmPopup(event: Event, product: Product) {

    this.selectedProductName = product.name;

    this.confirmationService.confirm({
      target: event.target as EventTarget,

      accept: () => {
        console.log('Añadir', this.quantity, 'elementos al carrito');
      },
      reject: () => {
        console.log('Añadir al carrito cancelado :(')
      },
    });
  }
}
