import { Component, Input, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromOrgDataFieldMappingsReducer from '../../reducers';
import * as fromOrgDataFieldMappingsActions from '../../actions/org-data-field-mappings.actions';
import * as fromSftpActions from '../../actions/sftp-user.actions';

@Component({
  selector: 'pf-sftp-cred-delete-modal',
  templateUrl: './sftp-cred-delete-modal.component.html'
})
export class SftpCredtDeleteModalComponent implements OnInit {
  @Input()
  public companyId: number;
  public isDeleteingSftpCreds$: Observable<boolean>;
  public isModalOpen$: Observable<boolean>;
  public hasDeleteError$: Observable<boolean>;
  public hasDeleteSuccess$: Observable<boolean>;

  constructor(private store: Store<fromOrgDataFieldMappingsReducer.State>) { }

  ngOnInit() {
    this.isDeleteingSftpCreds$ = this.store.select(fromOrgDataFieldMappingsReducer.getIsDeleteingSftpCreds);
    this.isModalOpen$ = this.store.select(fromOrgDataFieldMappingsReducer.getIsDeleteModalOpen);
    this.hasDeleteError$ = this.store.select(fromOrgDataFieldMappingsReducer.getDeleteSftpCredsError);
    this.hasDeleteSuccess$ = this.store.select(fromOrgDataFieldMappingsReducer.getDeleteSftpCredsSuccess);

    this.hasDeleteSuccess$.subscribe(f => {
      if (f && f === true) {
        this.store.dispatch(new fromOrgDataFieldMappingsActions.DeleteSftpCredsModalOpen(false));
      }
    });
  }

  handleDeleteConfirmed() {
    this.store.dispatch(new fromSftpActions.DeleteSftpCreds(this.companyId));
  }

  handleDeleteDenied() {
    this.store.dispatch(new fromOrgDataFieldMappingsActions.DeleteSftpCredsModalOpen(false));
  }
}
