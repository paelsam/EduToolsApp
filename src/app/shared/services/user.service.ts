import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { environment } from '../../../environments/environment';
import { PaymentMethod } from '../interfaces/payment.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = environment.BACKEND_URL;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  public getUsers() {
    return this.http.get(`${this.baseUrl}/api/user/users/`,
      {
        withCredentials: true,
        headers: {
          'X-CSRFToken': this.authenticationService.CSRFToken(),
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .pipe((users: any) => {
        return users;
      });
  }

  public getPayments() {
    return this.http.get(`${this.baseUrl}/api/cart/payment-methods/`,
      {
        withCredentials: true,
        headers: {
          'X-CSRFToken': this.authenticationService.CSRFToken(),
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .pipe((payments: any) => {
        return payments;
      });
  }

  public createPaymentMethod(payment: PaymentMethod) {
    const formData = new FormData();
    formData.append('name', payment.name);
    formData.append('description', payment.description);

    return this.http.post(`${this.baseUrl}/api/cart/payment-methods/`, formData,
      {
        withCredentials: true,
        headers: {
          'X-CSRFToken': this.authenticationService.CSRFToken(),
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .pipe((response: any) => {
        return response;
      });
  }

  public deletePaymentMethod(payment: PaymentMethod) {
    return this.http.delete(`${this.baseUrl}/api/cart/payment-methods/${payment.id}/`,
      {
        withCredentials: true,
        headers: {
          'X-CSRFToken': this.authenticationService.CSRFToken(),
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .pipe((response: any) => {
        return response;
      });
  }
}
