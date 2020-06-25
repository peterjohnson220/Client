import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Store, StoreModule, combineReducers } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';
import { SettingsService } from 'libs/state/app-context/services';


import * as fromDataViewMainReducer from '../../reducers';
import * as fromDataViewActions from '../../actions/data-view.actions';
import { DataViewPageComponent } from './data-view.page';
import { DeleteUserWorkbookModalComponent, ShareReportModalComponent } from '../../components';
import {
  DataViewAccessLevel,
  generateMockSharedDataViewUser,
  SharedDataViewUser,
  generateMockUserDataView
} from '../../models';
import * as fromSharedReducer from '../../../_shared/reducers';
import { DuplicateDataViewModalComponent } from '../duplicate-data-view-modal';
import { EditDataViewModalComponent } from '../edit-data-view-modal';

describe('Data Insights - Custom Report View Comopnent', () => {
  let instance: DataViewPageComponent;
  let fixture: ComponentFixture<DataViewPageComponent>;
  let store: Store<fromDataViewMainReducer.State>;
  let route: ActivatedRoute;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          dataView_main: combineReducers(fromDataViewMainReducer.reducers),
          feature_appnotifications: combineReducers(fromAppNotificationsMainReducer.reducers),
          dataInsightsShared_main: combineReducers(fromSharedReducer.reducers)
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
      declarations: [
        DataViewPageComponent, EditDataViewModalComponent, DuplicateDataViewModalComponent,
        DeleteUserWorkbookModalComponent, ShareReportModalComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(DataViewPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.inject(Store);
    route = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should open edit workbook modal when handling edit clicked', () => {
    instance.userDataView = generateMockUserDataView();
    spyOn(instance.editDataViewModal, 'open');

    instance.handleEditClicked();

    expect(instance.editDataViewModal.open).toHaveBeenCalled();
  });

  it('should open duplicate workbook modal when handling duplicate clicked', () => {
    instance.userDataView = generateMockUserDataView();
    spyOn(instance.duplicateDataViewModal, 'open');

    instance.handleDuplicateClicked();

    expect(instance.duplicateDataViewModal.open).toHaveBeenCalled();
  });

  it('should open delete workbook modal when handling delete clicked', () => {
    instance.dataViewAccessLevel = DataViewAccessLevel.Owner;
    spyOn(instance.deleteUserWorkbookModalComponent, 'open');

    instance.handleDeleteClicked();

    expect(instance.deleteUserWorkbookModalComponent.open).toHaveBeenCalled();
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
