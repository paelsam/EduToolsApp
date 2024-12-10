import { Component, OnDestroy, OnInit } from '@angular/core';
import { ValidatorsService } from '../../../shared/services/validators.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Observable, of, switchMap, tap } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {
  private recapchaToken: string = '';
  public loading: boolean = false;
  public visible: boolean = false;
  public otpValue!: number;

  constructor(
    private validatorsService: ValidatorsService,
    private formBuilder: FormBuilder,
    private recaptchaV3Service: ReCaptchaV3Service,
    private authenticationService: AuthenticationService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadingService.loading$.subscribe((state) => {
      this.loading = state;
    });
  }

  public loginForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  public onSubmit(): void {
    this.loadingService.setLoading(true);

    if (this.loginForm.invalid) {
      this.loadingService.setLoading(false);
      this.loginForm.markAllAsTouched();
      return;
    }

    this.executeRecaptcha('login')
      .pipe(
        switchMap((token) => {
          this.recapchaToken = token;
          return this.authenticationService.verifyRecaptchaToken(
            this.recapchaToken
          );
        }),
        switchMap((isHuman) => {
          if (!isHuman) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo verificar si eres humano.',
            });
            this.loadingService.setLoading(false);
            return of(null);
          }
          return this.authenticationService.loginUser(this.loginForm.value);
        }),
        switchMap((response) => {
          return this.authenticationService.send2FA();
        }),
        tap((response: unknown) => {
          this.visible = true;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito!',
            detail: (response as { message: string }).message,
          });
        })
      )
      .subscribe();
  }

  public onVerifyOtp(): void {
    if (!this.otpValue) {
      this.loadingService.setLoading(false);
      return;
    }

    this.authenticationService.verify2FA(String(this.otpValue))
      .subscribe((response) => {
        this.loadingService.setLoading(false);
        this.router.navigate(['/store']);
      });
  }

  public executeRecaptcha(action: string): Observable<string> {
    return this.recaptchaV3Service.execute(action);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.loginForm, field);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.loginForm, field);
  }
}
