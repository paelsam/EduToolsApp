import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
  ) { }

  public user_id = this.authenticationService.user()?.id as number;

  getAddresses() {

  }
}
