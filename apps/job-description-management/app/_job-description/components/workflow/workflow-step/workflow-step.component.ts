import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-workflow-step',
  templateUrl: './workflow-step.component.html',
  styleUrls: ['./workflow-step.component.scss']
})
export class WorkflowStepComponent  {

  @Input() workflowStepSummary: any;
  @Input() avatarUrl: string;

  constructor() { }
}
