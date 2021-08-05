import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as fromRootState from 'libs/state/state';
import {  KendoUploadStatus } from 'libs/models';
import * as fromWorkflowConfigActions from 'libs/features/jobs/job-description-management/actions/workflow-config.actions';
import { WorkflowSetupModalComponent } from './workflow-setup-modal.component';
import * as fromJobDescriptionManagementReducer from '../../reducers';
import { generateMockJobDescriptionWorkflowAttachment } from 'libs/models/jdm/job-description-workflow-attachment';

describe('WorkflowSetupModalComponent', () => {
  let fixture: ComponentFixture<WorkflowSetupModalComponent>;
  let instance: WorkflowSetupModalComponent;
  let store: Store<fromRootState.State>;

  // Configure Testing Module for before each test
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({
        ...fromRootState.reducers,
        workflowSetupModal: combineReducers(fromJobDescriptionManagementReducer.reducers)
      }), ReactiveFormsModule, FormsModule],
      providers: [{
        provide: Router,
        useValue: {navigate: jest.fn()},
      },
        {
          provide: NgbModal,
          useValue: {open: jest.fn(), dismissAll: jest.fn()},
        }],
      declarations: [WorkflowSetupModalComponent],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    });

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(WorkflowSetupModalComponent);
    instance = fixture.componentInstance;
  }));

  it('should show workflow setup modal', () => {
     expect(fixture).toMatchSnapshot();
  });

  it.each([[KendoUploadStatus.NotStarted, true], [KendoUploadStatus.ScanSucceeded, false]])
  ('should set correct value for shouldDisableRouteButton property', (uploadStatus, expectedOutput) => {
    const mockWorkflowAttachments = [generateMockJobDescriptionWorkflowAttachment(uploadStatus)];
    instance.workflowAttachments = mockWorkflowAttachments;
    expect(instance.shouldDisableRouteButton).toBe(expectedOutput);
  });

  it('should dispatch DeleteWorkflowAttachmentFiles on close', () => {
    const mockWorkflowAttachments = [generateMockJobDescriptionWorkflowAttachment(KendoUploadStatus.ScanSucceeded)];
    instance.workflowAttachments = mockWorkflowAttachments;
    instance.close();
    const deleteWorkflowAttachmentFilesAction = new fromWorkflowConfigActions.DeleteWorkflowAttachmentFiles(mockWorkflowAttachments.map(p => p.CloudFileName));
    expect(store.dispatch).toHaveBeenCalledWith(deleteWorkflowAttachmentFilesAction);
  });
});
