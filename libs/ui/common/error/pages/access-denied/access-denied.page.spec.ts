import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { AccessDeniedPageComponent } from './access-denied.page';

describe('Access Denied Page', () => {
  let fixture: ComponentFixture<AccessDeniedPageComponent>;
  let instance: AccessDeniedPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccessDeniedPageComponent,
      ],
      // Shallow Testing
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(AccessDeniedPageComponent);
    instance = fixture.componentInstance;
  });

  it('should show the error message', () => {

    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

});
