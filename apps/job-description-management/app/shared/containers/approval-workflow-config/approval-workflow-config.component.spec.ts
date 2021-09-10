import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import * as fromRootState from 'libs/state/state';
import { AppNotification, NotificationLevel } from 'libs/features/infrastructure/app-notifications';
import {  KendoUploadStatus } from 'libs/models';
import * as fromJobDescriptionManagementReducer from '../../../_job-description/reducers';
import * as fromAppNotificationsActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';

import spyOn = jest.spyOn;
import { generateMockJobDescriptionWorkflowAttachment } from 'libs/models/jdm/job-description-workflow-attachment';
import { ApprovalWorkflowConfigComponent } from './approval-workflow-config.component';


@Pipe({name: 'TruncateAfter'})
class MockPipe implements PipeTransform {
  transform = (value: any) => value;
}

describe('ApprovalWorkflowConfigComponent', () => {
  let fixture: ComponentFixture<ApprovalWorkflowConfigComponent>;
  let instance: ApprovalWorkflowConfigComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({
        ...fromRootState.reducers,
        workflowSetupModal: combineReducers(fromJobDescriptionManagementReducer.reducers)
      }), ReactiveFormsModule, FormsModule, DragulaModule.forRoot(), NgbModule],
      providers: [{
        provide: Router,
        useValue: {navigate: jest.fn()},
      },
        {
          provide: NgbModal,
          useValue: {open: jest.fn(), dismissAll: jest.fn()},
        }],
      declarations: [ApprovalWorkflowConfigComponent, MockPipe],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);
    jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(ApprovalWorkflowConfigComponent);
    instance = fixture.componentInstance;
  }));

  it('should show workflow setup modal', () => {
    expect(fixture).toMatchSnapshot();
  });

  it.each([NotificationLevel.Error, NotificationLevel.Success])('should dispatch deleteNotificationAction on processing success and error notifications',
    (notificationStatus) => {
    const mockNotification: AppNotification<any> = {
      NotificationId: '12345',
      EnableHtml: true,
      From: '',
      Level: notificationStatus,
      Type: '',
      Payload: ''
    };

    instance.uploadedFiles = [generateMockJobDescriptionWorkflowAttachment(KendoUploadStatus.UploadSucceed)];
    instance.processNotifications([mockNotification]);
    const deleteNotificationAction =
      new fromAppNotificationsActions.DeleteNotification({notificationId: mockNotification.NotificationId});
    expect(store.dispatch).toHaveBeenCalledWith(deleteNotificationAction);
  });

  it('should dispatch SaveWorkflowAttachmentsState on processing success notification', () => {
    jest.spyOn(instance, 'saveWorkflowAttachmentState');

    const mockNotification: AppNotification<any> = {
      NotificationId: '12345',
      EnableHtml: true,
      From: '',
      Level: NotificationLevel.Success,
      Type: '',
      Payload: ''
    };

    const mockWorkflowAttachmentArray = [generateMockJobDescriptionWorkflowAttachment(KendoUploadStatus.UploadSucceed)];

    instance.uploadedFiles = mockWorkflowAttachmentArray;
    instance.processNotifications([mockNotification]);

    expect(instance.saveWorkflowAttachmentState).toHaveBeenCalled();
  });
});
