import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { PfValidators } from 'libs/forms/validators';

import * as fromTotalRewardsReducer from '../../reducers';
import * as fromTotalRewardsActions from '../../actions';
import * as fromCreateNewStatementActions from '../../actions/create-new-statement.actions';

@Component({
  selector: 'pf-create-new-statement-modal',
  templateUrl: './create-new-statement-modal.component.html',
  styleUrls: ['./create-new-statement-modal.component.scss']
})
export class CreateNewStatementModalComponent implements OnInit, OnDestroy {

  isOpen$: Observable<boolean>;
  name$: Observable<string>;
  isValidatingName$: Observable<boolean>;
  isValidName$: Observable<boolean>;
  isCreating$: Observable<boolean>;

  formGroup: FormGroup;
  allSubscriptions = new Subscription();

  constructor(private store: Store<fromTotalRewardsReducer.State>, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.isOpen$ = this.store.select(fromTotalRewardsReducer.getStatementsIsCreateNewStatementModalOpen);
    this.name$ = this.store.select(fromTotalRewardsReducer.getCreateNewStatementName);
    this.isValidatingName$ = this.store.select(fromTotalRewardsReducer.getCreateNewStatementIsValidatingName);
    this.isValidName$ = this.store.select(fromTotalRewardsReducer.getCreateNewStatementIsValidName);
    this.isCreating$ = this.store.select(fromTotalRewardsReducer.getCreateNewStatementIsCreating);

    this.initForm();
  }

  initForm(): void {
    this.formGroup = this.formBuilder.group({
      Name: ['', [ PfValidators.required ]],
      Template: [null, [ PfValidators.required ]]
    });

    // update the store's Name as the form is updated
    this.allSubscriptions.add(this.formGroup.get('Name').valueChanges.subscribe(name => {
      this.store.dispatch(new fromCreateNewStatementActions.UpdateName(name));
      this.store.dispatch(new fromCreateNewStatementActions.ValidateStatementName());
    }));

    // update the store's Template as the form is updated
    this.allSubscriptions.add(this.formGroup.get('Template').valueChanges.subscribe(template => {
      this.store.dispatch(new fromCreateNewStatementActions.UpdateTemplate(template));
    }));

    // invalidate the form Name if it's already taken
    this.allSubscriptions.add(this.isValidName$.subscribe(isValid => {
      if (!isValid) {
        this.formGroup.get('Name').setErrors({ 'incorrect': true });
      }
    }));
  }

  onCreateNewStatement() {
    this.store.dispatch(new fromCreateNewStatementActions.Create());
  }

  onDismissModal() {
    this.store.dispatch(new fromTotalRewardsActions.CloseCreateNewStatementModal());
  }

  ngOnDestroy() {
    this.allSubscriptions.unsubscribe();
  }

}
