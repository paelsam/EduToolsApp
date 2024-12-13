import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { environment } from '../../../environments/environment';
import { map, Observable, switchMap } from 'rxjs';
import { Category } from '../interfaces/category.interface';
import { InventoryStatus } from '../../shop/interfaces/inventory-status.enum';
import { Product } from '../interfaces/product.interface';
import { Cart } from '../../shop/interfaces/cart.interface';
import { User } from '../../authentication/interfaces/user.interface';
import { PaymentMethod } from '../interfaces/payment.interface';

@Injectable()
export class ProductService {
  private readonly baseUrl: string = environment.BACKEND_URL;
  public cart: Cart = {} as Cart;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  getProducts(id?: number): Observable<Product[]> {
    // Añadir Authorization en caso de que el usuario esté autenticado
    const headers: HttpHeaders = new HttpHeaders({
      'X-CSRFToken': this.authenticationService.CSRFToken(),
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http
      .get<Product[]>(
        `${this.baseUrl}/api/productmanager/products-with-favorites${
          id ? `?user_id=${id}` : '/'
        } `,
        {
          withCredentials: true,
          headers: this.authenticationService.user()
            ? headers
            : new HttpHeaders({
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
                product.categoryName = category.name;
                product.categoryID = category.id;
              });
            }
            product.inventoryStatus = this.determinateStockStatus(
              parseInt(product.stock as string)
            );
          });
          console.log(products);
          return products;
        })
      );
  }

  getProduct(id: number): Observable<Product> {
    const headers: HttpHeaders = new HttpHeaders({
      'X-CSRFToken': this.authenticationService.CSRFToken(),
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http
      .get<Product>(`${this.baseUrl}/api/productmanager/product/${id}/`, {
        withCredentials: true,
        headers: this.authenticationService.user()
          ? headers
          : new HttpHeaders({
              'X-CSRFToken': this.authenticationService.CSRFToken(),
            }),
      })
      .pipe((product) => {
        return product;
      });
  }

  deleteProductCart(id: number) {
    const formData = new FormData();
    formData.append('cart_product_id', id.toString());

    return this.http
      .delete<{ details: string }>(
        `${this.baseUrl}/api/cart/cart/remove_product/`,
        {
          withCredentials: true,
          headers: new HttpHeaders({
            'X-CSRFToken': this.authenticationService.CSRFToken(),
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }),
          body: formData,
        }
      )
      .pipe((result) => {
        return result;
      });
  }

  getCategoryName(id: number): Observable<Category> {
    // Añadir Authorization en caso de que el usuario esté autenticado
    const headers: HttpHeaders = new HttpHeaders({
      'X-CSRFToken': this.authenticationService.CSRFToken(),
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http
      .get<Category>(`${this.baseUrl}/api/productmanager/category/${id}`, {
        withCredentials: true,
        headers: this.authenticationService.user()
          ? headers
          : new HttpHeaders({
              'X-CSRFToken': this.authenticationService.CSRFToken(),
            }),
      })
      .pipe((category) => {
        return category;
      });
  }

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(`${this.baseUrl}/api/productmanager/category/`, {
        withCredentials: true,
        headers: new HttpHeaders({
          'X-CSRFToken': this.authenticationService.CSRFToken(),
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      })
      .pipe((categories) => {
        return categories;
      });
  }

  editCategory(category: Category) {
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('description', category.description);
    formData.append('id', category.id.toString());

    return this.http
      .patch<Category>(
        `${this.baseUrl}/api/productmanager/category/${category.id}/`,
        formData,
        {
          withCredentials: true,
          headers: new HttpHeaders({
            'X-CSRFToken': this.authenticationService.CSRFToken(),
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }),
        }
      )
      .pipe((result) => {
        return result;
      });
  }

  deleteCategory(id: number) {
    return this.http
      .delete<{ details: string }>(
        `${this.baseUrl}/api/productmanager/category/${id}/`,
        {
          withCredentials: true,
          headers: new HttpHeaders({
            'X-CSRFToken': this.authenticationService.CSRFToken(),
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }),
        }
      )
      .pipe((result) => {
        return result;
      });
  }

  createCategory(category: Category) {
    const formData = new FormData();
    formData.append('name', category.name);
    formData.append('description', category.description);

    return this.http
      .post<Category>(`${this.baseUrl}/api/productmanager/category/`, formData, {
        withCredentials: true,
        headers: new HttpHeaders({
          'X-CSRFToken': this.authenticationService.CSRFToken(),
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      })
      .pipe((result) => {
        return result;
      });
  }

  getCart(): Observable<Cart> {
    return this.http
      .get<Cart>(`${this.baseUrl}/api/cart/cart/`, {
        withCredentials: true,
        headers: new HttpHeaders({
          'X-CSRFToken': this.authenticationService.CSRFToken(),
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      })
      .pipe(
        map((cart) => {
          cart.products.map((product) => {
            product.inventoryStatus = this.determinateStockStatus(
              product.product_stock
            );
          });
          return cart;
        })
      );
  }

  addToCart(product: Product, quantity: number) {
    const formData = new FormData();
    formData.append('product_id', (product.id as number).toString());
    formData.append('quantity', quantity.toString());

    return this.http
      .post<Cart>(`${this.baseUrl}/api/cart/cart/add_product/`, formData, {
        withCredentials: true,
        headers: new HttpHeaders({
          'X-CSRFToken': this.authenticationService.CSRFToken(),
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      })
      .pipe((newCart) => {
        return newCart;
      });
  }

  addFavoriteProduct(product: Product) {
    const formData = new FormData();
    formData.append('product', (product.id as number)?.toString());
    formData.append(
      'user',
      ((this.authenticationService.user() as User)?.id as number).toString()
    );
    if (product.is_favorite) {
      return this.http
        .delete<any>(
          //? Ese 1 puede ser cualquier número, no afecta la petición
          `${this.baseUrl}/api/productmanager/favoriteproduct/1/?product_id=${product.id}&user_id=${(this.authenticationService.user() as User).id}`,
          {
            withCredentials: true,
            headers: new HttpHeaders({
              'X-CSRFToken': this.authenticationService.CSRFToken(),
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }),
          }
        )
        .pipe((response) => {
          return response;
        });
    } else {
      return this.http
        .post<any>(
          `${this.baseUrl}/api/productmanager/favoriteproduct/`,
          formData,
          {
            withCredentials: true,
            headers: new HttpHeaders({
              'X-CSRFToken': this.authenticationService.CSRFToken(),
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }),
          }
        )
        .pipe((response) => {
          return response;
        });
    }
  }

  deleteProduct(id: number) {
    return this.http
      .delete<{ details: string }>(
        `${this.baseUrl}/api/productmanager/product/${id}/`,
        {
          withCredentials: true,
          headers: new HttpHeaders({
            'X-CSRFToken': this.authenticationService.CSRFToken(),
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }),
        }
      )
      .pipe((result) => {
        return result;
      });
  }

  createProduct(product: Product) {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price.toString());
    formData.append('stock', (product.stock as string).toString());
    formData.append('description', (product.description as string));
    formData.append('category', (product.categoryID as number).toString());
    if (product.image){
      formData.append('image', product.image as Blob);
    }

    return this.http
      .post<Product>(`${this.baseUrl}/api/productmanager/product/`, formData, {
        withCredentials: true,
        headers: new HttpHeaders({
          'X-CSRFToken': this.authenticationService.CSRFToken(),
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      })
      .pipe((result) => {
        return result;
      });
  }

  editProduct(product: Product) {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('price', product.price.toString());
    formData.append('stock', (product.stock as string).toString());
    formData.append('description', (product.description as string));
    formData.append('category', (product.categoryID as number).toString());
    formData.append('id', (product.id as number).toString());
    // formData.append('image', product.image as string);

    return this.http
      .patch<Product>(
        `${this.baseUrl}/api/productmanager/product/${product.id}/`,
        formData,
        {
          withCredentials: true,
          headers: new HttpHeaders({
            'X-CSRFToken': this.authenticationService.CSRFToken(),
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }),
        }
      )
      .pipe((result) => {
        return result;
      });
  }

  // Payment methods

  getPaymentMethods() {
    return this.http
      .get<PaymentMethod[]>(`${this.baseUrl}/api/cart/payment-methods/`, {
        withCredentials: true,
        headers: new HttpHeaders({
          'X-CSRFToken': this.authenticationService.CSRFToken(),
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      })
      .pipe((methods) => {
        return methods;
      });
  }

  createPaymentMethod(method: PaymentMethod) {
    const formData = new FormData();
    formData.append('name', method.name);
    formData.append('description', method.description);

    return this.http
      .post(`${this.baseUrl}/api/cart/payment-methods/`, formData, {
        withCredentials: true,
        headers: new HttpHeaders({
          'X-CSRFToken': this.authenticationService.CSRFToken(),
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      })
      .pipe((result) => {
        return result;
      });
  }

  deletePaymentMethod(id: number) {
    return this.http
      .delete<{ details: string }>(
        `${this.baseUrl}/api/cart/payment-methods/${id}/`,
        {
          withCredentials: true,
          headers: new HttpHeaders({
            'X-CSRFToken': this.authenticationService.CSRFToken(),
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }),
        }
      )
      .pipe((result) => {
        return result;
      });
  }

  determinateStockStatus(stock: number): InventoryStatus {
    if (stock === 0) {
      return InventoryStatus.FUERA_DE_STOCK;
    }
    if (stock < 10) {
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
