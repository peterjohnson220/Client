import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { PfTestAuthenticationComponent } from './pf-test-authentication.component';

describe('Data Management - Main - Pf Test Authentication Form', () => {
  let instance: PfTestAuthenticationComponent;
  let fixture: ComponentFixture<PfTestAuthenticationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        PfTestAuthenticationComponent,
      ],
      providers: [
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(PfTestAuthenticationComponent);
    instance = fixture.componentInstance;

    instance.initForm();
    fixture.detectChanges();
  });

  it('Should emit event when submit button is clicked', () => {
    jest.spyOn(instance.submitClick, 'emit');

    instance.pfTestForm.controls.username.setValue('MockUsername@unit.test');
    instance.pfTestForm.controls.password.setValue('MockPassword');

    instance.onSubmit();

    fixture.detectChanges();

    expect(instance.submitClick.emit).toHaveBeenCalledTimes(1);
  });

  it('Should emit event when cancel button is clicked', () => {
    jest.spyOn(instance.cancelClick, 'emit');

    instance.pfTestForm.controls.username.setValue('MockUsername@unit.test');
    instance.pfTestForm.controls.password.setValue('MockPassword');

    instance.cancelAuthenticationClick();

    fixture.detectChanges();

    expect(instance.cancelClick.emit).toHaveBeenCalledTimes(1);
  });
});
