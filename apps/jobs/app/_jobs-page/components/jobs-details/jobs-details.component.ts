import {Component, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit} from '@angular/core';

@Component({
  selector: 'pf-jobs-details',
  templateUrl: './jobs-details.component.html',
  styleUrls: ['./jobs-details.component.scss']
})
export class JobsDetailsComponent implements AfterViewInit {

  @Output() onClose = new EventEmitter();

  @ViewChild('employeeColumn', { static: false }) employeeColumn: ElementRef;
  colTemplates = {};
  constructor() { }

  close() {
    this.onClose.emit(null);
  }
  ngAfterViewInit() {
    this.colTemplates = {
      'Employee': this.employeeColumn
    };
  }

}
