import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { SftpUserModel } from 'libs/models/Sftp';

import { ACCEPTED_FILE_EXTENSIONS } from '../../constants/public-key-filename-constants';
import * as fromSftpUserActions from '../../actions/sftp-user.actions';
import * as fromOrgDataAutoloaderReducer from '../../reducers';
import { FileRestrictions } from '@progress/kendo-angular-upload';

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
  userNameChanged: Subject<string> = new Subject<string>();
  private unsubscribe$ = new Subject();

  username: string;
  showFileUpload = false;
  acceptedFileExtensions = ACCEPTED_FILE_EXTENSIONS;
  isUserNameValid: boolean = null;
  fileRestrictions: FileRestrictions;

  constructor(private store: Store<fromOrgDataAutoloaderReducer.State>) {
    this.fileRestrictions = {
      allowedExtensions: ACCEPTED_FILE_EXTENSIONS
    };
    this.validatingUserName$ = this.store.select(fromOrgDataAutoloaderReducer.getValidatingUserName);
    this.isUserNameValid$ = this.store.select(fromOrgDataAutoloaderReducer.getIsUserNameValid);

    this.userNameChanged
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(value => {
        this.username = value;
        this.setUserName();
      });
  }

  ngOnInit(): void {
    this.isUserNameValid$
      .pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(isValid => {
      this.isUserNameValid = isValid;
      if (isValid) {
        this.store.dispatch(new fromSftpUserActions.SetSftpUsername(this.username));
      } else {
        this.store.dispatch(new fromSftpUserActions.SetSftpUsername(null));
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
  }

  handleFileInput($event: any) {
    const files: File[] = $event.files;
    this.store.dispatch(new fromSftpUserActions.SetSftpPublicKey(files[0]));
  }

  setUserName() {
    if (!this.username || this.username.length === 0) {
      this.store.dispatch(new fromSftpUserActions.SetSftpUsername(''));
    } else {
      this.store.dispatch(new fromSftpUserActions.ValidateUsername({userName: this.username, companyId: this.CompanyId}));
    }
  }

  handleUserNameChange(value: string) {
    this.userNameChanged.next(value);
  }

  toggleFileUpload() {
    this.showFileUpload = !this.showFileUpload;
  }

  handleFileClear() {
    this.store.dispatch(new fromSftpUserActions.SetSftpPublicKey(null));
  }
}
