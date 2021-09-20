import { Component, ViewChild, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareJobEmail } from '../../../models';

import { JobDescriptionSharingService } from './../../../services';

import * as fromAppNotificationsMainReducer from 'libs/features/infrastructure/app-notifications/reducers';
import * as fromAppNotificationsActions from 'libs/features/infrastructure/app-notifications/actions/app-notifications.actions';
import { NotificationLevel, NotificationSource, NotificationType } from 'libs/features/infrastructure/app-notifications/models';
import { Store } from '@ngrx/store';

@Component({
  selector: 'pf-share-job-description-modal',
  templateUrl: 'share-job-description-modal.component.html',
  styleUrls: ['./share-job-description-modal.scss']
})

// * This component is the modal for sharing job descriptions
export class ShareJobDescriptionModalComponent implements OnInit {

  @Input() selectedJobDescriptions: Map<number, any>;

  @ViewChild('shareJobDescriptionModal', { static : true }) public shareJobDescriptionModal: any;
  emailList: ShareJobEmail[];
  nonPfUserFormSubmitted: boolean;
  nonPfUserSameStepDuplicateEmail: boolean;
  nonPfUserSameStepFormSubmitted: boolean;
  addNonPfUserForm: FormGroup;
  showNameForm: boolean;
  currentEmail: ShareJobEmail;
  
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private jobDescriptionSharingService: JobDescriptionSharingService ,
    private notificationStore: Store<fromAppNotificationsMainReducer.State>,

  ) {
    this.emailList = [];
    this.currentEmail = <ShareJobEmail>{};
  }

  ngOnInit(): void {
    this.jobDescriptionSharingService.init();
    this.buildNonPfUserForm();
  }

  // Opens the modal
  open(): void {
    this.currentEmail = <ShareJobEmail>{};
    this.emailList = [];
    this.addNonPfUserForm.reset();
    this.modalService.open(this.shareJobDescriptionModal, { backdrop: 'static', windowClass: 'share-job-description-modal' });
  }

  // Maybe could add a store action saying modal is closed in the future
  close(): void {
    this.modalService.dismissAll();
    this.currentEmail = <ShareJobEmail>{};
    this.emailList = [];
  }

  // Handles when an email is selected from the picker
  handlePickerSelection(selectedEmails: ShareJobEmail[]): void {
    const len = selectedEmails.length - 1;
    if (selectedEmails.length > 0 && (!selectedEmails[len].FirstName || !selectedEmails[len].LastName)) {
      this.addNonPfUserForm.reset();
      this.nonPfUserFormSubmitted = false;
      this.showNameForm = true;
      this.currentEmail.EmailAddress = selectedEmails[len].EmailAddress;
      // Small hack to get around the race condition of the firstname input showing and focus not being set
      setTimeout(() => document.getElementById('showNameFormFirstName').focus(), 200);
    }
  }

  // Handles when the non pf user form is submitted, checks for validity
  nonPfUserFormSubmit(): void {
    this.nonPfUserFormSubmitted = true;
    if (this.addNonPfUserForm.valid) {
      this.currentEmail.FirstName = this.addNonPfUserForm.value.firstname;
      this.currentEmail.LastName = this.addNonPfUserForm.value.lastname;
      this.emailList[this.emailList.length - 1] = this.currentEmail;
      this.currentEmail = <ShareJobEmail>{};
      this.showNameForm = false;
      // Small hack to reset focus back to the multi picker
      setTimeout(() => document.getElementById('multi-search-input').focus(), 200);
    }
  }

  // hides the non pf user form, and removes the added email address if cacncel button is selected
  cancelNonPfUserAdd(): void {
    this.showNameForm = false;
    this.emailList.pop();
    this.currentEmail = <ShareJobEmail>{};
    setTimeout(() => document.getElementById('multi-search-input').focus(), 200);
  }

  shareEmailList(): void {
    const res = this.jobDescriptionSharingService.sendEmails(this.selectedJobDescriptions, this.emailList);
    res.subscribe(response => {
      const level = response.status === 200 ? NotificationLevel.Success : NotificationLevel.Error;
      const message = response.status === 200 ? `${this.selectedJobDescriptions.size} Job description${this.selectedJobDescriptions.size > 1 ? 's' : ''} shared successfully` : `Failed to share job description${this.selectedJobDescriptions.size > 1 ? 's' : ''}`
      const notification = {
        NotificationId: '',
        Level: level,
        From: NotificationSource.GenericNotificationMessage,
        Payload: {
          Title: 'Job Description Manager',
          Message: message
        },
        EnableHtml: true,
        Type: NotificationType.Event
      };
      this.notificationStore.dispatch(new fromAppNotificationsActions.AddNotification(notification));
    })
    this.modalService.dismissAll();
  }

  private buildNonPfUserForm() {
    this.addNonPfUserForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required]
    });
  }
}
