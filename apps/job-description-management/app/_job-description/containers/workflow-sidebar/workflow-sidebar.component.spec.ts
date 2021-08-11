import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { generateMockJobDescriptionWorkflowAttachment, KendoUploadStatus } from 'libs/models';

import * as fromRootState from 'libs/state/state';
import { WorkflowSidebarComponent } from './workflow-sidebar.component';
import * as fromWorkflowReducer from '../../reducers';


describe('WorkflowSidebarComponent', () => {
  let fixture: ComponentFixture<WorkflowSidebarComponent>;
  let instance: WorkflowSidebarComponent;

  // Configure Testing Module for before each test
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({
        ...fromRootState.reducers,
        workflowSidebar: combineReducers(fromWorkflowReducer.reducers)
      }), ReactiveFormsModule],
      declarations: [WorkflowSidebarComponent],
      // Shallow Testing
      schemas: [NO_ERRORS_SCHEMA]
    });

    // route = TestBed.inject(ActivatedRoute);
    // jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(WorkflowSidebarComponent);
    instance = fixture.componentInstance;
  }));

  it('should show workflow sidebar', () => {
     expect(fixture).toMatchSnapshot();
  });

  it('onAttachmentClicked function should set clickedAttachment property', () => {
    const mockAttachment = generateMockJobDescriptionWorkflowAttachment(KendoUploadStatus.ScanSucceeded);
    instance.onAttachmentClicked(mockAttachment);
    expect(instance.clickedAttachment).toEqual(mockAttachment);
  });
});
