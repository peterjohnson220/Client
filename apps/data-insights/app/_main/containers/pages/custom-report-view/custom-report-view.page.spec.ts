import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';
import { SettingsService } from 'libs/state/app-context/services';


import * as fromDataInsightsMainReducer from '../../../reducers';
import * as fromDataViewActions from '../../../actions/data-view.actions';
import { CustomReportViewPageComponent } from './custom-report-view.page';
import { DeleteUserWorkbookModalComponent, SaveUserWorkbookModalComponent, ShareReportModalComponent } from '../../../components';
import {
  DataViewAccessLevel,
  generateMockSaveUserWorkbookModalData,
  generateMockSharedDataViewUser,
  SaveUserWorkbookModalData,
  SharedDataViewUser
} from '../../../models';

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
        },
        {
          provide: SettingsService,
          useClass: SettingsService
        }
      ],
      declarations: [ CustomReportViewPageComponent, SaveUserWorkbookModalComponent, DeleteUserWorkbookModalComponent, ShareReportModalComponent ],
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
    instance.dataViewAccessLevel = DataViewAccessLevel.Owner;
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

  it('should dispatch SaveSharePermissions action when handling share save clicked', () => {
    const sharedDataUserList = [generateMockSharedDataViewUser()];
    const expectedAction = new fromDataViewActions.SaveSharePermissions(sharedDataUserList);
    spyOn(store, 'dispatch');

    instance.handleShareSavedClicked(sharedDataUserList);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch RemoveSharePermission action when handling user removed event', () => {
    const sharedDataUser: SharedDataViewUser = generateMockSharedDataViewUser();
    const expectedAction = new fromDataViewActions.RemoveSharePermission(sharedDataUser);
    spyOn(store, 'dispatch');

    instance.handleUserRemoved(sharedDataUser);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch GetSharePermission action when handling share clicked and permissions not loaded', () => {
    spyOn(instance.shareReportModalComponent, 'open');
    const expectedAction = new fromDataViewActions.GetSharePermissions();
    spyOn(store, 'dispatch');
    instance.dataViewAccessLevel = DataViewAccessLevel.Owner;
    instance.sharedUserPermissionsLoaded = false;
    instance.shareableUsersLoaded = true;

    instance.handleShareClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch GetSharePermission action when handling share clicked and permissions loaded', () => {
    spyOn(instance.shareReportModalComponent, 'open');
    const expectedAction = new fromDataViewActions.GetSharePermissions();
    spyOn(store, 'dispatch');
    instance.dataViewAccessLevel = DataViewAccessLevel.Owner;
    instance.sharedUserPermissionsLoaded = true;
    instance.shareableUsersLoaded = true;

    instance.handleShareClicked();

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch GetSharePermission action when handling share clicked and shareable users not loaded', () => {
    spyOn(instance.shareReportModalComponent, 'open');
    const expectedAction = new fromDataViewActions.GetSharePermissions();
    spyOn(store, 'dispatch');
    instance.dataViewAccessLevel = DataViewAccessLevel.Owner;
    instance.sharedUserPermissionsLoaded = false;
    instance.shareableUsersLoaded = false;

    instance.handleShareClicked();

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch GetSharePermission action when handling share clicked but user not owner', () => {
    const expectedAction = new fromDataViewActions.GetSharePermissions();
    spyOn(store, 'dispatch');
    instance.dataViewAccessLevel = DataViewAccessLevel.ReadOnly;

    instance.handleShareClicked();

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch GetShareableUsers action when handling share clicked', () => {
    spyOn(instance.shareReportModalComponent, 'open');
    const expectedAction = new fromDataViewActions.GetShareableUsers();
    spyOn(store, 'dispatch');
    instance.dataViewAccessLevel = DataViewAccessLevel.Owner;

    instance.handleShareClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch GetShareableUsers action when handling share clicked but user not owner', () => {
    const expectedAction = new fromDataViewActions.GetShareableUsers();
    spyOn(store, 'dispatch');
    instance.dataViewAccessLevel = DataViewAccessLevel.ReadOnly;

    instance.handleShareClicked();

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch GetShareableUsers action when handling share clicked but users already loaded', () => {
    spyOn(instance.shareReportModalComponent, 'open');
    const expectedAction = new fromDataViewActions.GetShareableUsers();
    spyOn(store, 'dispatch');
    instance.shareableUsersLoaded = true;
    instance.dataViewAccessLevel = DataViewAccessLevel.Owner;

    instance.handleShareClicked();

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });
});
