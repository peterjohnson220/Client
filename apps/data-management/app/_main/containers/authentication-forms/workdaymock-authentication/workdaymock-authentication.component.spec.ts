import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { WorkdayMockAuthenticationComponent } from './workdaymock-authentication.component';

describe('Data Management - Main - Workday Mock Authentication Form', () => {
  let instance: WorkdayMockAuthenticationComponent;
  let fixture: ComponentFixture<WorkdayMockAuthenticationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        WorkdayMockAuthenticationComponent,
      ],
      providers: [
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(WorkdayMockAuthenticationComponent);
    instance = fixture.componentInstance;

    instance.initForm();
    fixture.detectChanges();
  });

  it('Should emit event when submit button is clicked', () => {
    spyOn(instance.submitClick, 'emit');

    instance.workdayMockForm.controls.domain.setValue('MockValue');
    instance.workdayMockForm.controls.username.setValue('Mock@Username');
    instance.workdayMockForm.controls.password.setValue('MockPassword');

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
