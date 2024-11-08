import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ValidatorsService {
  public isValidField(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }

  public getFieldError(form: FormGroup, field: string): string | null {
    const errors = form.controls[field].errors || {};

    for (const keys of Object.keys(errors)) {
      //? Añadir más casos de ser necesario
      switch (keys) {
        case 'required':
          return 'Este campo es requerido';
        case 'maxlength':
          return `La longitud máxima es ${errors['maxlength'].requiredLength}`;
        case 'minlength':
          return `La longitud mínima es ${errors['minlength'].requiredLength}`;
        case 'email':
          return 'El email no es válido';
        default:
          return 'Error desconocido';
      }
    }

    return null;
  }
}
