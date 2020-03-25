import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// @dynamic
export class GdeicValidators {
  static required(control: AbstractControl): ValidationErrors | null {
    const _value = control.value;
    return (_value === null || _value === undefined || _value === '' || _value.length === 0) ? { 'required': true } : null;
  }

  static max(max: Number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const _value = control.value;
      return _value > max ? { 'maxValue': max } : null;
    };
  }

  static min(min: Number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const _value = control.value;
      return _value < min ? { 'minValue': min } : null;
    };
  }
}
