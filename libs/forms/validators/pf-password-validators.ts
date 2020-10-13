
export class PfPasswordValidators {

  static hasPositiveNumber(variable: number) {
    return variable !== undefined && variable > 0;
  }

  static getPasswordValidationRules(
    minLength = 8,
    allowSpaces = false,
    numberOfRequiredUppercaseCharacters = 1,
    numberOfRequiredLowercaseCharacters = 1,
    numberOfRequiredSpecialCharacters = 1,
    numberOfRequiredNumericCharacters = 1): any[] {
    const rules = [];

    // Min total character required
    if (this.hasPositiveNumber(minLength)) {
      const minLengthRegex = '^.{' + minLength + ',}$';
      rules.push({
        Name: 'Minimum Length',
        Message: 'Must be ' + minLength + ' characters or more',
        Rule: minLengthRegex,
        IsSatisfied: false
      });
    }

    // Allow Spaces
    if (allowSpaces === false) {
      rules.push({
        Name: 'Spaces',
        Message: 'Must not contain spaces',
        Rule: '(^\\S*$)',
        IsSatisfied: false
      });
    }

    // Min uppercase characters required
    if (this.hasPositiveNumber(numberOfRequiredUppercaseCharacters )) {
      const uppercaseRegex = '(?=(.*[A-Z]){' + numberOfRequiredUppercaseCharacters + '})';
      rules.push({
        Name: 'Uppercase',
        Message: 'Must include ' + numberOfRequiredUppercaseCharacters + ' or more uppercase letters',
        Rule: uppercaseRegex,
        IsSatisfied: false
      });
    }

    // Min lowercase characters required
    if (this.hasPositiveNumber(numberOfRequiredLowercaseCharacters)) {
      const lowercaseRegex = '(?=(.*[a-z]){' + numberOfRequiredLowercaseCharacters + '})';
      rules.push({
        Name: 'Lowercase',
        Message: 'Must include ' + numberOfRequiredLowercaseCharacters + ' or more lowercase letters',
        Rule: lowercaseRegex,
        IsSatisfied: false
      });
    }

    // Min numerical characters required
    if (this.hasPositiveNumber(numberOfRequiredNumericCharacters)) {
      const numericRegex = '(?=(.*[0-9]){' + numberOfRequiredNumericCharacters + '})';
      rules.push({
        Name: 'Numbers',
        Message: 'Must include ' + numberOfRequiredNumericCharacters + ' or more numeric characters',
        Rule: numericRegex,
        IsSatisfied: false
      });
    }

    // Min special characters required
    if (this.hasPositiveNumber(numberOfRequiredSpecialCharacters)) {
      const specialCharacterRegex = '(?=(.*[!@#$%]){' + numberOfRequiredSpecialCharacters + '})';
      rules.push({
        Name: 'Special Character',
        Message: 'Must include ' + numberOfRequiredSpecialCharacters + ' or more special characters (!@#$%)',
        Rule: specialCharacterRegex,
        IsSatisfied: false
      });
    }

    return rules;
  }

}
