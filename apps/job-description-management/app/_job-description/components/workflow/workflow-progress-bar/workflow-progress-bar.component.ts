import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WorkflowStepSummaryItem } from '../../../models';
import { PermissionService } from 'libs/core';
import { Permissions, PermissionCheckEnum } from 'libs/constants';

@Component({
  selector: 'pf-workflow-progress-bar',
  templateUrl: './workflow-progress-bar.component.html',
  styleUrls: ['./workflow-progress-bar.component.scss']
})
export class WorkflowProgressBarComponent {
  @Input() loading: boolean;
  @Input() workflowStepSummary: WorkflowStepSummaryItem[];
  @Input() isSiteAdmin: boolean;
  @Input() isCompanyAdmin: boolean;
  @Output() changeApproverClicked = new EventEmitter();
  @Output() copyWorkflowLinkClicked = new EventEmitter();
  @Output() emailResendClicked = new EventEmitter();

  public linkCopied = false;
  public emailSent = false;
  public hasWorkflowUserManagementPermission: boolean;

  constructor(private permissionService: PermissionService) {
    this.hasWorkflowUserManagementPermission = this.permissionService.CheckPermission([Permissions.WORKFLOW_USER_MANAGEMENT], PermissionCheckEnum.Single);
  }

  copyWorkflowLink() {
    this.copyWorkflowLinkClicked.emit();
    this.linkCopied = true;

    // after 3 seconds, set linkCopied back to false
    setTimeout(() => { this.linkCopied = false; }, 3000);
  }

  resendEmail() {
    this.emailResendClicked.emit();
    this.emailSent = true;

    // after 3 seconds, set emailSent back to false
    setTimeout(() => { this.emailSent = false; }, 3000);
  }

}
