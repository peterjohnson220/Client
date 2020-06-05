import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-job-title-code',
  templateUrl: './job-title-code.component.html',
})

export class JobTitleCodeComponent {
  @Input() jobTitle: string;
  @Input() jobCode: string;
  @Input() jobTitleClass = '';

  constructor() { }
}
