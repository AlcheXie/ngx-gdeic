import { AbstractControl, ValidationErrors } from '@angular/forms';

export class GdeicValidators {
  static required(control: AbstractControl): ValidationErrors | null {
    const _value = control.value;
    return (_value === null || _value === undefined || _value === '' || _value.length === 0) ? { 'required': true } : null;
  }
}
