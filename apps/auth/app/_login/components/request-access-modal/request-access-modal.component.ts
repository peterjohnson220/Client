import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromLoginReducer from './../../reducers';
import * as fromLoginActions from './../../actions/login.actions';

@Component({
  selector: 'pf-request-access-modal',
  templateUrl: './request-access-modal.component.html',
  styleUrls: ['./request-access-modal.component.scss']
})
export class RequestAccessModalComponent implements OnInit {

  requestAccessForm: FormGroup;
  showRequestAccessModal$: Observable<boolean>;

  constructor(private formBuilder: FormBuilder, public loginStore: Store<fromLoginReducer.State>) {
    this.showRequestAccessModal$ = this.loginStore.select(fromLoginReducer.getShowRequestAccessForm);
    this.requestAccessForm = this.formBuilder.group({ });
  }

  ngOnInit() { }

  onRequestAccessSubmit() { }

  onRequestAccessDismiss() {
    this.loginStore.dispatch(new fromLoginActions.LoginDismissRequestAccess());
  }
}
