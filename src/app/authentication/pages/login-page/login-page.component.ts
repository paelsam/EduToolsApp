import { Component, OnDestroy, OnInit } from '@angular/core';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: [
    `
      :host ::ng-deep .pi-eye,
      :host ::ng-deep .pi-eye-slash {
        transform: scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
    `,
  ],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  public siteKey: string = environment.RECAPTCHA_SITE_KEY;
  public recentError?: { error: string };

  public allExecutionsSubcription!: Subscription;
  public allExecutionErrorSubcription!: Subscription;

  constructor(
    private validatorsService: ValidatorsService,
    private formBuilder: FormBuilder,
    private recaptchaV3Service: ReCaptchaV3Service,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.allExecutionsSubcription = this.recaptchaV3Service.onExecute.subscribe(
      (token) => {
        console.log(token);
      }
    );

    this.allExecutionErrorSubcription =
      this.recaptchaV3Service.onExecuteError.subscribe((error) => {
        console.log(error);
      });
  }

  public ngOnDestroy(): void {
    if (this.allExecutionsSubcription)
      this.allExecutionsSubcription.unsubscribe();
    if (this.allExecutionErrorSubcription)
      this.allExecutionErrorSubcription.unsubscribe();
  }

  public loginForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.recaptchaV3Service.execute('login').subscribe((token) => {
      this.authenticationService
        .verifyRecaptchaToken(token)
        .subscribe((isHuman) => {
          if (isHuman) {
            this.authenticationService
              .loginUser(this.loginForm.value)
              .subscribe({
                next: (response) => {
                  console.log(response);
                },
                error: (error) => {
                  console.error(error);
                  this.recentError = error.error;
                }
              });
          }
        });
    });
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.loginForm, field);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.loginForm, field);
  }
}
