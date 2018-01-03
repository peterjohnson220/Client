import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ErrorIndicatorComponent } from './error-indicator.component';

describe('Error Indicator', () => {
  let fixture: ComponentFixture<ErrorIndicatorComponent>;
  let instance: ErrorIndicatorComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ErrorIndicatorComponent,
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(ErrorIndicatorComponent);
    instance = fixture.componentInstance;
  });

  it('should show the error message', () => {

    instance.message = 'Example error message';

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
