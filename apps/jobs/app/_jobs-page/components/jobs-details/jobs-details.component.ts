import {Component, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit} from '@angular/core';

@Component({
  selector: 'pf-jobs-details',
  templateUrl: './jobs-details.component.html',
  styleUrls: ['./jobs-details.component.scss']
})
export class JobsDetailsComponent {

  @Output() onClose = new EventEmitter();

  constructor() { }

  close() {
    this.onClose.emit(null);
  }
}
