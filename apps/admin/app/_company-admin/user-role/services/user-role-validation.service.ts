import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable()
export class UserRoleValidationService {

  NAME_LENGTH = { min: 1, max: 255 };

  constructor() { }

  validateSpecialChars(control: FormControl) {
    // allow letters, numbers, commas, periods, apostrophes, and hyphens
    const nameRegex = /^[a-zA-Z0-9 ,.'-]+$/i;

    let name = control.value;
    if (name) { name = name.trim(); }

    return nameRegex.test(name) ? null : { 'invalidCharacter': true };
  }
}
