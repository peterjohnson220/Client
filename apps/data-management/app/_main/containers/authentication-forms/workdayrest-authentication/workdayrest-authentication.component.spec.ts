import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { WorkdayRestAuthenticationComponent } from './workdayrest-authentication.component';

describe('Data Management - Main - Workday Mock Authentication Form', () => {
  let instance: WorkdayRestAuthenticationComponent;
  let fixture: ComponentFixture<WorkdayRestAuthenticationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [
        WorkdayRestAuthenticationComponent,
      ],
      providers: [
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(WorkdayRestAuthenticationComponent);
    instance = fixture.componentInstance;

    instance.initForm();
    fixture.detectChanges();
  });

  it('Should emit event when submit button is clicked', () => {
    spyOn(instance.submitClick, 'emit');

    instance.workdayRestForm.controls.employeeReportUrl.setValue(
      'https://wd5-impl-services1.workday.com/ccx/service/customreport2/mock_preview/ISU_INT103/INT103_-_Payfactor_API');
    instance.workdayRestForm.controls.username.setValue('Mock');
    instance.workdayRestForm.controls.password.setValue('MockPassword');

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
