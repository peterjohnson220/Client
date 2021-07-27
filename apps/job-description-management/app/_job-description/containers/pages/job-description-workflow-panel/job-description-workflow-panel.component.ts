import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'pf-job-description-workflow-panel',
  templateUrl: './job-description-workflow-panel.component.html',
  styleUrls: ['./job-description-workflow-panel.component.scss']
})
export class JobDescriptionWorkflowPanelComponent {

  @Output() closed = new EventEmitter();

  close() {
    this.closed.emit(true);
  }
}
