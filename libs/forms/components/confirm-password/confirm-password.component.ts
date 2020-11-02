import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationRules } from './validation-rules.model';
import { PfPasswordValidators } from 'libs/forms/validators/pf-password-validators';


@Component({
  selector: 'pf-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.css']
})
export class ConfirmPasswordComponent implements OnInit {
  @Input() showErrorValidation = true;
  @Input() allowSpaces = false;
  @Input() minLength: number;
  @Input() numberOfRequiredUppercaseCharacters: number;
  @Input() numberOfRequiredLowercaseCharacters: number;
  @Input() numberOfRequiredNumericCharacters: number;
  @Input() numberOfRequiredSpecialCharacters: number;
  @Input() allowUsername: string;

  @Output() onIsValid = new EventEmitter<string>();
  @Output() onInvalidPassword = new EventEmitter<ValidationRules[]>();
  @Output() onInvalidConfirmation = new EventEmitter<boolean>();

  password: string;
  passwordConfirm: string;
  showConfirmationError = false;
  changePasswordForm: FormGroup;
  validationRules: ValidationRules[];

  static hasPositiveNumber(variable: number) {
    return variable !== undefined && variable > 0;
  }

  ngOnInit() {
    this.setupValidation();
  }

  setupValidation() {
    const rules = PfPasswordValidators.getPasswordValidationRules(
      this.minLength,
      this.allowSpaces,
      this.numberOfRequiredUppercaseCharacters,
      this.numberOfRequiredLowercaseCharacters,
      this.numberOfRequiredSpecialCharacters,
      this.numberOfRequiredNumericCharacters);

       // No username allowed
    if (this.allowUsername) {
      const username = this.allowUsername.split('@')[0].toLowerCase();
      rules.push({
        Name: 'Contains Username',
        Message: 'Cannot contain username',
        Rule: '',
        IsSatisfied: false,
        Validator: (vr: ValidationRules) => {
          return (control: FormControl) => {
            if (control.value) {
              const password = control.value;
              if (password.toLowerCase().includes(username)) {
                vr.IsSatisfied = false;
                return { passwordContainsUsername: true};
              }
            }
            vr.IsSatisfied = true;
            return null;
          };
        }
      });
    }

    // Dynamically create password validators
    this.validationRules = rules;
    const passwordValidators = [Validators.required, Validators.minLength(this.minLength)];
    for (const validationRule of rules) {
      passwordValidators.push(validationRule.Validator ? validationRule.Validator(validationRule)
        : Validators.pattern(new RegExp(validationRule.Rule)));
    }

    // Initialize FormGroup
    this.changePasswordForm = new FormGroup({
      'password' : new FormControl(this.password, passwordValidators),
      'passwordConfirm' : new FormControl(this.passwordConfirm , [Validators.required])
    });
  }

  validate() {
    this.passwordValidator();
    this.confirmPasswordValidator();
    this.emitProperEvent();
  }

  passwordValidator() {
    const currentPasswordControl = this.changePasswordForm.get('password');
    for (const validationRule of this.validationRules) {
      if (validationRule.Name === 'Contains Username') {
        continue; // ignore the Rule property as we are using a ValidatorFn on the object
      }
      validationRule.IsSatisfied = new RegExp(validationRule.Rule).test(currentPasswordControl.value);
    }
  }

  confirmPasswordValidator() {
    if (this.changePasswordForm.get('password').value !== this.changePasswordForm.get('passwordConfirm').value) {
      this.changePasswordForm.get('passwordConfirm').setErrors({ 'MatchPassword': false });
      this.showConfirmationError = this.changePasswordForm.get('passwordConfirm').dirty;
    } else {
      this.changePasswordForm.get('passwordConfirm').setErrors(null);
      this.showConfirmationError = false;
    }
  }

  emitProperEvent() {
    if (this.changePasswordForm.valid) {
      this.onIsValid.emit(this.changePasswordForm.get('password').value);
    } else if (this.changePasswordForm.get('password').errors) {
      this.onInvalidPassword.emit(this.validationRules);
    } else if (this.showConfirmationError) {
      this.onInvalidConfirmation.emit(true);
    }
  }
}
