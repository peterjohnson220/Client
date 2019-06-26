import { Component, Input, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {UserTicketAttachmentDeleteRequest} from 'libs/models/payfactors-api/service/request';

import * as fromTicketAdminReducer from '../../reducers';
import * as fromTicketAdminAttachmentActions from '../../actions/ticket-attachment.actions';

@Component({
  selector: 'pf-attachment-delete-modal',
  templateUrl: './attachment-delete-modal.component.html',
  styleUrls: ['./attachment-delete-modal.component.scss']
})
export class AttachmentDeleteModalComponent implements OnInit {
  @Input()
  public request: UserTicketAttachmentDeleteRequest;
  public deletingAttachment$: Observable<boolean>;
  public deletingAttachmentModalOpen$: Observable<boolean>;

  constructor(private store: Store<fromTicketAdminReducer.State>) { }

  ngOnInit() {
    this.deletingAttachment$ = this.store.select(fromTicketAdminReducer.getAttachmentDeleting);
    this.deletingAttachmentModalOpen$ = this.store.select(fromTicketAdminReducer.getAttachmentDeleteModalOpen);
  }

  handleDeleteConfirmed() {
    this.store.dispatch(new fromTicketAdminAttachmentActions.DeleteAttachment(this.request));
  }

  handleDeleteDenied() {
    this.store.dispatch(new fromTicketAdminAttachmentActions.DeleteAttachmentModalClose());
  }
}
