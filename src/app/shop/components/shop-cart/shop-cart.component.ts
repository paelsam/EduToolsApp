import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { Product } from '../../../shared/interfaces/product.interface';
import { ProductService } from '../../../shared/services/product.service';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { AuthStatus } from '../../../authentication/interfaces/auth-status.enum';
import { InventoryStatus } from '../../interfaces/inventory-status.enum';

@Component({
  selector: 'app-shop-cart',
  templateUrl: './shop-cart.component.html',
  styleUrl: './shop-cart.component.scss',
})
export class ShopCartComponent {
  @Input() isVisible: boolean = false;
  @Input() isMobile: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  layout: 'list' | 'grid' = 'list';

  products!: Product[];

  public isUserAuthenticated = this.authenticationService.authStatus() === AuthStatus.authenticated;

  constructor(
    private productService: ProductService,
    private authenticationService: AuthenticationService
  ) {
    this.updateScreenSize();
  }

  ngOnInit() {
    console.log('isUserAuthenticated', this.isUserAuthenticated);
    console.log('Carrito de compras');
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
}
