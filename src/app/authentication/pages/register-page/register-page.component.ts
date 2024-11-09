import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateCitiesService } from '../../../shared/services/state-cities.service';
import { environment } from '../../../../environments/environment';
import { catchError, map, Observable, Subscription } from 'rxjs';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  private siteKey: string = environment.RECAPTCHA_SITE_KEY;
  private recaptchaToken: string = '';
  public recentError?: { error: string };

  public allExecutionsSubcription!: Subscription;
  public allExecutionErrorSubcription!: Subscription;

  public statesOptions: string[] = [];
  public citiesOptions: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private stateCitiesService: StateCitiesService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private validatorsService: ValidatorsService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.allExecutionsSubcription = this.recaptchaV3Service.onExecute.subscribe(
      (token) => {
        // console.log(token);
      }
    );

    this.allExecutionErrorSubcription =
      this.recaptchaV3Service.onExecuteError.subscribe((error) => {
        console.log(error);
      });

    // Getting the states
    this.stateCitiesService.getStates().subscribe((states) => {
      this.statesOptions = states;
    });

    // Gettin the cities by state
    this.registerForm.get('state')!.valueChanges.subscribe((state: string) => {
      this.stateCitiesService.getCitiesByState(state).subscribe((cities) => {
        this.citiesOptions = cities.sort();
        this.registerForm.get('city')!.enable();
      });
    });
  }

  public ngOnDestroy(): void {
    if (this.allExecutionsSubcription)
      this.allExecutionsSubcription.unsubscribe();
    if (this.allExecutionErrorSubcription)
      this.allExecutionErrorSubcription.unsubscribe();
  }

  // Create a form group with the form builder
  // ('first_name', 'last_name', 'username', 'email', 'password', 'is_staff', 'is_superuser', 'role', 'address', 'city', 'state')
  public registerForm: FormGroup = this.formBuilder.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    is_staff: [false],
    is_superuser: [false],
    role: ['Cliente'],
    address: ['', Validators.required],
    city: [
      { value: '', disabled: !this.citiesOptions.length },
      Validators.required,
    ],
    state: ['', Validators.required],
  });

  public onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      console.log(this.registerForm.value);
      return;
    }

    this.executeRecaptcha('register').subscribe((token) => {
      this.recaptchaToken = token;

      this.authenticationService
        .verifyRecaptchaToken(this.recaptchaToken)
        .subscribe({
          next: (isHuman: boolean) => {
            if (isHuman) {
              this.authenticationService
                .registerUser(this.registerForm.value)
                .subscribe({
                  next: (response: { message: string }) => {
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Registro',
                      detail: response.message,
                    });

                    
                  },
                  error: (error) => {
                    this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: 'Error al registrar el usuario',
                    });
                    console.error(error);
                  },
                });
            }
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al verificar el token de recaptcha',
            });
          },
        });
    });
  }

  public executeRecaptcha(action: string): Observable<string> {
    return this.recaptchaV3Service.execute(action);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.registerForm, field);
  }

  getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.registerForm, field);
  }
}
