import { FormControl, ValidatorFn } from '@angular/forms';

import { StripHtmlPipe } from 'libs/core/pipes';

interface ValidationResult {
  [key: string]: boolean;
}

export class PfValidators {
  static required(control: FormControl): ValidationResult {
    return !control.value || control.value.trim() === '' ? { 'required': true } : null;
  }

  static richTextRequired(control: FormControl): ValidationResult {
    const stripHtml = new StripHtmlPipe();
    return !control.value
      || control.value.trim() === ''
      || stripHtml.transform(control.value).trim() === ''
      ? { 'required': true } : null;
  }

  static notBlackListed(blackList: any[]): ValidatorFn {
    return function (c: FormControl) {
      const blackListed = blackList ? !!blackList.find(bl => bl === c.value) : false;
      return blackListed ? { 'notBlackListed': { valid: false } } : null;
    };
  }

  static selectionRequired(control: FormControl): ValidationResult {
    const hasSelection = control.value && control.value.length > 0;
    return !hasSelection ? { 'selectionRequired': true } : null;
  }

  static minLengthTrimWhitespace(length: number): ValidatorFn {
    return (control: FormControl) => {
      // TODO: the errorname needs to be changed to minLengthTrimmed and all the references need to be updated
      return !(control.value && control.value.trim().length >= length) ? { 'lengthValid': true } : null;
    };
  }

  static minLengthNotRequired(length: number): ValidatorFn {
    return (control: FormControl) => {
      return control.value && control.value.trim().length !== 0 && control.value.trim().length <= length
        ? { 'minLengthNotRequired': true }
        : null;
    };
  }

  static maxLengthTrimWhitespace(length: number): ValidatorFn {
    return (control: FormControl) => {
      return (control.value && control.value.trim().length > length) ? { 'maxLengthTrimmed': true } : null;
    };
  }

  static isNotNumeric(control: FormControl): ValidationResult {
    if (isNaN(control.value)) {
      return { 'isNotNumeric': true };
    }
    return null;
  }
}
