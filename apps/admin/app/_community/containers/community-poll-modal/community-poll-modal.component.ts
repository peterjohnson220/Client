import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ValidatorFn } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromCommunityPollActions from '../../actions/community-poll.actions';
import * as fromCommunityPollReducer from '../../reducers';
import * as constants from 'libs/models/community/community-poll-constants.model';

import { PfValidators } from 'libs/forms';
import { CommunityPollResponseComponent } from '../community-poll-response/community-poll-response.component';
import { CommunityPollList} from 'libs/models';
import { CommunityPollUpsertRequest } from 'libs/models/community/community-poll-upsert-request.model';

@Component({
  selector: 'pf-community-poll-modal',
  templateUrl: './community-poll-modal.component.html',
  styleUrls: ['./community-poll-modal.component.scss']
})
export class CommunityPollModalComponent implements OnInit {

  communityPollModalOpen$: Observable<boolean>;
  communityPollListToEdit$: Observable<CommunityPollList>;

  addCommunityPollForm: FormGroup;
  isEditMode = false;
  attemptedSubmit = false;

  get CommunityPollStatuses() { return constants.CommunityPollStatuses; }

  get communityPollId() { return this.addCommunityPollForm.get('communityPollId'); }
  get status() { return this.addCommunityPollForm.get('status'); }
  get question() { return this.addCommunityPollForm.get('question'); }
  get responses() { return this.addCommunityPollForm.get('responses') as FormArray; }

  constructor(private store: Store<fromCommunityPollReducer.State>, private fb: FormBuilder) {
    this.communityPollModalOpen$ = this.store.select(fromCommunityPollReducer.getCommunityPollModalOpen);
    this.communityPollListToEdit$ = this.store.select(fromCommunityPollReducer.getCommunityPollListToEdit);

   this.createForm();
  }

  pollResponseOptionsLimits(array: FormArray): ValidatorFn {
    return function() {
      const notEnoughOptions = array.length < 2 || array.length > 10 ? true : false;
      return notEnoughOptions ? {'2 or more response options required': {valid: false}} : null;
    };
  }

  ngOnInit() {

    this.communityPollListToEdit$.subscribe(poll => {
      if (poll != null) {

        this.isEditMode = true;

        this.communityPollId.setValue(poll.CommunityPollId);
        this.status.setValue(poll.Status);
        this.question.setValue(poll.Question);

        poll.ResponseOptions.forEach(ro => {
          this.responses.push(CommunityPollResponseComponent.buildItem(ro.ResponseText));
        });
      } else {
        this.isEditMode = false;
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

    const communityPollEditRequest: CommunityPollUpsertRequest = {
      CommunityPollId: this.communityPollId.value,
      Question: this.question.value,
      ResponseOptions: responseOptions,
      Status: this.status.value
    };

    if (this.isEditMode) {
        this.store.dispatch(new fromCommunityPollActions.EditingCommunityPoll(communityPollEditRequest));
    } else {
      this.store.dispatch(new fromCommunityPollActions.AddingCommunityPoll(communityPollEditRequest));
    }

  }

  handleModalDismissed(): void {
    this.attemptedSubmit = false;
    this.responses.controls = [];
    this.store.dispatch(new fromCommunityPollActions.CloseCommunityPollModal);
  }

  addResponseOption() {
    this.responses.push(CommunityPollResponseComponent.buildItem(''));
  }

  createForm(): void {
    this.addCommunityPollForm = this.fb.group({
      'communityPollId': [''],
      'question': ['', [PfValidators.required]],
      'status': [0],
      'responses': this.fb.array([])
    });
  }

  getTitle(): string {
    if (this.isEditMode) {
      return 'Edit Poll';
    } else {
      return 'New Poll';
    }
  }

}
