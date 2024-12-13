import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CSRFResponse } from '../interfaces/csrf-response.interface';
import { map, Observable, of } from 'rxjs';
import { getCookie } from '../../../helpers/cookiesFunctions';
import { User } from '../interfaces/user.interface';
import { LoginRequest } from '../interfaces/login-request.interface';
import { LoginResponse } from '../interfaces/login-response.interface';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { determinateRole } from '../../../helpers/determinateRole';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly baseUrl: string = environment.BACKEND_URL;
  private _CSRFToken: string = getCookie('csrftoken') || localStorage.getItem('csrftoken')  || '';

  private _user = signal<User | null>(null);
  private _role = signal<string | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public user = computed(() => this._user());
  public role = computed(() => this._role());
  public authStatus = computed(() => this._authStatus());
  public CSRFToken = computed(() => this._CSRFToken);

  constructor(private http: HttpClient, private router: Router) {
    this.verifyJWTToken().subscribe();
  }

  public setAuthentication(response: User): void {
    this._user.set(response);
    this._role.set(response.role);
    this._authStatus.set(AuthStatus.authenticated);
  }

  public loadCSRFToken(): void {
    this.http
      .get<CSRFResponse>(`${this.baseUrl}/api/user/csrf/`, {
        withCredentials: true,
      })
      .subscribe((response) => {
        this._CSRFToken = response.csrfToken;
        localStorage.setItem('csrftoken', response.csrfToken);
      });
  }

  public verifyRecaptchaToken(token: string): Observable<boolean> {
    const formData = new FormData();
    formData.append('recaptcha_token', token);

    return this.http
      .post(`${this.baseUrl}/api/user/recaptcha-verify/`, formData, {
        withCredentials: true,
        headers: new HttpHeaders({ 'X-CSRFToken': this._CSRFToken }),
      })
      .pipe(
        map(() => {
          return true;
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
      .post<{ message: string }>(
        `${this.baseUrl}/api/user/register/`,
        formData,
        {
          withCredentials: true,
          headers: new HttpHeaders({ 'X-CSRFToken': this._CSRFToken }),
        }
      )
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public loginUser(
    data: LoginRequest
  ): Observable<boolean | { message: string }> {
    const formData = new FormData();

    if (data.username.includes('@')) {
      formData.append('email', data.username);
    } else {
      formData.append('username', data.username);
    }

    formData.append('password', data.password);

    return this.http
      .post<LoginResponse>(`${this.baseUrl}/api/user/login/`, formData, {
        withCredentials: true,
        headers: new HttpHeaders({ 'X-CSRFToken': this._CSRFToken }),
      })
      .pipe(
        map((response: LoginResponse) => {
          localStorage.setItem('token', response.token);
          if (!determinateRole(response.user)) {
            this.logout();
            return false;
          }
          this.setAuthentication({...response.user, role: determinateRole(response.user) as string});
          return true;
        })
      );
  }

  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('csrftoken');
    this._user.set(null);
    this._role.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }

  public verifyJWTToken(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http
      .get<User>(`${this.baseUrl}/api/user/verify-jwt/`, {
        withCredentials: true,
        headers: new HttpHeaders({
          'X-CSRFToken': this._CSRFToken,
          Authorization: `Bearer ${token}`,
        }),
      })
      .pipe(
        map((response) => {
          if (!determinateRole(response)) {
            this.logout();
            return false;
          }
          this.setAuthentication({...response, role: determinateRole(response) as string});
          return true;
        })
      );
  }

  public send2FA(): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.baseUrl}/api/user/2fa/`, {
        withCredentials: true,
        headers: new HttpHeaders({
          'X-CSRFToken': this._CSRFToken,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public verify2FA(code: string): Observable<boolean> {
    const formData = new FormData();
    formData.append('code', code);

    return this.http
      .post<boolean>(`${this.baseUrl}/api/user/2fa/`, formData, {
        withCredentials: true,
        headers: new HttpHeaders({
          'X-CSRFToken': this._CSRFToken,
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }),
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  public activateUser(userId: string, token: string): Observable<boolean> {
    const formData = new FormData();
    formData.append('uidb64', userId);
    formData.append('token', token);

    return this.http
      .post<boolean>(`${this.baseUrl}/api/user/activate/`, formData, {
        withCredentials: true,
        headers: new HttpHeaders({ 'X-CSRFToken': this._CSRFToken }),
      })
      .pipe(
        map((response) => {
          return true;
        })
      );
  }
}
