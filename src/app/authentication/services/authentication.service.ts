import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CSRFResponse } from '../interfaces/csrf-response.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { getCookie } from '../../../helpers/cookiesFunctions';

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
}
