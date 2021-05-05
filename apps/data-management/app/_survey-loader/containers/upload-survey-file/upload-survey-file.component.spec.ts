import { UploadSurveyFileComponent } from '../upload-survey-file';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs/index';
import { AsyncStateObj, generateDefaultAsyncStateObj, LoaderSettingKeyName } from 'libs/models';
import * as fromSurveyLoaderMainReducer from '../../reducers';

describe('UploadSurveyFileComponent', () => {
  let instance: UploadSurveyFileComponent;
  let fixture: ComponentFixture<UploadSurveyFileComponent>;
  let store: Store<fromSurveyLoaderMainReducer.State>;
  const mockWorksheetName = generateDefaultAsyncStateObj<string[]>([]);
  mockWorksheetName.obj = ['test', 'test2'];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgbTooltipModule],
      declarations: [UploadSurveyFileComponent],
      providers: [provideMockStore({})],
      schemas: [NO_ERRORS_SCHEMA]
    });


    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(UploadSurveyFileComponent);
    instance = fixture.componentInstance;
    spyOn(store, 'dispatch');
    instance.worksheetNamesSubscription = of(mockWorksheetName).subscribe();
    instance.surveyJobSheetNameSubscription = of('test').subscribe();
    instance.surveyDataSheetNameSubscription = of('test').subscribe();
    instance.surveyParticipationSheetNameSubscription = of('test').subscribe();
    instance.validationOnlySubscription = of(true).subscribe();
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should add new job additional tab', () => {
    instance.surveyJobSheetName = [{ Id: 1, Value: 'test' }, { Id: 2, Value: null }];
    instance.addAdditionalDropdown(LoaderSettingKeyName.SurveyJobsSheetName, instance.surveyJobSheetName);
    expect(instance.surveyJobSheetName.length).toBe(3);
  });

  it('should remove additional tab',  () => {
    instance.surveyJobSheetName = [{ Id: 1, Value: 'test' }, { Id: 2, Value: 'test2' }];
    instance.removeAdditionalDropdown(LoaderSettingKeyName.SurveyJobsSheetName, 2);
    expect(instance.surveyJobSheetName.length).toBe(1);
  });

  it('should have duplicate sheets',  () => {
    instance.surveyJobSheetName = [{ Id: 1, Value: 'test' }, { Id: 2, Value: null }];
    instance.surveyDataSheetName = [{ Id: 1, Value: 'test' }, { Id: 2, Value: null }];
    instance.surveyParticipationSheetName = [{ Id: 1, Value: 'test1' }, { Id: 2, Value: null }];
    instance.duplicateSurveySheetError();
    expect(instance.isDuplicateSheetName).toBe(true);
  });

  it('should process option be disabled', function () {
    instance.surveyJobSheetName = [{ Id: 1, Value: null }, { Id: 2, Value: null }];
    instance.surveyDataSheetName = [{ Id: 1, Value: null }, { Id: 2, Value: null }];
    instance.surveyParticipationSheetName = [{ Id: 1, Value: null}, { Id: 2, Value: null }];
    instance.selectedFile = null;
    expect(instance.processDisabled).toBe(true);
  });
});
