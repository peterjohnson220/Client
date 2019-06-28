import { Component, Input } from '@angular/core';

@Component({
  selector: 'pf-standard-report',
  templateUrl: './standard-report.component.html',
  styleUrls: ['./standard-report.component.scss']
})
export class StandardReportComponent {
  @Input() imageUrl: string;
  @Input() name: string;

  constructor() {}
}
