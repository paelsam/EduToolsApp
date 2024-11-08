import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CSRFResponse } from '../interfaces/csrf-response.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { getCookie } from '../../../helpers/cookiesFunctions';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly baseUrl: string = environment.BACKENG_URL;
  private CSRFToken: string = getCookie('csrftoken') || '';

  constructor(private http: HttpClient) {}

  public loadCSRFToken(): void {
    this.http
      .get<CSRFResponse>(`${this.baseUrl}/api/auth/csrf/`, {
        withCredentials: true,
      })
      .subscribe((response) => {
        this.CSRFToken = response.csrfToken;
      });
  }

  public verifyRecaptchaToken(token: string): Observable<boolean> {
    const formData = new FormData();
    formData.append('recaptcha_token', token);

    return this.http
      .post(`${this.baseUrl}/api/auth/recaptcha-verify/`, formData, {
        withCredentials: true,
        headers: new HttpHeaders({ 'X-CSRFToken': this.CSRFToken }),
      })
      .pipe(
        map((v) => {
          return true
        }),
        catchError((error) => {
          console.error(error);
          return of(false);
        })
      );
  }

  public registerUser(data: User): Observable<{ message: string }> {

    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('address', data.address);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('is_staff', data.is_staff.toString());
    formData.append('is_superuser', data.is_superuser.toString());
    formData.append('role', data.role);

    return this.http
      .post<{ message: string }>(`${this.baseUrl}/api/auth/register/`, formData, {
        withCredentials: true,
        headers: new HttpHeaders({ 'X-CSRFToken': this.CSRFToken }),
      })
      .pipe(
        map((response) => {
          console.log(response);
          return response;
        }),
        catchError((error) => {
          console.error(error);
          return of({ message: 'Error al registrar el usuario' });
        })
      );

  }
}
