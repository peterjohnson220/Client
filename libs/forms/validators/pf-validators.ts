import { FormControl, ValidatorFn } from '@angular/forms';

interface ValidationResult {
  [key: string]: boolean;
}

export class PfValidators {
  static required(control: FormControl): ValidationResult {
    return !control.value || control.value.trim() === '' ? {'required': true} : null;
  }

  static notBlackListed(blackList: any[]): ValidatorFn {
    return function(c: FormControl) {
      const blackListed = blackList ? !!blackList.find(bl => bl === c.value) : false;
      return blackListed ? {'notBlackListed': {valid: false}} : null;
    };
  }

  static selectionRequired(control: FormControl): ValidationResult {
    const hasSelection = control.value && control.value.length > 0;
    return !hasSelection ? {'selectionRequired': true} : null;
  }

  static minLengthTrimWhitespace(length: number): ValidatorFn {
    return (control: FormControl) => {
      return !(control.value && control.value.trim().length >= length) ? {'lengthValid': true} : null;
    };
  }

  static maxLengthTrimWhitespace(length: number): ValidatorFn {
    return (control: FormControl) => {
      return (control.value && control.value.trim().length >= length) ? {'maxLengthTrimmed': true} : null;
    };
  }

  static isNotNumeric(control: FormControl): ValidationResult {
    if (isNaN(control.value)) {
        return {'isNotNumeric': true};
    }
    return null;
  }
}
