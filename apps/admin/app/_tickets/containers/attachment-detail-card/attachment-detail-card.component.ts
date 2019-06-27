import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import {UserTicketAttachmentDeleteRequest} from 'libs/models/payfactors-api/service/request';

import * as fromTicketAttachmentActions from '../../actions/ticket-attachment.actions';
import { TicketAttachment } from '../../models';
import * as fromTicketAdminReducer from '../../reducers';

@Component({
  selector: 'pf-attachment-detail-card',
  templateUrl: './attachment-detail-card.component.html',
  styleUrls: ['./attachment-detail-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttachmentDetailCardComponent implements OnInit, OnDestroy {
  @Input() ticketAttachments: TicketAttachment[];
  @Input() ticketId: number;
  public deleteRequest: UserTicketAttachmentDeleteRequest;
  deletingAttachmentModalOpen$: Observable<boolean>;
  private unsubscribe$ = new Subject();

  constructor(private store: Store<fromTicketAdminReducer.State>) {}

  ngOnInit() {
    this.deletingAttachmentModalOpen$ = this.store.select(fromTicketAdminReducer.getAttachmentDeleteModalOpen);
    this.deletingAttachmentModalOpen$.pipe(
      takeUntil(this.unsubscribe$),
      filter(v => !v)
    ).subscribe(() => {
      this.deleteRequest = null;
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  canModalOpen() {
    return this.deleteRequest != null;
  }

  openModal(userTicketsFileId: number) {
    this.deleteRequest = {
      UserTicketId: this.ticketId,
      UserTicketsFileId: userTicketsFileId
    };
    setTimeout(() => {
      this.store.dispatch(new fromTicketAttachmentActions.DeleteAttachmentModalOpen());
    }, 0);
  }
}
