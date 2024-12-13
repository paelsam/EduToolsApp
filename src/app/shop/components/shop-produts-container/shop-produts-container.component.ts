import {
  Component,
  effect,
  OnChanges,
  OnInit,
  signal,
  Signal,
  SimpleChanges,
} from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { ProductService } from '../../../shared/services/product.service';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { Product } from '../../../shared/interfaces/product.interface';
import { InventoryStatus } from '../../interfaces/inventory-status.enum';
import { LoadingService } from '../../../shared/services/loading.service';
import { AuthStatus } from '../../../authentication/interfaces/auth-status.enum';
import { DialogService } from '../../../shared/services/dialog.service';
import { Address } from '../../../shared/interfaces/address.interface';
import { StateCitiesService } from '../../../shared/services/state-cities.service';
import { AddressService } from '../../../shared/services/address.service';
import { PaymentMethod } from '../../../shared/interfaces/payment.interface';

@Component({
  selector: 'shop-produts-container',
  templateUrl: './shop-produts-container.component.html',
  styleUrl: './shop-produts-container.component.scss',
})
export class ShopProdutsContainerComponent implements OnInit {
  products: Product[] = [];
  favorites: Product[] = [];
  addresses: Address[] = [];
  paymentMethods: any[] = [];

  sortOptions: SelectItem[] = [];

  sortOrder: number = 0;

  sortField: string = '';

  inventoryStatus = InventoryStatus;

  displayLoginDialog: boolean = false;
  displayFavoritesDialog: boolean = false;
  displayOrdersDialog: boolean = false;
  displayConfirmPopup: boolean = false;

  displayAddressDialog: boolean = false;
  displayPaymentDialog: boolean = false;

  quantity: number = 1;
  selectedProductName: string = '';
  selectedProductStock: number = 0;
  loading: boolean = false;

  newAddress: Address = {} as Address;
  newPaymentMethod: PaymentMethod = {} as PaymentMethod;

  public statesOptions: string[] = [];
  public citiesOptions: string[] = [];

  constructor(
    private productService: ProductService,
    private authenticationService: AuthenticationService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private loadingService: LoadingService,
    private dialogService: DialogService,
    private stateCitiesService: StateCitiesService,
    private addressService: AddressService
  ) {}

  private user_id = this.authenticationService.user()?.id as number;

  ngOnInit(): void {
    this.updateProducts();

    this.updateAddresses();

    this.updatePaymentMethods();

    // Getting the states
    this.stateCitiesService.getStates().subscribe((states) => {
      this.statesOptions = states;
    });

    // Getting the cities
    this.stateCitiesService.getCities().subscribe((cities) => {
      this.citiesOptions = cities;
    });

    this.dialogService.directionDialog$.subscribe((open) => {
      this.displayAddressDialog = open;
    });

    this.dialogService.paymentMethodDialog$.subscribe((open) => {
      this.displayPaymentDialog = open;
    });

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

  updateAddresses() {
    this.addressService.getAddresses().subscribe((addresses) => {
      this.addresses = addresses;
    });
  }

  updateProducts() {
    this.productService.getProducts(this.user_id).subscribe((products) => {
      this.products = products;
    });
  }

  updatePaymentMethods() {
    this.productService.getPaymentMethods().subscribe((methods) => {
      this.paymentMethods = methods;
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
        if (!response || !response.id) {
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
        this.getFavorites();
        this.updateProducts();
      });
    } else {
      this.loadingService.setLoading(false);
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
    if (
      this.authenticationService.authStatus() === AuthStatus.notAuthenticated
    ) {
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

  openOrders() {
    // ! Crear otro dialogo para mostrar las ordenes
  }

  getFavorites() {
    this.productService.getProducts(this.user_id).subscribe((products) => {
      this.favorites = products.filter((product) => product.is_favorite);
    });
  }

  deleteAddress(address: any) {
    this.addressService.deleteAddress(address.id).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Dirección eliminada con éxito',
      });
    });
  }

  addAddress() {
    this.addressService.createAddress(this.newAddress).subscribe((address) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Dirección añadida con éxito',
      });
      this.setAddressDialog(false);
    });
  }

  addPaymentMethod() {
    this.productService
      .createPaymentMethod(this.newPaymentMethod)
      .subscribe((payment) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Método de pago añadido con éxito',
        });
        this.setPaymentDialog(false);
        this.updatePaymentMethods();
      });
  }

  deletePaymentMethod(payment: PaymentMethod) {
    this.productService.deletePaymentMethod(payment.id).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Método de pago eliminado con éxito',
      });
      this.updatePaymentMethods();
    });
  }

  setAddressDialog(open: boolean) {
    this.dialogService.setDirectionDialog(open);
  }

  setPaymentDialog(open: boolean) {
    this.dialogService.setPaymentMethodDialog(open);
  }

  openFavorites() {
    if (this.authenticationService.user()) {
      this.getFavorites();
      this.displayFavoritesDialog = true;
    } else {
      this.displayLoginDialog = true;
    }
  }
}
