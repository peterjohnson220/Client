import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable()
export class SelfRegistrationValidationService {

  NAME_LENGTH = { min: 2, max: 50 };
  TITLE_LENGTH = { min: 5, max: 255 };
  COMPANY_LENGTH = { min: 2, max: 255 };
  WEBSITE_LENGTH = { min: 5, max: 255 };

  constructor() { }

  validateSpecialChars(control: FormControl) {
    // allow letters, commas, periods, apostrohpes, and hyphens
    const nameRegex =  /^[a-z ,.'-]+$/i;

    let name = control.value;
    if (name) { name = name.trim(); }

    return nameRegex.test(name) ? null : { 'invalidCharacter': true };
  }

  validateCharsInWebsite(control: FormControl) {
    // allow with/without protocol, require the period, and 2+ chars after the dot
    const websiteRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g;

    let website = control.value;
    if (website) { website = website.trim(); }

    return websiteRegex.test(website) ? null : { 'invalidCharacter': true };
  }

  validateNumberEmployees(control: FormControl) {
    return (control.value > 0) ? null : { 'invalidValue': true };
  }
}
