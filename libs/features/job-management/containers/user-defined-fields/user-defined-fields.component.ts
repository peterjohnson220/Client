import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { Subscription, Observable } from 'rxjs';
import { Store, ActionsSubject } from '@ngrx/store';

import { CompanyJobUdf } from 'libs/models';
import { PfValidators } from 'libs/forms';

import * as fromJobManagementActions from '../../actions';
import * as fromJobManagementReducer from '../../reducers';
import { ofType } from '@ngrx/effects';

@Component({
  selector: 'pf-user-defined-fields',
  templateUrl: './user-defined-fields.component.html',
  styleUrls: ['./user-defined-fields.component.scss']
})
export class UserDefinedFieldsComponent implements OnInit, OnDestroy {

  jobUserDefinedFields$: Observable<CompanyJobUdf[]>;
  udfsSubscription: Subscription;
  formChangesSubscription: Subscription;
  onShowFormSubscription: Subscription;
  loadJobSuccessSubscription: Subscription;
  resetStateSubscription: Subscription;

  udfsForm: FormGroup;

  readonly DEFAULT_MAX_LENGTH = 255;

  // convenience getter for easy access to form fields
  get f() { return this.udfsForm.controls; }

  constructor(
    private store: Store<fromJobManagementReducer.State>,
    private formBuilder: FormBuilder,
    private actionsSubject: ActionsSubject) { }

  ngOnInit() {
    this.jobUserDefinedFields$ = this.store.select(fromJobManagementReducer.getCompanyJobUdfs);

    this.udfsForm = this.formBuilder.group({});

    this.loadJobSuccessSubscription = this.actionsSubject
      .pipe(ofType(fromJobManagementActions.LOAD_JOB_SUCCESS))
      .subscribe((action: fromJobManagementActions.LoadJobSuccess) => {
        this.udfsForm.patchValue(action.payload.JobInfo);
      });

    this.resetStateSubscription = this.actionsSubject
      .pipe(ofType(fromJobManagementActions.RESET_STATE))
      .subscribe(data => {
        this.udfsForm.reset();
      });

    this.udfsSubscription = this.jobUserDefinedFields$.subscribe(userDefinedFields => {
      for (const userDefinedField of userDefinedFields) {
        this.udfsForm.addControl(
          userDefinedField.ColumnName,
          new FormControl('', PfValidators.maxLengthTrimWhitespace(this.DEFAULT_MAX_LENGTH)));
      }
    });

    this.formChangesSubscription = this.udfsForm.valueChanges.subscribe(value => {
      this.store.dispatch(new fromJobManagementActions.UpdateUserDefinedFields(value));
    });
  }

  ngOnDestroy() {
    this.udfsSubscription.unsubscribe();
    this.formChangesSubscription.unsubscribe();
    this.loadJobSuccessSubscription.unsubscribe();
    this.resetStateSubscription.unsubscribe();
  }


}
