import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';

import * as fromDataInsightsMainReducer from '../../../reducers';
import * as fromDataViewActions from '../../../actions/data-view.actions';
import { CustomReportViewPageComponent } from './custom-report-view.page';
import { SaveUserWorkbookModalComponent, DeleteUserWorkbookModalComponent } from '../../../components';
import { SaveUserWorkbookModalData, generateMockSaveUserWorkbookModalData } from '../../../models';

describe('Data Insights - Custom Report View Comopnent', () => {
  let instance: CustomReportViewPageComponent;
  let fixture: ComponentFixture<CustomReportViewPageComponent>;
  let store: Store<fromDataInsightsMainReducer.State>;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataInsights_main: combineReducers(fromDataInsightsMainReducer.reducers),
          feature_appnotifications: combineReducers(fromAppNotificationsMainReducer.reducers)
        }),
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params: of({ dataViewId : 1 }) }
        }
      ],
      declarations: [ CustomReportViewPageComponent, SaveUserWorkbookModalComponent, DeleteUserWorkbookModalComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(CustomReportViewPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);
    route = TestBed.get(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should open edit workbook modal when handling edit clicked', () => {
    spyOn(instance.editUserWorkbookModalComponent, 'open');

    instance.handleEditClicked();

    expect(instance.editUserWorkbookModalComponent.open).toHaveBeenCalled();
  });

  it('should open duplicate workbook modal when handling duplicate clicked', () => {
    spyOn(instance.duplicateUserWorkbookModalComponent, 'open');

    instance.handleDuplicateClicked();

    expect(instance.duplicateUserWorkbookModalComponent.open).toHaveBeenCalled();
  });

  it('should open delete workbook modal when handling delete clicked', () => {
    spyOn(instance.deleteUserWorkbookModalComponent, 'open');

    instance.handleDeleteClicked();

    expect(instance.deleteUserWorkbookModalComponent.open).toHaveBeenCalled();
  });

  it('should dispatch EditUserReport action with correct data when handling edit save clicked', () => {
    const workbookData: SaveUserWorkbookModalData = generateMockSaveUserWorkbookModalData();
    const expectedAction = new fromDataViewActions.EditUserReport(workbookData);
    spyOn(store, 'dispatch');

    instance.handleEditSaveClicked(workbookData);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch DuplicateUserReport action with correct data when handling duplicate save clicked', () => {
    const workbookData: SaveUserWorkbookModalData = generateMockSaveUserWorkbookModalData();
    const expectedAction = new fromDataViewActions.DuplicateUserReport(workbookData);
    spyOn(store, 'dispatch');

    instance.handleDuplicateSaveClicked(workbookData);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch DeleteUserReport action when handling delete save clicked', () => {
    const expectedAction = new fromDataViewActions.DeleteUserReport();
    spyOn(store, 'dispatch');

    instance.handleDeleteSaveClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch ExportUserReport action when handling export clicked', () => {
    const expectedAction = new fromDataViewActions.ExportUserReport();
    spyOn(store, 'dispatch');

    instance.handleExportClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });
});