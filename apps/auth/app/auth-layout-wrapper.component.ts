import { Component, OnInit } from '@angular/core';

declare var initializePendo: any;

@Component({
  selector: 'pf-auth-layout-wrapper',
  templateUrl: './auth-layout-wrapper.component.html',
  styleUrls: [ './auth-layout-wrapper.component.scss' ]
})
export class AuthLayoutWrapperComponent implements OnInit {
  payfactorsLogo = './assets/payfactors-white-logo.png';
  currentYear: number = new Date().getFullYear();
  constructor() {}

  ngOnInit() {
    if (typeof initializePendo !== 'undefined') {
      initializePendo();
    }
  }
}
