import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
  ) { }

  public user_id = this.authenticationService.user()?.id as number;
  private baseUrl = environment.BACKEND_URL;

  createOrder(payment_method: number, address_id: number) {
    const formData = new FormData();
    formData.append('payment_method', payment_method.toString());
    formData.append('address_id', address_id.toString());

    return this.http.post(`${this.baseUrl}/api/cart/cart/create_order/`, formData, {
      withCredentials: true,
      headers: new HttpHeaders({
        'X-CSRFToken': this.authenticationService.CSRFToken(),
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    })
    .pipe((response) => {
      return response
    });

  }


}
