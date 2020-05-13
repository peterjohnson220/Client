import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';

import { RegistrationFormValidationService } from './registration-form-validation.service';

let service: RegistrationFormValidationService;

describe('RegistrationFormValidationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ RegistrationFormValidationService ] });
    service = TestBed.inject(RegistrationFormValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('validateName', () => {
    it('should accept name with only characters', () => {
      expect(service.validateSpecialChars({ value: 'john' } as FormControl)).toBeNull();
    });

    it('should accept name with hyphens', () => {
      expect(service.validateSpecialChars({ value: 'Hector Sausage-Hausen' } as FormControl)).toBeNull();
    });

    it('should accept name with periods', () => {
      expect(service.validateSpecialChars({ value: 'Martin Luther King, Jr.' } as FormControl)).toBeNull();
    });

    it('should accept name with apostrophes', () => {
      expect(service.validateSpecialChars({ value: 'O\'Connor' } as FormControl)).toBeNull();
    });

    it('should accept name with spaces', () => {
      expect(service.validateSpecialChars({ value: 'james marshall' } as FormControl)).toBeNull();
    });

    it('should accept name with commas', () => {
      expect(service.validateSpecialChars({ value: 'Martin Luther King, Jr.' } as FormControl)).toBeNull();
    });

    it('should accept name that begins with a space', () => {
      expect(service.validateSpecialChars({ value: ' roger' } as FormControl)).toBeNull();
    });

    it('should reject name with numbers', () => {
      expect(service.validateSpecialChars({ value: 'john6' } as FormControl)).toMatchObject({ 'invalidCharacter': true });
    });

    it('should reject name with special characters', () => {
      expect(service.validateSpecialChars({ value: 'bob!' } as FormControl)).toMatchObject({ 'invalidCharacter': true });
      expect(service.validateSpecialChars({ value: 'bob?' } as FormControl)).toMatchObject({ 'invalidCharacter': true });
      expect(service.validateSpecialChars({ value: 'bob#' } as FormControl)).toMatchObject({ 'invalidCharacter': true });
      expect(service.validateSpecialChars({ value: 'bob)' } as FormControl)).toMatchObject({ 'invalidCharacter': true });
      expect(service.validateSpecialChars({ value: 'bob+' } as FormControl)).toMatchObject({ 'invalidCharacter': true });
      expect(service.validateSpecialChars({ value: 'bob`' } as FormControl)).toMatchObject({ 'invalidCharacter': true });
      expect(service.validateSpecialChars({ value: 'bob/' } as FormControl)).toMatchObject({ 'invalidCharacter': true });
      expect(service.validateSpecialChars({ value: 'bob_' } as FormControl)).toMatchObject({ 'invalidCharacter': true });
    });
  });

  describe('validateWebsite', () => {
    it('should accept a website without a protocol', () => {
      expect(service.validateCharsInWebsite({ value: 'www.google.com' } as FormControl)).toBeNull();
    });

    it('should accept a website with a protocol', () => {
      expect(service.validateCharsInWebsite({ value: 'https://www.google.com' } as FormControl)).toBeNull();
    });

    it('should accept a website that ends with a space', () => {
      expect(service.validateCharsInWebsite({ value: 'https://www.google.com ' } as FormControl)).toBeNull();
    });

    it('should reject a website with spaces in it', () => {
      expect(service.validateCharsInWebsite({ value: 'www.google. com' } as FormControl)).toMatchObject({ 'invalidCharacter': true });
    });
  });
});
