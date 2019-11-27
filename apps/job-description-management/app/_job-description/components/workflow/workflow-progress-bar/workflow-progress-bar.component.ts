import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WorkflowStepSummaryItem } from '../../../models';

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

  private linkCopied = false;

  constructor() { }

  copyWorkflowLink() {
    this.copyWorkflowLinkClicked.emit();
    this.linkCopied = true;

    // after 3 seconds, set linkCopied back to false
    setTimeout(() => { this.linkCopied = false; }, 3000);
  }

}
