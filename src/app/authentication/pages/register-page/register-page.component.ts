import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateCitiesService } from '../../../shared/services/state-cities.service';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  public siteKey: string = environment.RECAPTCHA_SITE_KEY;
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
    private authenticationService: AuthenticationService
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
    this.executeRecaptcha('register');
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      console.log(this.registerForm.value);
    }
  }

  public executeRecaptcha(action: string): void {
    this.recaptchaV3Service.execute(action).subscribe({
      next: (token) => {
        console.log(token);
        this.recentError = undefined;
      },
      error: (error) => {
        console.error(error);
        this.recentError = { error };
      },
    });
  }

  isValidField( field: string ): boolean | null {
    return this.validatorsService.isValidField(this.registerForm, field);
  }

  getFieldError( field: string ): string | null {
    return this.validatorsService.getFieldError(this.registerForm, field);
  }

}
