import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ValidationResultsComponent } from './validation-results.component';
import { ValidationResultItemTypeEnum } from 'libs/models';

describe('header', () => {
  let fixture: ComponentFixture<ValidationResultsComponent>;
  let instance: ValidationResultsComponent;

  // Configure Testing Module for before each test
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ValidationResultsComponent
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ValidationResultsComponent);
    instance = fixture.componentInstance;
  });

  it('should default to not hiding validation messages when empty', () => {
    instance.validationResults = [];
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should not show table when hide if empty is set', () => {
    instance.hideIfEmpty = true;
    instance.validationResults = [];
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show an empty grid message', () => {
    instance.hideIfEmpty = false;
    instance.validationResults = [];
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should show validation results', () => {
    const successResult = { Type: ValidationResultItemTypeEnum.Success, Message: 'success message'};
    const infoResult = { Type: ValidationResultItemTypeEnum.Info, Message: 'info message'};
    const warningResult = { Type: ValidationResultItemTypeEnum.Warning, Message: 'warning message'};
    const errorResult = { Type: ValidationResultItemTypeEnum.Error, Message: 'error message'};
    instance.validationResults = [successResult, infoResult, warningResult, errorResult];
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

});

