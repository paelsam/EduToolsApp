import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Product } from '../../../shared/interfaces/product.interface';
import { ProductService } from '../../../shared/services/product.service';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { AuthStatus } from '../../../authentication/interfaces/auth-status.enum';
import { InventoryStatus } from '../../interfaces/inventory-status.enum';
import { Cart, ProductElement } from '../../interfaces/cart.interface';
import { LoadingService } from '../../../shared/services/loading.service';
import { MessageService } from 'primeng/api';
import { DialogService } from '../../../shared/services/dialog.service';

@Component({
  selector: 'app-shop-cart',
  templateUrl: './shop-cart.component.html',
  styleUrl: './shop-cart.component.scss',
})
export class ShopCartComponent implements OnChanges {
  @Input() isVisible: boolean = false;
  @Input() isMobile: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  layout: 'list' | 'grid' = 'list';

  products!: ProductElement[];
  cart: Cart = {} as Cart;
  loading: boolean = false;

  selectedProductName: string = '';

  public isUserAuthenticated =
    this.authenticationService.authStatus() === AuthStatus.authenticated;

  constructor(
    private productService: ProductService,
    private authenticationService: AuthenticationService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {
    this.updateScreenSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.authenticationService.authStatus() === AuthStatus.authenticated) {
      this.updateCart();
    }
  }

  ngOnInit() {
    console.log('uSER ROLE', this.authenticationService.user()?.role);

    if (this.authenticationService.authStatus() === AuthStatus.authenticated) {
      this.updateCart();
    }

    this.loadingService.loading$.subscribe((loading) => {
      this.loading = loading;
    });
  }

  updateCart() {
    this.productService.getCart().subscribe((cart) => {
      this.cart = cart;
      this.products = cart.products.map((product) => {
        return { ...product, disabled: false };
      });
    });
  }

  getSeverity(product: Product) {
    switch (product.inventoryStatus) {
      case InventoryStatus.EN_STOCK:
        return 'success';

      case InventoryStatus.BAJO_STOCK:
        return 'warning';

      case InventoryStatus.FUERA_DE_STOCK:
        return 'danger';

      default:
        return undefined;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateScreenSize();
  }

  private updateScreenSize() {
    this.isMobile = window.innerWidth <= 768; // Define el breakpoint para móviles
  }

  // Manejar el evento de cerrar el carrito
  handleClose() {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
  }

  onDeleteProductCart(product: ProductElement) {
    product.disabled = true;
    this.selectedProductName = product.product_name;

    this.loadingService.setLoading(true);
    this.productService
      .deleteProductCart(product.id as number)
      .subscribe((response) => {
        this.messageService.add({
          severity: 'success',
          summary: `Producto ${product.product_name} eliminado con éxito!`,
        });
        this.updateCart();
      });
  }

  activateOrderDialog() {
    this.dialogService.setOrderDialog(true);
  }
}
