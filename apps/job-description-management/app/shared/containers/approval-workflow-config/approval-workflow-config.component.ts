import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import cloneDeep from 'lodash/cloneDeep';

import * as fromRootState from 'libs/state/state';
import { UserContext } from 'libs/models/security';
import { Permissions } from 'libs/constants/permissions';
import * as fromJDMSharedReducer from 'libs/features/jobs/job-description-management/reducers';
import * as fromWorkflowConfigActions from 'libs/features/jobs/job-description-management/actions/workflow-config.actions';
import { AddUserToWorkflowObj, WorkflowStep, WorkflowUser } from 'libs/features/jobs/job-description-management/models';
import { WorkflowConfigHelper } from 'libs/features/jobs/job-description-management';
import { formatBytes } from 'libs/core/functions';
import * as fromAppNotificationsActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';
import { AppNotification } from 'libs/features/infrastructure/app-notifications/models';
import {  KendoUploadStatus } from 'libs/models';
import { FileInfo, FileRestrictions, RemoveEvent, SelectEvent, SuccessEvent, UploadEvent } from '@progress/kendo-angular-upload';
import { WorkflowAttachmentFiles } from '../../../_job-description/constants/workflow-attachment-files';
import { mapFileInfoToWorkflowAddAttachment } from '../../../_job-description/helpers/workflow-model-mapping.helper';
import { JobDescriptionWorkflowAttachment } from 'libs/models/jdm/job-description-workflow-attachment';

@Component({
  selector: 'pf-approval-workflow-config',
  templateUrl: './approval-workflow-config.component.html',
  styleUrls: ['./approval-workflow-config.component.scss']
})
export class ApprovalWorkflowConfigComponent implements OnInit, OnDestroy {
  @Input() jobIds: number[];
  @Input() showAttachmentsUpload = false;
  @Output() onShowNameFormClicked = new EventEmitter<boolean>();

  hasForbiddenUsers$: Observable<boolean>;
  workflowSteps$: Observable<WorkflowStep[]>;
  workflowUserOrEmail$: Observable<any>;
  attachments$: Observable<JobDescriptionWorkflowAttachment[]>;
  identity$: Observable<UserContext>;
  getNotification$: Observable<AppNotification<any>[]>;

  hasForbiddenUsersSubscription: Subscription;
  workflowStepsSubscription: Subscription;
  workflowUserOrEmailSubscription: Subscription;
  dragulaSub: Subscription;
  identitySubscription: Subscription;
  getNotificationSubscription: Subscription;

  addNonPfUserForm: FormGroup;
  addNonPfUserSameStepForm: FormGroup;
  avatarUrl: string;
  currentEmail: string;
  displayNameThreshold = 30;
  hasForbiddenUsers: boolean;
  nonPfUserFormSubmitted: boolean;
  nonPfUserSameStepDuplicateEmail: boolean;
  nonPfUserSameStepFormSubmitted: boolean;
  publisherName: string;
  sameStepEmail: string;
  showNameForm: boolean;
  stepAddingNonPfUsers: number;
  stepWithMultipleUsersBeingAdded: number;
  workflowSteps: WorkflowStep[];
  uploadedFilesKendo: Array<FileInfo>;
  uploadedFiles: JobDescriptionWorkflowAttachment[] = [];
  saveAttachmentUrl = '/odata/CloudFiles.UploadJDMWorkflowAttachment';
  removeAttachmentUrl = '/odata/CloudFiles.DeleteJDMWorkflowAttachment';
  maxFileCount = 3;
  showFileCountWarning = false;
  workflowAttachmentUploadStatus = KendoUploadStatus;
  @ViewChild('uploadWidget', {static: true}) uploadWidget: any;

  public uploadRestrictions: FileRestrictions = {
    allowedExtensions: WorkflowAttachmentFiles.VALID_FILE_EXTENSIONS,
    maxFileSize: WorkflowAttachmentFiles.MAX_SIZE_LIMIT
  };


  get fileRestrictionsMessage() {
    const formattedSize = formatBytes(WorkflowAttachmentFiles.MAX_SIZE_LIMIT);
    let message = `Individual files cannot exceed ${formattedSize}. Accepted file types: `;
    WorkflowAttachmentFiles.VALID_FILE_EXTENSIONS.forEach(extension => {
      message = `${message} ${extension}`;
    });
    return message;
  }

  getUploadStatus(file: FileInfo) {
    const attachment = this.uploadedFiles.find(f => f.Id === file.uid);
    if (attachment) {
      return attachment.Status;
    }
    return KendoUploadStatus.NotStarted;
  }

  getStatusClass(file: FileInfo) {
    const attachment = this.uploadedFiles.find(f => f.Id === file.uid);
    if (!attachment) {
      return 'upload-in-progress';
    }

    switch (attachment.Status) {
      case KendoUploadStatus.ScanSucceeded:
        return 'upload-success';
      case KendoUploadStatus.UploadFailed:
      case KendoUploadStatus.ScanFailed:
      case KendoUploadStatus.InvalidExtension:
        return 'upload-failed';
      default:
        return 'upload-in-progress';
    }
  }

  formattedBytes(bytes) {
    return formatBytes(bytes);
  }

  uploadAttachmentEventHandler(e: UploadEvent) {
    if (this.uploadedFiles.length >= this.maxFileCount) {
      e.preventDefault();
      this.showFileCountWarning = true;
      return;
    }

    const file = e.files[0];
    const cloudFileName = `${file.uid}_${file.name}`;
    e.data = {CloudFileName: cloudFileName, Id: file.uid};

    const fileToUpload = mapFileInfoToWorkflowAddAttachment(file, cloudFileName);
    fileToUpload.Status = KendoUploadStatus.UploadInProgress;
    this.uploadedFiles.push(fileToUpload);
    this.updateUploadButtonState();
  }

  successEventHandler(e: SuccessEvent) {
    // successEventHandler gets fired multiple times for the remove operation with the latest call having a response.type of 4
    if (e.operation === 'upload' || (e.operation === 'remove' && e.response.type === 4)) {
      const uploadedFile = this.uploadedFiles.find(f => f.Id === e.files[0].uid);

      if (uploadedFile) {
        uploadedFile.Status = KendoUploadStatus.ScanInProgress; // scan in progress now...
      }

      this.saveWorkflowAttachmentState();

      if (this.uploadedFiles.length >= this.maxFileCount) {
        this.showFileCountWarning = true;
      }
    }
  }

  selectEventHandler(e: SelectEvent): void {
    e.files.forEach((file) => {
      if (file.validationErrors && (file.validationErrors.includes('invalidFileExtension') || file.validationErrors.includes('invalidMaxFileSize'))) {
        const cloudFileName = `${file.uid}_${file.name}`;
        const fileToUpload = mapFileInfoToWorkflowAddAttachment(file, cloudFileName);
        fileToUpload.Status = file.validationErrors.includes('invalidFileExtension') ?
          KendoUploadStatus.InvalidExtension : KendoUploadStatus.InvalidMaxFileSize;
        this.uploadedFiles.push(fileToUpload);
        this.saveWorkflowAttachmentState();
      }
    });
  }

  errorEventHandler(e: any) {
    if (this.uploadedFiles.length >= this.maxFileCount) {
      e.preventDefault();
    }
  }

  removeEventHandler(e: RemoveEvent) {
    e.data = {uid: e.files[0].uid};
  }

  removeAttachmentEventHandler(file: FileInfo) {
    const index = this.uploadedFiles.findIndex(f => f.Id === file.uid);
    if (index >= 0) {
      this.uploadedFiles.splice(index, 1);
      this.showFileCountWarning = false;

      if (!!file.validationErrors) {
        this.saveWorkflowAttachmentState();
      }
    }

    file.name = `${file.uid}_${file.name}`;
    this.uploadWidget.removeFilesByUid(file.uid);
    this.updateUploadButtonState();
  }

  updateUploadButtonState() {
    if (this.uploadedFiles.length >= this.maxFileCount) {
      const buttonElement = this.uploadWidget.wrapper.getElementsByClassName('k-upload-button');
      buttonElement[0].classList.add('k-state-disabled');
    } else {
      const buttonElement = this.uploadWidget.wrapper.getElementsByClassName('k-upload-button');
      buttonElement[0].classList.remove('k-state-disabled');
    }
  }

  constructor(
    private sharedJdmStore: Store<fromJDMSharedReducer.State>,
    private userContextStore: Store<fromRootState.State>,
    private formBuilder: FormBuilder,
    private dragulaService: DragulaService,
    private appNotificationStore: Store<fromAppNotificationsMainReducer.State>
  ) {
    this.initDragulaSub();
    this.hasForbiddenUsers$ = this.sharedJdmStore.select(fromJDMSharedReducer.getHasUsersWithoutPermission);
    this.workflowSteps$ = this.sharedJdmStore.select(fromJDMSharedReducer.getWorkflowStepsFromWorkflowConfig);
    this.workflowUserOrEmail$ = this.sharedJdmStore.select(fromJDMSharedReducer.getWorkflowUserOrEmail);
    this.attachments$ = this.sharedJdmStore.select(fromJDMSharedReducer.getWorkflowAttachments);
    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
    this.getNotification$ = this.appNotificationStore.select(fromAppNotificationsMainReducer.getNotifications);
  }

  ngOnInit(): void {
    this.initData();
    this.buildNonPfUserForm();
    this.buildNonPfUserSameLevelForm();
    this.hasForbiddenUsersSubscription = this.hasForbiddenUsers$.subscribe(value => this.hasForbiddenUsers = value);
    this.workflowStepsSubscription = this.workflowSteps$.subscribe(results => {
      this.workflowSteps = results;
      this.setPublisherName();
    });
    this.workflowUserOrEmailSubscription = this.workflowUserOrEmail$.subscribe(selection => {
      if (selection) {
        this.handlePickerSelection(selection);
      }
    });
    this.identitySubscription = this.identity$.subscribe(i => {
      if (!!i) {
        this.avatarUrl = i.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/avatars/';
      }
    });

    this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.ResetWorkflow());

    this.getNotificationSubscription = this.getNotification$.subscribe(notifications => {
     this.processNotifications(notifications);
    });
  }

  processNotifications(notifications: AppNotification<any>[]): void {
    notifications.forEach(notification => {
      if (!notification) {
        return;
      }

      const attachment = this.uploadedFiles.find((x) => x.Id === notification.NotificationId);

      if (!attachment) {
        return;
      }

      this.uploadedFiles = cloneDeep(this.uploadedFiles);
      const uploadedFile = this.uploadedFiles.find(f => f.Id === notification.NotificationId);

      if (notification.Level === 'Success' && attachment.Status !== KendoUploadStatus.ScanSucceeded) {
        uploadedFile.Status = KendoUploadStatus.ScanSucceeded;
        this.appNotificationStore.dispatch(new fromAppNotificationsActions.DeleteNotification({notificationId: notification.NotificationId}));
      } else {
        uploadedFile.Status = KendoUploadStatus.ScanFailed;
        this.appNotificationStore.dispatch(new fromAppNotificationsActions.DeleteNotification({notificationId: notification.NotificationId}));
      }

      this.saveWorkflowAttachmentState();
    });
  }

  saveWorkflowAttachmentState() {
    this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.SaveWorkflowAttachmentsState(cloneDeep(this.uploadedFiles)));
  }

  ngOnDestroy(): void {
    this.destroyDragula();
    this.hasForbiddenUsersSubscription?.unsubscribe();
    this.workflowStepsSubscription?.unsubscribe();
    this.identitySubscription?.unsubscribe();
    this.workflowUserOrEmailSubscription?.unsubscribe();
    this.getNotificationSubscription?.unsubscribe();
  }

  nonPfUserFormSubmit(): void {
    this.nonPfUserFormSubmitted = true;
    if (this.addNonPfUserForm.valid) {
      this.addNonPfUserToWorkflow(this.addNonPfUserForm.value.firstname, this.addNonPfUserForm.value.lastname, null);
    }
  }

  cancelNonPfUserAdd(): void {
    this.showNameForm = false;
    this.onShowNameFormClicked.emit(false);
    this.currentEmail = '';
  }

  addNonPfUserToWorkflow(firstName: string, lastName: string, stepIndex: number) {
    const addUserToWorkflowObj: AddUserToWorkflowObj = {
      FirstName: firstName,
      LastName: lastName,
      EmailAddress: this.currentEmail,
      JobIds: this.jobIds,
      IsNonPfUser: true,
      StepIndex: stepIndex,
      Permissions: WorkflowConfigHelper.getDefaultPermissions()
    };
    this.showNameForm = false;
    this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.AddNonPfUserToWorkflow(addUserToWorkflowObj));
  }

  handlePickerSelection(selectedUser: WorkflowUser): void {
    if (!selectedUser.FirstName || !selectedUser.LastName) {
      this.addNonPfUserForm.reset();
      this.nonPfUserFormSubmitted = false;
      this.showNameForm = true;
      this.currentEmail = selectedUser.EmailAddress;
    } else {
      const workflowUser: WorkflowUser = {
        ...selectedUser,
        Permissions: WorkflowConfigHelper.getDefaultPermissions()
      };
      this.onShowNameFormClicked.emit(false);
      this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.CreateWorkflowStep(workflowUser));
    }
  }

  handleRemoveClicked(user: WorkflowUser) {
    this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.DeleteUserOrEmail(user));
  }

  isUserImg(user: WorkflowUser) {
    return user.UserPicture && user.UserPicture !== 'default_user.png';
  }

  addMultipleUsersToLevel(stepIndex: number): void {
    this.stepWithMultipleUsersBeingAdded = stepIndex;
  }

  updateWorkflowStepPermission(workflowUser: WorkflowUser, permission: string): void {
    if (permission === Permissions.CAN_EDIT_JOB_DESCRIPTION) {
      this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.UpdateWorkflowStepPermission({workflowUser, permission}));
    }
  }

  deleteWorkflowStep(stepIndex: number): void {
    this.resetMultiUserStepTracking();
    this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.DeleteWorkflowStep({stepIndex}));
  }

  handleMultipleUserPerLevelSelection(selectedUser: any, stepIndex: number): void {
    this.nonPfUserSameStepDuplicateEmail = false;
    if (this.workflowSteps[stepIndex].WorkflowStepUsers.some(stepUser => stepUser.EmailAddress.toLowerCase() === selectedUser.EmailAddress.toLowerCase())) {
      this.nonPfUserSameStepDuplicateEmail = true;
      return;
    }

    if (!selectedUser.FirstName || !selectedUser.LastName) {
      this.addNonPfUserSameStepForm.reset();
      this.currentEmail = selectedUser.EmailAddress;
      this.resetMultiUserStepTracking();
      this.stepAddingNonPfUsers = stepIndex;
    } else {
      const workflowUser: WorkflowUser = {
        ...selectedUser,
        Permissions: WorkflowConfigHelper.getDefaultPermissions()
      };
      this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.AddUserToWorkflowStep({stepIndex, workflowUser: workflowUser}));
      this.resetMultiUserStepTracking();
    }
  }

  resetMultiUserStepTracking(): void {
    this.nonPfUserSameStepDuplicateEmail = false;
    this.stepWithMultipleUsersBeingAdded = null;
    this.stepAddingNonPfUsers = null;
  }

  nonPfUserSameLevelFormSubmit(stepIndex: number): void {
    this.nonPfUserSameStepFormSubmitted = true;
    if (this.addNonPfUserSameStepForm.valid) {
      this.addNonPfUserToWorkflow(this.addNonPfUserSameStepForm.value.firstname, this.addNonPfUserSameStepForm.value.lastname, stepIndex);
    }
    this.resetMultiUserStepTracking();
  }

  cancelNonPfUserSameLevelAdd(): void {
    this.nonPfUserSameStepDuplicateEmail = false;
    this.stepAddingNonPfUsers = null;
    this.sameStepEmail = '';
  }

  getUserInitials(user: WorkflowUser): string {
    return `${user.FirstName.substring(0, 1)}${user.LastName.substring(0, 1)}`.toUpperCase();
  }

  getDisplayName(user: WorkflowUser): string {
    return user.UserId ? `${user.FirstName} ${user.LastName}` : user.EmailAddress;
  }

  hideDisplayNameTooltip(ngbTooltip: NgbTooltip) {
    if (ngbTooltip.isOpen()) {
      ngbTooltip.close();
    }
  }

  showDisplayNameTooltip(user: WorkflowUser, ngbTooltip: NgbTooltip) {
    const displayName = this.getDisplayName(user);

    if (displayName.trim().length > this.displayNameThreshold) {
      ngbTooltip.open();
    }
  }

  private initDragulaSub(): void {
    this.dragulaSub = new Subscription();
    this.dragulaSub.add(this.dragulaService.dropModel('workflow-user-reorder-bag').subscribe(({sourceModel}) => {
      this.reorderWorkflowSteps(sourceModel);
    }));
    this.dragulaService.createGroup('workflow-user-reorder-bag', {
      revertOnSpill: true,
      moves: function (el, container, handle) {
        return handle.classList.contains('dnd-workflow-user-reorder-handle') &&
          handle.classList.contains('grabbable');
      },
      accepts: function (el, target, source) {
        return source.id === target.id;
      }
    });
  }

  private destroyDragula() {
    this.dragulaSub.unsubscribe();
    this.dragulaService.destroy('workflow-user-reorder-bag');
  }

  private reorderWorkflowSteps(sourceModel: any[]) {
    if (!sourceModel) {
      return;
    }
    return this.sharedJdmStore.dispatch(new fromWorkflowConfigActions.ReorderWorkflowSteps(sourceModel));
  }

  private buildNonPfUserForm() {
    this.addNonPfUserForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required]
    });
  }

  private initData(): void {
    this.publisherName = '';
    this.currentEmail = '';
    this.showNameForm = false;
    this.nonPfUserFormSubmitted = false;
    this.nonPfUserSameStepFormSubmitted = false;
  }

  private buildNonPfUserSameLevelForm(): void {
    this.addNonPfUserSameStepForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required]
    });
  }

  private setPublisherName(): void {
    if (this.workflowSteps.every(x => x.WorkflowStepUsers.length === 0)) {
      this.publisherName = '';
      return;
    }
    const lastWorkflowStep = this.workflowSteps[this.workflowSteps.length - 1];
    const lastStepUsers = lastWorkflowStep.WorkflowStepUsers;
    const numLastStepUsers = lastStepUsers.length;
    const lastUserInStep = lastStepUsers[numLastStepUsers - 1];

    if (numLastStepUsers === 1) {
      this.publisherName = `${lastUserInStep.FirstName} ${lastUserInStep.LastName}`;
    } else {
      let notLastUsers = '';
      for (let i = 0; i < numLastStepUsers - 1; i++) {
        notLastUsers += lastStepUsers[i].FirstName + ' ' + lastStepUsers[i].LastName;

        if (i !== numLastStepUsers - 2 && numLastStepUsers > 2) {
          notLastUsers += ', ';
        }
      }
      this.publisherName = `either ${notLastUsers} or ${lastUserInStep.FirstName} ${lastUserInStep.LastName}`;
    }
  }
}
