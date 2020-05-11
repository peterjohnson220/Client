import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { SftpUserModel } from 'libs/models/Sftp';

import { ACCEPTED_FILE_EXTENSIONS } from '../../constants/public-key-filename-constants';
import * as fromSftpUserActions from '../../actions/sftp-user.actions';
import * as fromOrgDataAutoloaderReducer from '../../reducers';

@Component({
  selector: 'pf-public-key-auth',
  templateUrl: './public-key-auth.component.html',
  styleUrls: ['./public-key-auth.component.scss']
})
export class PublicKeyAuthComponent implements OnInit, OnDestroy {
  @Input() SftpUser: SftpUserModel;
  @Input() CompanyId: number;

  validatingUserName$: Observable<boolean>;
  isUserNameValid$: Observable<boolean>;
  private unsubscribe$ = new Subject();

  username: string;
  showFileUpload = false;
  fileUploadMessage: string;
  acceptedFileExtensions = ACCEPTED_FILE_EXTENSIONS;
  isUserNameValid: boolean = null;

  constructor(private store: Store<fromOrgDataAutoloaderReducer.State>) {
    this.validatingUserName$ = this.store.select(fromOrgDataAutoloaderReducer.getValidatingUserName);
    this.isUserNameValid$ = this.store.select(fromOrgDataAutoloaderReducer.getIsUserNameValid);
  }

  ngOnInit(): void {
    this.isUserNameValid$
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(isValid => {
      this.isUserNameValid = isValid;
      if (isValid) {
        this.store.dispatch(new fromSftpUserActions.SetSftpUsername(this.username));
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
  }

  handleFileInput($event: any) {
    this.fileUploadMessage = '';

    const files: File[] = $event.target.files;
    this.store.dispatch(new fromSftpUserActions.SetSftpPublicKey(files[0]));
  }

  setUserName() {
    this.store.dispatch(new fromSftpUserActions.ValidateUsername({userName: this.username, companyId: this.CompanyId}));
  }

  toggleFileUpload() {
    this.showFileUpload = !this.showFileUpload;
  }
}
