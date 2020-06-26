import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ValidatorFn } from '@angular/forms';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromCommunityPollActions from '../../actions/community-poll.actions';
import * as fromCommunityPollReducer from '../../reducers';
import * as constants from 'libs/models/community/community-constants.model';

import { PfValidators } from 'libs/forms';
import { CommunityPollList} from 'libs/models';
import { CommunityPollUpsertRequest } from 'libs/models/community/community-poll-upsert-request.model';
import { CommunityPollStatusEnum } from 'libs/models/community/community-constants.model';
import { CommunityPollChoicesComponent } from 'libs/features/community/containers/community-poll-choices/community-poll-choices.component';


@Component({
  selector: 'pf-community-poll-modal',
  templateUrl: './community-poll-modal.component.html',
  styleUrls: ['./community-poll-modal.component.scss']
})

export class CommunityPollModalComponent implements OnInit, OnDestroy {
  communityPollModalOpen$: Observable<boolean>;
  communityPollListToEdit$: Observable<CommunityPollList>;
  communityPollListToEditSubscription:  Subscription;

  addCommunityPollForm: FormGroup;
  isEditMode = false;
  enableEditingResponseOptions = true;
  attemptedSubmit = false;
  pollStatusOptions = this.CommunityPollStatuses;

  get CommunityPollStatuses() { return constants.CommunityPollStatuses; }

  get communityPollId() { return this.addCommunityPollForm.get('communityPollId'); }
  get status() { return this.addCommunityPollForm.get('status'); }
  get content() { return this.addCommunityPollForm.get('content'); }
  get choices() { return this.addCommunityPollForm.get('choices') as FormArray; }

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

    this.communityPollListToEditSubscription = this.communityPollListToEdit$.subscribe(poll => {

      this.updateStatusMode(poll);

      if (poll != null) {
        this.isEditMode = true;

        this.communityPollId.setValue(poll.CommunityPollId);
        this.status.setValue(poll.Status);
        this.content.setValue(poll.Question);

        poll.ResponseOptions.forEach(ro => {
          this.choices.push(CommunityPollChoicesComponent.buildItem(ro.ResponseText, this.enableEditingResponseOptions));
        });
      } else {
        this.isEditMode = false;
      }
    });

    this.choices.setValidators(this.pollResponseOptionsLimits(this.choices));
  }

  ngOnDestroy() {
    this.communityPollListToEditSubscription.unsubscribe();
  }

  handleFormSubmit(): void {
    this.attemptedSubmit = true;

    const responseOptions = [];

    for (let index = 0; index < this.choices.length; index++) {
      const responseOption = this.choices.at(index).get('response').value;
      responseOptions.push(responseOption);
    }

    const communityPollEditRequest: CommunityPollUpsertRequest = {
      CommunityPollId: this.communityPollId.value,
      Question: this.content.value,
      ResponseOptions: responseOptions,
      Status: this.status.value,
      Links: [],
      TopicId: ''
    };

    if (this.isEditMode) {
        this.store.dispatch(new fromCommunityPollActions.EditingCommunityPoll(communityPollEditRequest));
    } else {
      this.store.dispatch(new fromCommunityPollActions.AddingCommunityPoll(communityPollEditRequest));
    }

  }

  handleModalDismissed(): void {
    this.attemptedSubmit = false;
    this.choices.controls = [];
    this.store.dispatch(new fromCommunityPollActions.CloseCommunityPollModal);
  }

  addResponseOption() {
    this.choices.push(CommunityPollChoicesComponent.buildItem('', true));
  }

  createForm(): void {
    this.addCommunityPollForm = this.fb.group({
      'communityPollId': [''],
      'content': ['', [PfValidators.required]],
      'status': [0],
      'choices': this.fb.array([])
    });
  }

  getTitle(): string {
    if (this.isEditMode) {
      return 'Edit Poll';
    } else {
      return 'New Poll';
    }
  }

  private updateStatusMode(poll: CommunityPollList) {

    this.status.enable();
    this.content.enable();
    this.enableEditingResponseOptions = true;
    this.pollStatusOptions = this.CommunityPollStatuses;

    if (!poll) {
      return;
    }

    if (poll.Status === CommunityPollStatusEnum.Live) {
      this.content.disable();
      this.enableEditingResponseOptions = false;

      // remove DRAFT option from the menu
      this.pollStatusOptions = this.CommunityPollStatuses.filter(x => x.value !== CommunityPollStatusEnum.Draft);

    } else if (poll.Status === CommunityPollStatusEnum.Archived) {
      this.status.disable();
      this.content.disable();
      this.enableEditingResponseOptions = false;
    }
  }

}
