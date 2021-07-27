import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'pf-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent {
  @Output() closeClicked: EventEmitter<any>;

  constructor() {
    this.closeClicked = new EventEmitter();
  }

  close(): void {
    this.closeClicked.emit();
  }
}
