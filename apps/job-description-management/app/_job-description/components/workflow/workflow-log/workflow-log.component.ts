import { Component, Input } from '@angular/core';

import { WorkflowLogEntry } from '../../../models';


@Component({
  selector: 'pf-workflow-log',
  templateUrl: './workflow-log.component.html',
  styleUrls: ['./workflow-log.component.scss']
})
export class WorkflowLogComponent {
  @Input() workflowLogEntries: WorkflowLogEntry[];
  @Input() loading: boolean;

  constructor() { }

}
