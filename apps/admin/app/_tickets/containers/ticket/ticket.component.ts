import { Component, Input, OnDestroy, OnInit} from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import {PayfactorsApiModelMapper} from '../../helpers';
import * as fromTicketActions from '../../actions/ticket.actions';
import * as fromTicketReducer from '../../reducers';
import {PfServicesRep, UserTicketItem, UserTicketState, UserTicketType} from '../../models';

@Component({
  selector: 'pf-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit, OnDestroy {
  @Input() ticketId: number;

  ticket: UserTicketItem;

  ticketSubscription: Subscription;

  constructor(private store: Store<fromTicketReducer.State>) {
    this.ticketLoading$ = this.store.select(fromTicketReducer.getTicketLoading || fromTicketReducer.getCompanyDetailLoading);
    this.ticketLoadingError$ = this.store.select(fromTicketReducer.getTicketLoadingError || fromTicketReducer.getCompanyDetailLoadingError);
    this.ticket$ = this.store.select(fromTicketReducer.getUserTicket);

    this.ticketSubscription = this.ticket$.subscribe((userTicketResponse) => {
      if (userTicketResponse && userTicketResponse.TicketInfo.TicketId === this.ticketId) {
        this.ticket = userTicketResponse;
      }
    });
  }

  ticketLoading$: Observable<boolean>;
  ticketLoadingError$: Observable<boolean>;
  ticket$: Observable<UserTicketItem>;

  handleTicketReload() {
    this.store.dispatch(new fromTicketActions.LoadTicket(this.ticketId));
  }

  ngOnInit() {
    this.store.dispatch(new fromTicketActions.InitializeTicketTab(this.ticketId));
  }

  ngOnDestroy() {
    this.ticketSubscription.unsubscribe();
  }

  fieldChange(event: any) {
    let changed = false;
    const changedFields = [];
    const ticket = { ...this.ticket.TicketInfo };
    switch (event.source) {
      case 'assigned': {
        changed = true;
        const v = event.value as PfServicesRep;
        ticket.ServicesUserId = v.PfServicesRepId;
        changedFields.push('ServicesUserId');
        break;
      }
      case 'type': {
        changed = true;
        const v = event.value as UserTicketType;
        ticket.UserTicketType = {
          UserTicketTypeId: 0,
          TicketCssClass: null,
          SortOrder: 0,
          TicketTypeName: v.TicketTypeName,
          TicketSubTypeName: v.TicketSubTypeName,
          TicketTypeDisplayName: v.TicketTypeDisplayName
        };
        changedFields.push('UserTicketType', 'FileType');
        break;
      }
      case 'status': {
        changed = true;
        const v = event.value as UserTicketState;
        ticket.TicketState = v.UserTicketState;
        changedFields.push('UserTicketState');
        break;
      }
    }
    if (changed) {
      const dto = PayfactorsApiModelMapper.mapTicketDetailToUserTicketDto(ticket);
      this.store.dispatch(new fromTicketActions.UpdateTicket({
        UserTicket: dto,
        UpdateFields: changedFields
      }));
    }
  }
}
