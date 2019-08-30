import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription, of } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';


import * as fromTicketSharedReducer from '../../reducers/';
import * as fromTicketSharedActions from '../../actions/ticket-shared.actions';


@Component({
  selector: 'pf-client-detail-modal',
  templateUrl: './client-detail-modal.component.html',
  styleUrls: ['./client-detail-modal.component.scss']
})
export class ClientDetailModalComponent implements OnDestroy, OnInit {

  ticketId: number;
  userInfo$: Observable<any>;
  isLoading$: Observable<boolean>;
  userInfo: any;
  isUserDetailOpen$: Observable<boolean>;
  openSubscription: Subscription;
  userInfoSub: Subscription;

  private unsubscribe$ = new Subject();
  hasLoadError$: Observable<boolean>;

  constructor(
    private store: Store<fromTicketSharedReducer.State>) {

    this.isUserDetailOpen$ = this.store.select(fromTicketSharedReducer.getUserDetailModalOpen);
    this.userInfo$ = this.store.select(fromTicketSharedReducer.getUserDetail);
    this.isLoading$ = this.store.select(fromTicketSharedReducer.isLoadingUserDetial);
    this.hasLoadError$ = this.store.select(fromTicketSharedReducer.hasLoadingError);
  }


  ngOnInit(): void {
    this.userInfoSub = this.userInfo$.pipe(
      filter(v => v),
      takeUntil(this.unsubscribe$)
    ).subscribe(ui => {
      this.userInfo = ui.userDetails;
      this.ticketId = ui.ticketId;
    });

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }

  onDismiss() {
    this.store.dispatch(new fromTicketSharedActions.GetUserDetailSuccess(null, -1));
    this.store.dispatch(new fromTicketSharedActions.UserDetailOpen(false));
  }
}
