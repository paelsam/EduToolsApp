import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { environment } from '../../../environments/environment.development';
import { map, Observable, switchMap } from 'rxjs';
import { Category } from '../interfaces/category.interface';
import { InventoryStatus } from '../../shop/interfaces/inventory-status.enum';
import { Product } from '../interfaces/product.interface';

@Injectable()
export class ProductService {
  private readonly baseUrl: string = environment.BACKEND_URL;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  getProducts2(id?: number): Observable<Product[]> {
    // Añadir Authorization en caso de que el usuario esté autenticado
    const headers: HttpHeaders = new HttpHeaders({
      'X-CSRFToken': this.authenticationService.CSRFToken(),
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http
      .get<Product[]>(
        `${this.baseUrl}/api/productmanager/products-with-favorites${ id ? `?user_id=${id}` : '/' } `,
        {
          withCredentials: true,
          headers: this.authenticationService.user() ? headers : new HttpHeaders({
            'X-CSRFToken': this.authenticationService.CSRFToken(),
          }),
        }
      )
      .pipe(
        map((products) => {
          products.map((product) => {
            if (typeof product.category === 'number') {
              this.getCategoryName(product.category).subscribe((category) => {
                product.category = category;
              });
            }
            product.inventoryStatus = this.determinateStockStatus(parseInt(product.stock as string));
          });
          return products;
        })
      )
  }

  getCategoryName(id: number): Observable<Category> {

    // Añadir Authorization en caso de que el usuario esté autenticado
    const headers: HttpHeaders = new HttpHeaders({
      'X-CSRFToken': this.authenticationService.CSRFToken(),
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http
      .get<Category>(
        `${this.baseUrl}/api/productmanager/category/${id}`,
        {
          withCredentials: true,
          headers: this.authenticationService.user() ? headers : new HttpHeaders({
            'X-CSRFToken': this.authenticationService.CSRFToken(),
          }),
        }
      )
      .pipe((category) => {
        return category;
      });
  }

  determinateStockStatus(stock: number): InventoryStatus {
    if (stock === 0) {
      return InventoryStatus.FUERA_DE_STOCK;
    }
    if (stock < 5) {
      return InventoryStatus.BAJO_STOCK;
    }
    return InventoryStatus.EN_STOCK;
  }

  getStatusClass(status: InventoryStatus): string {
    switch (status) {
      case InventoryStatus.EN_STOCK:
        return 'status-instock';
      case InventoryStatus.BAJO_STOCK:
        return 'status-lowstock';
      case InventoryStatus.FUERA_DE_STOCK:
        return 'status-outofstock';
      default:
        return '';
    }
  }

}
