import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { WorkdayAuthenticationComponent } from './workday-authentication.component';

describe('Data Management - Main - Workday Authentication Form', () => {
  let instance: WorkdayAuthenticationComponent;
  let fixture: ComponentFixture<WorkdayAuthenticationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        WorkdayAuthenticationComponent,
      ],
      providers: [
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(WorkdayAuthenticationComponent);
    instance = fixture.componentInstance;

    instance.initForm();
    fixture.detectChanges();
  });

  it('Should emit event when submit button is clicked', () => {
    spyOn(instance.submitClick, 'emit');

    instance.workdayForm.controls.domain.setValue('MockValue');
    instance.workdayForm.controls.username.setValue('Mock@Username');
    instance.workdayForm.controls.password.setValue('MockPassword');

    instance.onSubmit();

    fixture.detectChanges();

    expect(instance.submitClick.emit).toHaveBeenCalledTimes(1);
  });

  it('Should emit event when cancel button is clicked', () => {
    spyOn(instance.cancelClick, 'emit');

    instance.cancelAuthenticationClick();

    fixture.detectChanges();

    expect(instance.cancelClick.emit).toHaveBeenCalledTimes(1);
  });
});
