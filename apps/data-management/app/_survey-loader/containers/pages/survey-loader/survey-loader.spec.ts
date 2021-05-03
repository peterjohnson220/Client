import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs/index';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { generateMockUserContext } from 'libs/models';
import * as fromAppNotificationsActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import * as fromSurveyLoaderMainReducer from '../../../reducers';
import * as fromSurveyLoaderActions from '../../../actions/survey-loader.actions';
import { buildSurveyUploadNotification } from '../../../models';
import { SurveyLoaderComponent } from '../index';

describe('SurveyLoaderComponent', () => {
  let instance: SurveyLoaderComponent;
  let fixture: ComponentFixture<SurveyLoaderComponent>;
  let store: Store<fromSurveyLoaderMainReducer.State>;
  const mockUserContext = generateMockUserContext();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgbTooltipModule],
      declarations: [SurveyLoaderComponent],
      providers: [provideMockStore({})],
      schemas: [NO_ERRORS_SCHEMA]
    });


    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(SurveyLoaderComponent);
    instance = fixture.componentInstance;
    spyOn(store, 'dispatch');
    instance.userContextSubscription = of(mockUserContext).subscribe();
    instance.processingSuccessSubscription = of(true).subscribe();
    instance.processingErrorSubscription = of(false).subscribe();
    instance.savingConfigGroupSuccessSubscription = of(true).subscribe();
    instance.validationOnlySubscription = of(true).subscribe();
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should dispatch handle the process action', function () {
    instance.handleProcessClicked();
    const action =  new fromSurveyLoaderActions.SaveConfig();
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should call uploadExcelFile when success is true', function () {
    spyOn(instance, 'uploadExcelFile');
    instance.handleSavingConfigGroupSuccess(true);
    expect(instance.uploadExcelFile).toBeCalled();
  });

  it('should dispatch notification for validate only ', function () {
    instance.validationOnly = true;
    instance.notification = buildSurveyUploadNotification();
    instance.showSuccessNotification();
    const action =  new fromAppNotificationsActions.AddNotification(instance.notification.ValidationOnly);
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch notification for success ', function () {
    instance.validationOnly = false;
    instance.notification = buildSurveyUploadNotification();
    instance.showSuccessNotification();
    const action =  new fromAppNotificationsActions.AddNotification(instance.notification.Success);
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });

  it('should dispatch notification for error ', function () {
    instance.notification = buildSurveyUploadNotification();
    instance.showErrorNotification();
    const action =  new fromAppNotificationsActions.AddNotification(instance.notification.Error);
    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
