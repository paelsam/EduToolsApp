import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateCitiesService } from '../../../shared/services/state-cities.service';
import { environment } from '../../../../environments/environment';
import {
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MessageService } from 'primeng/api';
import { LoadingService } from '../../../shared/services/loading.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent implements OnInit {
  private recaptchaToken: string = '';

  public statesOptions: string[] = [];
  public citiesOptions: string[] = [];

  public loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private stateCitiesService: StateCitiesService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private validatorsService: ValidatorsService,
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    // Loading service
    this.loadingService.loading$.subscribe((state) => {
      this.loading = state;
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
    this.loadingService.setLoading(true);

    if (this.registerForm.invalid) {
      this.loadingService.setLoading(false);
      this.registerForm.markAllAsTouched();
      return;
    }

    this.executeRecaptcha('register')
      .pipe(
        switchMap((token) => {
          this.recaptchaToken = token;
          return this.authenticationService.verifyRecaptchaToken(
            this.recaptchaToken
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
            return of(null); // Detener flujo si no es humano
          }
          return this.authenticationService.registerUser(
            this.registerForm.value
          );
        }),
        tap((response) => {
          if (response) {
            this.loadingService.setLoading(false);
            this.messageService.add({
              severity: 'success',
              summary: 'Registro exitoso. Ahora, revisa tu correo para poder activar tu cuenta.',
              detail: response.message,
            });
            this.registerForm.reset();
          }
        })
      )
      .subscribe();
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
