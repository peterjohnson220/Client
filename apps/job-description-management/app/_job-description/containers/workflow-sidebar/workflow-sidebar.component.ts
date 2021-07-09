import cloneDeep from 'lodash/cloneDeep';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';

import { JobDescription } from 'libs/models/jdm/index';
import { WorkflowStepInfo } from 'libs/models/security/index';
import { AsyncStateObj } from 'libs/models/state/index';
import { AttachmentFileType } from 'libs/models';

import { JobDescriptionManagementJobDescriptionState } from '../../reducers';
import * as fromWorkflowReducer from '../../reducers/index';
import * as fromWorkflowActions from '../../actions/workflow.actions';

import { WorkflowLogEntry } from '../../models';

@Component({
  selector: 'pf-workflow-sidebar',
  templateUrl: './workflow-sidebar.component.html',
  styleUrls: ['./workflow-sidebar.component.scss']
})
export class WorkflowSidebarComponent implements OnInit, OnDestroy {
  @Input() workflowStepInfo: WorkflowStepInfo;
  @Input() workflowStepCompleted: boolean;
  @Input() isInSystemWorkflow: boolean;

  readonly ATTACHMENT_DOWNLOAD_URL_PREFIX = '/odata/CloudFiles.DownloadJDMWorkflowAttachment?FileName=';

  workflowLogEntriesAsync$: Observable<AsyncStateObj<WorkflowLogEntry[]>>;
  workflowLogLoading$: Observable<boolean>;
  workflowStepApproving$: Observable<boolean>;
  workflowStepRejecting$: Observable<boolean>;
  jobDescriptionAsync$: Observable<AsyncStateObj<JobDescription>>;
  inSystemWorkflowComplete$: Observable<boolean>;
  workflowCompleteStepError$: Observable<boolean>;
  workflowStepCommentForm: FormGroup;
  commentFormSubmitted: boolean;
  jobDescriptionSubscription: Subscription;
  attachments: any;
  iconFile: any;
  iconClass: any;

  constructor(
    private store: Store<JobDescriptionManagementJobDescriptionState>,
    private formBuilder: FormBuilder
  ) {
    this.workflowLogEntriesAsync$ = this.store.select(fromWorkflowReducer.getWorkflowLogEntries);
    this.workflowLogLoading$ = this.store.select(fromWorkflowReducer.getWorkflowLogLoading);
    this.workflowStepApproving$ = this.store.select(fromWorkflowReducer.getWorkflowStepApproving);
    this.workflowCompleteStepError$ = this.store.select(fromWorkflowReducer.getCompletedStepError);
    this.workflowStepRejecting$ = this.store.select(fromWorkflowReducer.getWorkflowStepRejecting);
    this.jobDescriptionAsync$ = this.store.select(fromWorkflowReducer.getJobDescriptionAsync);
    this.inSystemWorkflowComplete$ = this.store.select(fromWorkflowReducer.getInSystemWorkflowStepCompletionModalOpen);
  }

  ngOnInit() {
    this.jobDescriptionSubscription = this.jobDescriptionAsync$
      .pipe(filter(jd => jd.obj !== null && jd.obj !== undefined),
        distinctUntilChanged((previous, current) => previous.obj.JobDescriptionId === current.obj.JobDescriptionId))
      .subscribe( jd => {
        if (jd.obj.JobDescriptionId !== null && !this.workflowStepCompleted) {
          if (!!jd.obj.Attachments) {
            this.attachments = cloneDeep(jd.obj.Attachments);
            this.attachments.forEach(attachment => { this.setAttachmentIcons(attachment); });
          }
          this.store.dispatch(new fromWorkflowActions.LoadWorkflowLogEntries({
            jobDescriptionId: jd.obj.JobDescriptionId, jobDescriptionRevision: jd.obj.JobDescriptionRevision
          }));
        }
      });

    this.workflowStepCommentForm = this.formBuilder.group({
      comment: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.jobDescriptionSubscription.unsubscribe();
  }

  approveWorkflowStep() {
    this.store.dispatch(new fromWorkflowActions.ApproveWorkflowStep({
      workflowStepInfo: this.workflowStepInfo,
      willProceed: true,
      comment: this.workflowStepCommentForm.value.comment,
      isInSystemWorkflow: this.isInSystemWorkflow
    }));
    if (this.isInSystemWorkflow) {
      this.workflowStepCommentForm.controls.comment.disable();
    }
  }

  rejectWorkflowStep() {
    this.commentFormSubmitted = true;

    if (this.workflowStepCommentForm.valid) {
      this.store.dispatch(new fromWorkflowActions.RejectWorkflowStep({
        workflowStepInfo: this.workflowStepInfo,
        willProceed: false,
        comment: this.workflowStepCommentForm.value.comment,
        isInSystemWorkflow: this.isInSystemWorkflow
      }));
      if (this.isInSystemWorkflow) {
        this.workflowStepCommentForm.controls.comment.disable();
      }
    }
  }

  setAttachmentIcons(attachment) {
    switch (attachment.FileType && attachment.FileType.toLocaleLowerCase()) {
      case AttachmentFileType.Word.toLocaleLowerCase():
        attachment.iconType = 'file-word';
        attachment.iconClass = 'word';
        break;
      case AttachmentFileType.Pdf.toLocaleLowerCase():
        attachment.iconType = 'file-pdf';
        attachment.iconClass = 'pdf';
        break;
      case AttachmentFileType.Excel.toLocaleLowerCase():
        attachment.iconType = 'file-excel';
        attachment.iconClass = 'excel';
        break;
      case AttachmentFileType.Powerpoint.toLocaleLowerCase():
        attachment.iconType = 'file-powerpoint';
        attachment.iconClass = 'powerpoint';
        break;
      case AttachmentFileType.Image.toLocaleLowerCase():
        attachment.iconType = 'file-image';
        attachment.iconClass = 'image';
        break;
      default:
        attachment.iconType = 'file';
        attachment.iconClass = 'file';
        break;
    }
  }

  getAttachmentDownloadUrl(attachment) {
    return this.ATTACHMENT_DOWNLOAD_URL_PREFIX + attachment.CloudFileName;
  }
}
