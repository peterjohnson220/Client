import { Component, OnInit } from '@angular/core';

declare var initializePendo: any;

@Component({
  selector: 'pf-form-app-wrapper',
  templateUrl: './form-app-wrapper.component.html',
  styleUrls: ['./form-app-wrapper.component.scss']
})
export class FormAppWrapperComponent implements OnInit {
  payfactorsLogo = './assets/payfactors-white-logo.png';
  currentYear: number = new Date().getFullYear();
  constructor() {}

  ngOnInit() {
    if (typeof initializePendo !== 'undefined') {
      initializePendo();
    }
  }
}
