import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import * as fromLoginAreaReducer from '../../../reducers';
import * as fromLoginActions from '../../../actions/login.actions';

@Component({
  selector: 'pf-login-page',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPageComponent implements OnInit {
  emailAddress: string;
  password: string;

  constructor(private store: Store<fromLoginAreaReducer.State>) { }

  login() {
    this.store.dispatch(new fromLoginActions.Login({ emailAddress: this.emailAddress, password: this.password }));
  }

  ngOnInit() {
  }

}
