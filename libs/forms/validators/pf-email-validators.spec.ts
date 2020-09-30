import { PfEmailValidators } from './pf-email-validators';
import { FormControl } from '@angular/forms';

describe('PfEmailValidators', () => {
  let testControl: FormControl;
  beforeEach(() => {
    testControl = new FormControl();
  });

  describe('emailFormat', () => {
    it ('should correctly validate an email', () => {
      testControl.setValue('test@test.com');
      expect(PfEmailValidators.emailFormat(testControl)).toEqual(null);
    });

    it('should reject email without a strudel', () => {
      testControl.setValue('test');
      expect(PfEmailValidators.emailFormat(testControl)).toEqual({ 'emailFormat': { valid: false } });
    });

    it('should reject email without a period', () => {
      testControl.setValue('test@test');
      expect(PfEmailValidators.emailFormat(testControl)).toEqual({ 'emailFormat': { valid: false } });
    });

    it('should reject email with spaces', () => {
      testControl.setValue('test @test.com');
      expect(PfEmailValidators.emailFormat(testControl)).toEqual({ 'emailFormat': { valid: false } });
    });

    it('should reject empty space', () => {
      testControl.setValue(' ');
      expect(PfEmailValidators.emailFormat(testControl)).toEqual({ 'emailFormat': { valid: false } });
    });

    it('should accept email with hyphen', () => {
      testControl.setValue('test-test@test.com');
      expect(PfEmailValidators.emailFormat(testControl)).toEqual(null);
    });

    it('should accept email with apostrophe', () => {
      testControl.setValue('test\'test@test.com');
      expect(PfEmailValidators.emailFormat(testControl)).toEqual(null);
    });

    it('should accept null email', () => {
      testControl.setValue(null);
      expect(PfEmailValidators.emailFormat(testControl)).toEqual(null);
    });

  });

  describe('workEmail', () => {
    it('should reject email with invalid domain and return domain', () => {
      testControl.setValue('test@gmail.com');
      expect(PfEmailValidators.workEmail(testControl)).toEqual({ 'workEmail': { valid: false, domain: 'gmail.com' } });
    });

    it('should reject email with invalid domain case insensitive and return domain', () => {
      testControl.setValue('test@GMAIL.com');
      expect(PfEmailValidators.workEmail(testControl)).toEqual({ 'workEmail': { valid: false, domain: 'GMAIL.com' } });
    });

    it('should accept email with valid domain', () => {
      testControl.setValue('test@test.com');
      expect(PfEmailValidators.workEmail(testControl)).toEqual(null);
    });
  });
});
