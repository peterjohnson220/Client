import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { JobDescription } from 'libs/models';
import { WorkflowSetupModalInput } from '../../../models';

@Component({
  selector: 'pf-job-description-workflow-panel',
  templateUrl: './job-description-workflow-panel.component.html',
  styleUrls: ['./job-description-workflow-panel.component.scss']
})
export class JobDescriptionWorkflowPanelComponent {

  @Input() jobDescription: JobDescription;
  @Output() closed = new EventEmitter();

  @ViewChild('accordion') accordion: NgbAccordion;

  get workflowSetupModalInput(): WorkflowSetupModalInput[]  {
    return [{EntityId:  this.jobDescription?.JobDescriptionId,
      JobTitle: this.jobDescription?.Name,
      Revision: this.jobDescription?.JobDescriptionRevision,
      JobId: this.jobDescription?.CompanyJobId }];
  }

  closeAll() {
    this.closed.emit(true);
  }

  togglePanel(panelId: string): void {
    this.accordion.toggle(panelId);
  }
}
