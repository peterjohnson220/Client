import { Component, OnInit } from '@angular/core';

declare var initializePendo: any;

@Component({
  selector: 'pf-login-page',
  templateUrl: './login.page.html',
  styleUrls: [ './login.page.scss' ]
})
export class LoginPageComponent implements OnInit {

  loginLogo = 'assets/images/MarketingPlaceholder.PNG';

  constructor() { }

  ngOnInit(){
    initializePendo(null);
  }
}
