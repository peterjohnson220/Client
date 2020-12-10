import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ErrorEvent, FileRestrictions, SelectEvent, SuccessEvent } from '@progress/kendo-angular-upload';

import { PfValidators } from 'libs/forms/validators';
import { UserProfile } from 'libs/models/user-profile';
import { AsyncStateObj } from 'libs/models/state';

import * as fromUserSettingsReducer from '../../../reducers';
import * as fromUserProfileActions from '../../../actions/user-profile.actions';

@Component({
  selector: 'pf-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  cloudFilesPublicBaseUrl$: Observable<string>;
  userProfile$: Observable<AsyncStateObj<UserProfile>>;

  userProfileSubscription: Subscription;

  userProfileForm: FormGroup;
  userId: number;
  userPicture: string;
  saving: boolean;
  savingSuccess: boolean;
  savingError: boolean;
  userPictureErrorMessage: string;

  readonly defaultUserPicture = 'default_user.png';
  readonly invalidFileExtensionMessage = 'File type not valid. File must be type jpg, jpeg, or png.';
  readonly invalidFileSizeMessage = 'File is over the size limit of 10Mb.';
  readonly nameMaxLength = 50;
  readonly titleMaxLength = 255;
  uploadRestrictions: FileRestrictions = {
    allowedExtensions: ['.jpg', '.png', '.jpeg'],
    maxFileSize: 10485760
  };

  constructor(
    private store: Store<fromUserSettingsReducer.State>,
    private formBuilder: FormBuilder
  ) {
    this.cloudFilesPublicBaseUrl$ = this.store.pipe(select(fromUserSettingsReducer.getCloudFilesPublicBaseUrl));
    this.userProfile$ = this.store.pipe(select(fromUserSettingsReducer.getUserProfile));
    this.createForm();
  }

  ngOnInit(): void {
    this.userProfileSubscription = this.userProfile$.subscribe((userProfileAsync) => {
      this.saving = userProfileAsync?.saving;
      this.savingError = userProfileAsync?.savingError;
      this.savingSuccess = userProfileAsync?.savingSuccess;
      if (!this.saving && userProfileAsync?.obj) {
        this.userId = userProfileAsync.obj.UserId;
        this.userPicture = userProfileAsync.obj.UserPicture;
        this.updateForm(userProfileAsync.obj);
      }
    });
  }

  ngOnDestroy(): void {
    this.userProfileSubscription.unsubscribe();
  }

  get formControls() { return this.userProfileForm.controls; }

  get submitDisabled(): boolean {
    if (!this.userProfileForm) {
      return this.saving;
    }

    return this.saving || !this.userProfileForm.valid || !(this.userProfileForm.dirty || this.userProfileForm.touched)
      || !!this.userPictureErrorMessage;
  }

  handleSaveClicked(): void {
    const updatedUserProfile: UserProfile = this.userProfileForm.value;
    updatedUserProfile.UserId = this.userId;
    updatedUserProfile.UserPicture = this.userPicture;

    this.store.dispatch(new fromUserProfileActions.SaveUserProfile(updatedUserProfile));
  }

  handleFileSelect(event: SelectEvent): void {
    const selectedFile = event?.files?.length ? event.files[0] : null;
    if (selectedFile) {
      const validationError = selectedFile.validationErrors?.length ? selectedFile.validationErrors[0] : '';
      this.userPictureErrorMessage = this.getInvalidUploadMessage(validationError);
    }
  }

  handleFileUploadSuccess(event: SuccessEvent): void {
    this.userPicture = event.files?.length > 0 ? event.files[0].name : '';
  }

  handleFileUploadError(event: ErrorEvent): void {
    this.userPictureErrorMessage = 'Error uploading photo';
  }

  private createForm(): void {
    this.userProfileForm = this.formBuilder.group({
      FirstName: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.nameMaxLength)]],
      LastName: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.nameMaxLength)]],
      EmailAddress: [''],
      Title: ['', [PfValidators.required, PfValidators.maxLengthTrimWhitespace(this.titleMaxLength)]],
      UserPicture: ['']
    });
  }

  private updateForm(userProfile: UserProfile): void {
    if (!!userProfile && !!this.userProfileForm) {
      this.userId = userProfile.UserId;
      this.userPicture = userProfile.UserPicture;

      this.userProfileForm.patchValue({
        FirstName: userProfile.FirstName,
        LastName: userProfile.LastName,
        EmailAddress: userProfile.EmailAddress,
        Title: userProfile.Title,
        UserPicture: userProfile.UserPicture
      });

      this.userProfileForm.markAsPristine();
      this.userProfileForm.markAsUntouched();
    }
  }

  private getInvalidUploadMessage(errorMessage: string): string {
    if (errorMessage === 'invalidFileExtension') {
      return this.invalidFileExtensionMessage;
    }
    if (errorMessage === 'invalidMaxFileSize') {
      return this.invalidFileSizeMessage;
    }
    return '';
  }

}
