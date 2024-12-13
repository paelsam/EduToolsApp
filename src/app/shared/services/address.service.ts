import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Address } from '../interfaces/address.interface';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  public user_id = this.authenticationService.user()?.id as number;
  public baseUrl = environment.BACKEND_URL;

  getAddresses() {
    return this.http.get<Address[]>(`${this.baseUrl}/api/user/addresses/`, {
      // Añadir csrf token y authorization en los httpheeaders
      headers: new HttpHeaders({
        'X-CSRFToken': this.authenticationService.CSRFToken(),
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  createAddress(address: Address) {
    return this.http.post(`${this.baseUrl}/api/user/addresses/`, address, {
      headers: new HttpHeaders({
        'X-CSRFToken': this.authenticationService.CSRFToken(),
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }

  deleteAddress(id: number) {
    return this.http.delete(`${this.baseUrl}/api/user/addresses/${id}/`, {
      headers: new HttpHeaders({
        'X-CSRFToken': this.authenticationService.CSRFToken(),
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    });
  }
}
