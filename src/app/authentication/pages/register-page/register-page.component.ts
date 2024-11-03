import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StateCitiesService } from '../../../shared/services/state-cities.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent implements OnInit {
  public statesOptions: string[] = [];
  public citiesOptions: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private stateCitiesService: StateCitiesService
  ) {}

  ngOnInit(): void {
    this.stateCitiesService.getStates().subscribe((states) => {
      this.statesOptions = states;
    });

    // Gettin the cities by state
    this.registerForm.get('state')!.valueChanges.subscribe((state: string) => {
      this.stateCitiesService.getCitiesByState(state).subscribe((cities) => {
        this.citiesOptions = cities.sort();
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
    city: ['', Validators.required],
    state: ['', Validators.required],
  });

  public onSubmit(): void {
    console.log(this.registerForm.value);
  }
}
