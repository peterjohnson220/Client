import {Component, Output, EventEmitter, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'pf-jobs-details',
  templateUrl: './jobs-details.component.html',
  styleUrls: ['./jobs-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JobsDetailsComponent {

  @Output() onClose = new EventEmitter();

  constructor() { }

  close() {
    this.onClose.emit(null);
  }
}
