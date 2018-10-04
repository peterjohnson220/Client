import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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

  addingCommunityUserPollSuccess$: Observable<boolean>;
  addingCommunityUserPollSuccessSubscription: Subscription;

  @Input() public communityPollForm: FormGroup;
  @Input() public enableEditingResponseOptions = true;
  @Input() public isAdmin = false;

  maxTextLength = 250;
  maxChoices = 5;
  attemptedSubmit = false;
  pollLengthDays: Number[];
  pollLengthHours: Number[];

  get context() { return this.communityPollForm.get('context'); }
  get choices() { return this.communityPollForm.get('choices') as FormArray; }
  get days() { return this.communityPollForm.get('days'); }
  get hours() { return this.communityPollForm.get('hours'); }
  get isFormValid() { return this.communityPollForm.valid; }

  pollResponseOptionsLimits(array: FormArray): ValidatorFn {
    return function() {
      const notEnoughOptions = array.length < 2 || array.length > 10 ? true : false;
      return notEnoughOptions ? {'2 or more response options required': {valid: false}} : null;
    };
  }

  constructor(public store: Store<fromCommunityPostReducer.State>,
    private formBuilder: FormBuilder) {
      this.addingCommunityUserPollSuccess$ = this.store.select(fromCommunityPostReducer.getAddingCommunityDiscussionPollSuccess);
      this.buildForm();
  }

  ngOnInit() {
    if (!this.isAdmin && this.choices.controls.length <= 0) {
      this.choices.push(CommunityPollChoicesComponent.buildItem(''));
      this.choices.push(CommunityPollChoicesComponent.buildItem(''));
    }
    this.choices.setValidators(this.pollResponseOptionsLimits(this.choices));

    this.pollLengthDays = Array.from({length: 14}, (v, k) => k + 1);
    this.pollLengthHours = Array.from({length: 24}, (v, k) => k + 1);

    this.addingCommunityUserPollSuccessSubscription = this.addingCommunityUserPollSuccess$.subscribe((response) => {
      if (response) {
          this.communityPollForm.reset({ value: 'formState'});
      }
    });
  }

  ngOnDestroy() {
    if (this.addingCommunityUserPollSuccessSubscription) {
      this.addingCommunityUserPollSuccessSubscription.unsubscribe();
    }
  }

  buildForm() {
    this.communityPollForm = this.formBuilder.group({
      'communityPollId': [''],
      'context': ['', [Validators.required, Validators.minLength(1), Validators.maxLength(this.maxTextLength)]],
      'status': [0],
      'choices': this.formBuilder.array([]),
      'days':  this.pollLengthDays,
      'hours': this.pollLengthHours
    });
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

}
