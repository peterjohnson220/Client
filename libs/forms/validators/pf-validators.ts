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
}
