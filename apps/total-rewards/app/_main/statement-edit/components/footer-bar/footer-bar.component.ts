import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'pf-footer-bar',
  templateUrl: './footer-bar.component.html',
  styleUrls: ['./footer-bar.component.scss']
})
export class FooterBarComponent {

  @Output() assignEmployeesButtonClick = new EventEmitter();

  constructor() { }

  onAssignEmployeesButtonClick(): void {
    this.assignEmployeesButtonClick.emit();
  }
}
