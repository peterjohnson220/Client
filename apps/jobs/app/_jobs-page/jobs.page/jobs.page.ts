import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'pf-jobs-page',
  templateUrl: './jobs.page.html'
})

export class JobsPageComponent implements OnInit, AfterViewInit {

  @ViewChild('complexColumn', {static: false}) complexColTemplate: ElementRef;
  @ViewChild('complexColumn2', {static: false}) complexColTemplate2: ElementRef;
  colTemplates = {};

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
      this.colTemplates = {
        'Complex_Col': this.complexColTemplate,
        'Complex_Col2': this.complexColTemplate2
      };
  }
}
