import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { combineReducers, Store, StoreModule } from '@ngrx/store';

import { PermissionService } from 'libs/core';
import { SettingsService } from 'libs/state/app-context/services';
import * as fromRootState from 'libs/state/state';
import * as fromOrgDataNavigationLinkActions from 'libs/features/navigation-links/actions/org-data-navigation-link.actions';
import * as fromAppNotificationsMainReducer from 'libs/features/app-notifications/reducers';
import * as fromAppNotificationsActions from 'libs/features/app-notifications/actions/app-notifications.actions';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/app-notifications/models';


import { LoadAndExportFilesCardComponent } from './load-and-export-files-card.component';

describe('Data Management - Main - Load And Export File Card', () => {
  let instance: LoadAndExportFilesCardComponent;
  let fixture: ComponentFixture<LoadAndExportFilesCardComponent>;
  let store: Store<fromAppNotificationsMainReducer.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRootState.reducers,
          feature_appnotifications: combineReducers(fromAppNotificationsMainReducer.reducers),
        })
      ],
      providers: [
        {
          provide: SettingsService,
          useValue: { selectCompanySetting: () => of(true)}
        },
        {
          provide: PermissionService,
          useValue: { CheckPermission: () => of(true)}
        }
      ],
      declarations: [ LoadAndExportFilesCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });

    fixture = TestBed.createComponent(LoadAndExportFilesCardComponent);
    instance = fixture.componentInstance;

    store = TestBed.inject(Store);
  });

  it('should create', () => {
    expect(fixture).toBeTruthy();
  });

  it('no access should not show anything', () => {
    instance.canImportOrgData = false;
    instance.canExportOrgData = false;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('has access should show import button', () => {
    instance.canImportOrgData = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('has access should show export button', () => {
    instance.canImportOrgData = false;
    instance.canExportOrgData = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch an action when export org data load button is clicked', () => {
    const mockNotification = {
      NotificationId: '',
      Level: NotificationLevel.Info,
      From: NotificationSource.GenericNotificationMessage,
      Payload: {
        Title: 'Please wait while your file is built'
      },
      EnableHtml: true,
      Type: NotificationType.Event
    };
    const expectedOrgDataNavigationAction = new fromOrgDataNavigationLinkActions.InitiateOrgDataExport();
    const expectedAppNotificationAction = new fromAppNotificationsActions.AddNotification(mockNotification);

    spyOn(store, 'dispatch');

    instance.handleOrgDataExportClick({preventDefault: jest.fn()});

    expect(store.dispatch).toHaveBeenCalledWith(expectedOrgDataNavigationAction);
    expect(store.dispatch).toHaveBeenCalledWith(expectedAppNotificationAction);
  });
});
