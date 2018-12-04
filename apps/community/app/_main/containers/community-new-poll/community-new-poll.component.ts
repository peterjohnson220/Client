import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, ValidatorFn, Validators, FormBuilder } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';

import { CommunityPollUpsertRequest } from 'libs/models/community/community-poll-upsert-request.model';
import { CommunityPollStatusEnum } from 'libs/models/community/community-constants.model';
import { CommunityPollChoicesComponent } from 'libs/features/community/containers/community-poll-choices/community-poll-choices.component';

import * as fromCommunityPostReducer from '../../reducers';
import * as fromCommunityPostActions from '../../actions/community-post.actions';

@Component({
  selector: 'pf-community-new-poll',
  templateUrl: './community-new-poll.component.html',
  styleUrls: ['./community-new-poll.component.scss']
})
export class CommunityNewPollComponent implements OnInit, OnDestroy {
  addingCommunityDiscussionPollSuccess$: Observable<boolean>;
  addingCommunityDiscussionPollSuccessSubscription: Subscription;

  maxTextLength = 250;
  maxChoices = 5;
  attemptedSubmit = false;
  pollLengthDays = Array.from({length: 31}, (v, k) => k);
  pollLengthHours = Array.from({length: 24}, (v, k) => k);
  displayPollLengthChoices = false;

  communityPollForm: FormGroup;
  get context() { return this.communityPollForm.get('context'); }
  get choices() { return this.communityPollForm.get('choices') as FormArray; }
  get days() { return this.communityPollForm.get('days'); }
  get hours() { return this.communityPollForm.get('hours'); }
  get status() { return this.communityPollForm.get('status'); }
  get isFormValid() { return this.communityPollForm.valid; }

  get pollLengthText() {
    let text = '';

    if (this.days.value > 0) {
      text =  this.days.value === 1 ?  this.days.value + ' day ' : this.days.value + ' days ';
    }
    if (this.hours.value > 0) {
      text += this.hours.value === 1 ? this.hours.value + ' hour' : this.hours.value + ' hours';
    }
    return text;
  }

  pollResponseOptionsLimits(array: FormArray): ValidatorFn {
    return function() {
      const notEnoughOptions = array.length < 2 || array.length > 10 ? true : false;
      return notEnoughOptions ? {'2 or more response options required': {valid: false}} : null;
    };
  }

  constructor(public store: Store<fromCommunityPostReducer.State>,
    private formBuilder: FormBuilder) {
      this.addingCommunityDiscussionPollSuccess$ = this.store.select(fromCommunityPostReducer.getAddingCommunityDiscussionPollSuccess);
      this.buildForm();
  }

  ngOnInit() {
    if (this.choices.controls.length <= 0) {
      this.choices.push(CommunityPollChoicesComponent.buildItem(''));
      this.choices.push(CommunityPollChoicesComponent.buildItem(''));
    }

    this.addingCommunityDiscussionPollSuccessSubscription = this.addingCommunityDiscussionPollSuccess$.subscribe((response) => {
      if (response) {
        this.buildForm();
      }
    });
  }

  ngOnDestroy() {
    if (this.addingCommunityDiscussionPollSuccessSubscription) {
      this.addingCommunityDiscussionPollSuccessSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.communityPollForm = this.formBuilder.group({
      'communityPollId': [''],
      'context': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(this.maxTextLength)]],
      'status': [0],
      'choices': this.formBuilder.array([]),
      'days':  [14],
      'hours': [0]
    });

    this.choices.push(CommunityPollChoicesComponent.buildItem(''));
    this.choices.push(CommunityPollChoicesComponent.buildItem(''));

    this.choices.setValidators(this.pollResponseOptionsLimits(this.choices));
  }

  addResponseOption() {
    this.choices.push(CommunityPollChoicesComponent.buildItem(''));
  }

  submit() {
    if (!this.communityPollForm.valid) {
      return;
    }

    const responseOptions = [];
    this.choices.controls.forEach(choice => {
      responseOptions.push(choice.value.response);
    });

    const communityPollRequest: CommunityPollUpsertRequest = {
      CommunityPollId: '',
      Question: this.context.value,
      ResponseOptions: responseOptions,
      Status: CommunityPollStatusEnum.Live,
      DurationInHours: this.days.value * 24 + this.hours.value
    };
    this.store.dispatch(new fromCommunityPostActions.AddingCommunityDiscussionPoll(communityPollRequest));
  }

  isPollDurationDaysZero () {
    return this.days.value <= 0;
  }

  configurePollLength () {
    this.displayPollLengthChoices = true;
  }

  onDurationDaysChange() {
    if (this.days.value === 0 && this.hours.value === 0) {
      this.hours.setValue(1);
    }
  }

}
