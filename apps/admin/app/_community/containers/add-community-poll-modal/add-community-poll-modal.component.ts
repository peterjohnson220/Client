import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ValidatorFn } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromCommunityPollActions from '../../actions/community-poll.actions';
import * as fromCommunityPollReducer from '../../reducers';

import { PfValidators } from 'libs/forms';
import { CommunityPollResponseComponent } from '../community-poll-response/community-poll-response.component';
import { CommunityPollAddRequest } from 'libs/models/community/community-poll-add-request.model';

@Component({
  selector: 'pf-add-community-poll-modal',
  templateUrl: './add-community-poll-modal.component.html',
  styleUrls: ['./add-community-poll-modal.component.scss']
})
export class AddCommunityPollModalComponent implements OnInit {

  addingCommunityPoll$: Observable<boolean>;
  addCommunityPollModalOpen$: Observable<boolean>;
  attemptedSubmit = false;

  creatingCommunityPoll$: Observable<boolean>;
  addingCommunityPollError$: Observable<boolean>;
  addingCommunityPollSuccess$: Observable<boolean>;

  addCommunityPollForm: FormGroup;
  itemsFormArray: FormArray;

  get question() { return this.addCommunityPollForm.get('question'); }
  get responses() { return this.addCommunityPollForm.get('responses') as FormArray; }

  constructor(private store: Store<fromCommunityPollReducer.State>, private fb: FormBuilder) {

    this.addingCommunityPoll$ = this.store.select(fromCommunityPollReducer.getCommunityAddingPoll);
    this.addingCommunityPollError$ = this.store.select(fromCommunityPollReducer.getCommunityAddingPollError);
    this.addingCommunityPollSuccess$ = this.store.select(fromCommunityPollReducer.getAddingCommunityPollSuccess);
    this.addCommunityPollModalOpen$ = this.store.select(fromCommunityPollReducer.getCommunityAddPollModalOpen);
    this.createForm();
   }

   pollResponseOptionsLimits(array: FormArray): ValidatorFn {
    return function() {
      const notEnoughOptions = array.length < 2 || array.length > 10 ? true : false;
      return notEnoughOptions ? {'2 or more response options required': {valid: false}} : null;
    };
  }

  ngOnInit() {

    this.addCommunityPollModalOpen$.subscribe(open => {
      if (open) {
        this.responses.push(CommunityPollResponseComponent.buildItem(''));
      }
    });

    this.responses.setValidators(this.pollResponseOptionsLimits(this.responses));
  }

  handleFormSubmit(): void {
    this.attemptedSubmit = true;

    const responseOptions = [];

    for (let index = 0; index < this.responses.length; index++) {
      const responseOption = this.responses.at(index).get('response').value;
      responseOptions.push(responseOption);
    }

    const newPoll: CommunityPollAddRequest = {
      Question: this.question.value,
      ResponseOptions: responseOptions
    };
    this.store.dispatch(new fromCommunityPollActions.AddingCommunityPoll(newPoll));
  }

  handleModalDismissed(): void {
    this.attemptedSubmit = false;
    this.responses.controls = [];
    this.store.dispatch(new fromCommunityPollActions.CloseAddCommunityPollModal);
  }

  addItem() {
     this.responses.push(CommunityPollResponseComponent.buildItem(''));
  }

  createForm(): void {
    this.addCommunityPollForm = this.fb.group({
      'question': ['', [PfValidators.required]],
      'responses': this.fb.array([])
    });
  }
}


