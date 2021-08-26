import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRootState from 'libs/state/state';
import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';
import { SettingsService } from 'libs/state/app-context/services';
import { DataViewAccessLevel, generateMockSharedDataViewUser, generateMockUserDataView, SharedDataViewUser } from 'libs/ui/formula-editor';
import { CsvFileDelimiter, DataViewScope, ExportFileExtension } from 'libs/models/payfactors-api';
import { AbstractFeatureFlagService } from 'libs/core/services/feature-flags';
import { PermissionService } from 'libs/core/services';

import * as fromDataViewMainReducer from '../../reducers';
import * as fromDataViewActions from '../../actions/data-view.actions';
import { DataViewPageComponent } from './data-view.page';
import { DeleteUserWorkbookModalComponent, ShareReportModalComponent } from '../../components';
import * as fromSharedReducer from '../../../_shared/reducers';
import { DuplicateDataViewModalComponent } from '../duplicate-data-view-modal';
import { EditDataViewModalComponent } from '../edit-data-view-modal';


describe('Data Insights - Custom Report View Comopnent', () => {
  let instance: DataViewPageComponent;
  let fixture: ComponentFixture<DataViewPageComponent>;
  let store: Store<fromDataViewMainReducer.State>;
  let route: ActivatedRoute;
  let abstractFeatureFlagService: AbstractFeatureFlagService;

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
        },
        {
          provide: AbstractFeatureFlagService,
          useValue: { enabled: jest.fn(), bindEnabled: jest.fn() }
        },
        {
          provide: PermissionService,
          useValue: { CheckPermission: jest.fn(() => true) }
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
    instance.userDataView = generateMockUserDataView();
    abstractFeatureFlagService = TestBed.inject(AbstractFeatureFlagService);

  });

  it('should open edit workbook modal when handling edit clicked', () => {
    instance.userDataView = generateMockUserDataView();
    jest.spyOn(instance.editDataViewModal, 'open');

    instance.handleEditClicked();

    expect(instance.editDataViewModal.open).toHaveBeenCalled();
  });

  it('should open duplicate workbook modal when handling duplicate clicked', () => {
    instance.userDataView = generateMockUserDataView();
    jest.spyOn(instance.duplicateDataViewModal, 'open');

    instance.handleDuplicateClicked();

    expect(instance.duplicateDataViewModal.open).toHaveBeenCalled();
  });

  it('should open delete workbook modal when handling delete clicked', () => {
    instance.dataViewAccessLevel = DataViewAccessLevel.Owner;
    jest.spyOn(instance.deleteUserWorkbookModalComponent, 'open');

    instance.handleDeleteClicked();

    expect(instance.deleteUserWorkbookModalComponent.open).toHaveBeenCalled();
  });

  it('should dispatch DeleteUserReport action when handling delete save clicked', () => {
    const expectedAction = new fromDataViewActions.DeleteUserReport();
    jest.spyOn(store, 'dispatch');

    instance.handleDeleteSaveClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch ExportUserReport action when handling export clicked and enableFileDownloadSecurityWarning is false', () => {
    const data = { fileExtension: ExportFileExtension.Csv, csvFileDelimiter: CsvFileDelimiter.Pipe };
    const expectedAction = new fromDataViewActions.ExportUserReport(data);
    jest.spyOn(store, 'dispatch');

    instance.handleExportClicked(data);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch SaveSharePermissions action when handling share save clicked', () => {
    const sharedDataUserList = [generateMockSharedDataViewUser()];
    const expectedAction = new fromDataViewActions.SaveSharePermissions(sharedDataUserList);
    jest.spyOn(store, 'dispatch');

    instance.handleShareSavedClicked(sharedDataUserList);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch RemoveSharePermission action when handling user removed event', () => {
    const sharedDataUser: SharedDataViewUser = generateMockSharedDataViewUser();
    const expectedAction = new fromDataViewActions.RemoveSharePermission(sharedDataUser);
    jest.spyOn(store, 'dispatch');

    instance.handleUserRemoved(sharedDataUser);

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch GetSharePermission action when handling share clicked and permissions not loaded', () => {
    jest.spyOn(instance.shareReportModalComponent, 'open');
    const expectedAction = new fromDataViewActions.GetSharePermissions();
    jest.spyOn(store, 'dispatch');
    instance.dataViewAccessLevel = DataViewAccessLevel.Owner;
    instance.sharedUserPermissionsLoaded = false;
    instance.shareableUsersLoaded = true;

    instance.handleShareClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch GetSharePermission action when handling share clicked and permissions loaded', () => {
    jest.spyOn(instance.shareReportModalComponent, 'open');
    const expectedAction = new fromDataViewActions.GetSharePermissions();
    jest.spyOn(store, 'dispatch');
    instance.dataViewAccessLevel = DataViewAccessLevel.Owner;
    instance.sharedUserPermissionsLoaded = true;
    instance.shareableUsersLoaded = true;

    instance.handleShareClicked();

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch GetSharePermission action when handling share clicked and shareable users not loaded', () => {
    jest.spyOn(instance.shareReportModalComponent, 'open');
    const expectedAction = new fromDataViewActions.GetSharePermissions();
    jest.spyOn(store, 'dispatch');
    instance.dataViewAccessLevel = DataViewAccessLevel.Owner;
    instance.sharedUserPermissionsLoaded = false;
    instance.shareableUsersLoaded = false;

    instance.handleShareClicked();

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch GetSharePermission action when handling share clicked but user not owner', () => {
    const expectedAction = new fromDataViewActions.GetSharePermissions();
    jest.spyOn(store, 'dispatch');
    instance.dataViewAccessLevel = DataViewAccessLevel.ReadOnly;

    instance.handleShareClicked();

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });

  it('should dispatch GetShareableUsers action when handling share clicked', () => {
    jest.spyOn(instance.shareReportModalComponent, 'open');
    const expectedAction = new fromDataViewActions.GetShareableUsers();
    jest.spyOn(store, 'dispatch');
    instance.dataViewAccessLevel = DataViewAccessLevel.Owner;

    instance.handleShareClicked();

    expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch GetShareableUsers action when handling share clicked but user not owner', () => {
    const expectedAction = new fromDataViewActions.GetShareableUsers();
    jest.spyOn(store, 'dispatch');
    instance.dataViewAccessLevel = DataViewAccessLevel.ReadOnly;

    instance.handleShareClicked();

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch GetShareableUsers action when handling share clicked but users already loaded', () => {
    jest.spyOn(instance.shareReportModalComponent, 'open');
    const expectedAction = new fromDataViewActions.GetShareableUsers();
    jest.spyOn(store, 'dispatch');
    instance.shareableUsersLoaded = true;
    instance.dataViewAccessLevel = DataViewAccessLevel.Owner;

    instance.handleShareClicked();

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });

  it('should NOT dispatch GetShareableUsers action when handling share clicked but not a personal report', () => {
    const expectedAction = new fromDataViewActions.GetShareableUsers();
    spyOn(store, 'dispatch');
    instance.dataViewAccessLevel = DataViewAccessLevel.Owner;
    instance.userDataView.Scope = DataViewScope.Standard;

    instance.handleShareClicked();

    expect(store.dispatch).not.toHaveBeenCalledWith(expectedAction);
  });
});
