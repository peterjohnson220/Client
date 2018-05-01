import { Component, OnInit } from '@angular/core';

declare var initializePendo: any;

@Component({
  selector: 'pf-auth-layout-wrapper',
  templateUrl: './auth-layout-wrapper.component.html',
  styleUrls: [ './auth-layout-wrapper.component.scss' ]
})
export class AuthLayoutWrapper implements OnInit {
  payfactorsLogo = 'assets/images/PayFactors-white-logo_0404.png';

  constructor() {}

  ngOnInit() {
    if (typeof initializePendo !== 'undefined') {
      initializePendo();
    }
  }
}
