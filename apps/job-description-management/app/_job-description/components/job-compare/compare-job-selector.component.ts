import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JobDescription } from 'libs/models/jdm/job-description.model';



@Component({
  selector: 'pf-compare-job-selector',
  templateUrl: './compare-job-selector.component.html',
  styleUrls: ['./compare-job-selector.component.scss']
})
export class CompareJobSelectorComponent {
  @Input() jobDescriptionList: JobDescription[];
  @Input() value: JobDescription;
  @Output() jobDescriptionChanged = new EventEmitter();

  constructor() {}
}
