import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';

import { UdfPickerComponent } from './udf-picker.component';

describe('UdfPickerComponent', () => {
  let fixture: ComponentFixture<UdfPickerComponent>;
  let instance: UdfPickerComponent;
  let formBuilder: FormBuilder;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DropDownsModule, NumericTextBoxModule],
      declarations: [UdfPickerComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    formBuilder = new FormBuilder();
    fixture = TestBed.createComponent(UdfPickerComponent);
    instance = fixture.componentInstance;

    // setup inputs
    instance.savedUdfSettings = null;
    instance.payElements = [
      {PayElement_ID: 1, Name: 'Allow', IsPercent: 0},
      {PayElement_ID: 2, Name: 'Base', IsPercent: 0},
    ];
    instance.selectedCompany = {
      CompanyId: 1,
      Name: 'Company Name',
      CombinedDetail: 'Company Name (1)'
    };
    instance.isLoading = false;
    instance.isLoadingError = false;
    instance.maxUdfs = 5;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should create a placeholder udf if non exist', () => {
    instance.savedUdfSettings = [];
    instance.ngOnChanges({
      savedUdfSettings: { previousValue: null, firstChange: false, currentValue: [], isFirstChange(): boolean {return false; }}
    });
    fixture.detectChanges();
    expect(instance.udfs.length).toBe(1);
  });

  it('should properly display udfs if provided as an input', () => {
    const udfSetting1 = {
      CompanyId : 1,
      PayElementId: 1,
      PayElementName: 'Allow',
      SurveyUdf: 'UDF_1',
      SurveyUdfSettingsId: 1,
      Value: 1.1
    };
    instance.savedUdfSettings = [udfSetting1];
    instance.ngOnChanges({
      savedUdfSettings: {
        previousValue: null,
        firstChange: false,
        currentValue: [udfSetting1],
        isFirstChange(): boolean {return false; }
      }
    });
    fixture.detectChanges();
    expect(instance.udfs.length).toBe(1);
  });

  it('should properly display udfs added via UI', () => {
    const udfSetting1 = {
      CompanyId : 1,
      PayElementId: 1,
      PayElementName: 'Allow',
      SurveyUdf: 'UDF_1',
      SurveyUdfSettingsId: 1,
      Value: 1.1
    };
    instance.savedUdfSettings = [udfSetting1];
    instance.ngOnChanges({
      savedUdfSettings: {
        previousValue: null,
        firstChange: false,
        currentValue: [udfSetting1],
        isFirstChange(): boolean {return false; }
      }
    });
    instance.addUdf();
    fixture.detectChanges();
    expect(instance.udfs.length).toBe(2);
  });

  it('should not allow you to add more UDFs than the max', () => {
    instance.maxUdfs = 2;
    const udfSettings = [{
      CompanyId : 1,
      PayElementId: 1,
      PayElementName: 'Allow',
      SurveyUdf: 'UDF_1',
      SurveyUdfSettingsId: 1,
      Value: 1.1
    }, {
      CompanyId : 1,
      PayElementId: 1,
      PayElementName: 'Allow',
      SurveyUdf: 'UDF_2',
      SurveyUdfSettingsId: 2,
      Value: 22.22
    }];
    instance.savedUdfSettings = udfSettings;
    instance.ngOnChanges({
      savedUdfSettings: {
        previousValue: null,
        firstChange: false,
        currentValue: udfSettings,
        isFirstChange(): boolean {return false; }
      }
    });
    instance.addUdf();
    instance.addUdf();
    instance.addUdf();
    expect(instance.udfs.length).toBe(2);
  });

});
