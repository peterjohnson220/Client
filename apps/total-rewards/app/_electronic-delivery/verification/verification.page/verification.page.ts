import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as signalR from '@microsoft/signalr';
import { LogLevel } from '@microsoft/signalr';

import { UserContext } from 'libs/models/security';
import { AsyncStateObj } from 'libs/models/state';
import { EmployeeRewardsData, TokenStatus } from 'libs/models/payfactors-api/total-rewards';
import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import * as fromRootState from 'libs/state/state';
import { AppNotification, HubMethodName, NotificationLevel, SuccessStatusPayLoad } from 'libs/features/app-notifications/models';

import * as fromPageReducer from '../../verification/reducers';
import * as fromPageActions from '../actions/verification.page.actions';

@Component({
  selector: 'pf-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss']
})
export class VerificationPageComponent implements OnInit, OnDestroy {
  @ViewChildren('inputToFocus') inputToFocus: QueryList<ElementRef>;

  userContext$: Observable<UserContext>;
  employeeData$: Observable<EmployeeRewardsData>;
  statement$: Observable<Statement>;
  isValidating$: Observable<boolean>;
  resent$: Observable<boolean>;
  tokenStatus$: Observable<AsyncStateObj<TokenStatus>>;
  lockedUntil$: Observable<Date>;
  notificationsToken$: Observable<string>;
  downloadingPdf$: Observable<boolean>;

  lockedUntilSub: Subscription;
  userContextSub: Subscription;
  notificationsTokenSub: Subscription;

  notificationsHubUrl: string;

  readonly VERIFICATION_CODE_LENGTH = 6;
  tokenStatus = TokenStatus;
  currentYear = new Date().getFullYear();
  lockedUntil: Date;
  verificationCode: string;
  notificationConnected = false;

  constructor(private store: Store<fromPageReducer.State>) {
    this.userContext$ = this.store.select(fromRootState.getUserContext);
    this.employeeData$ = this.store.select(fromPageReducer.getEmployeeData);
    this.statement$ = this.store.select(fromPageReducer.getStatement);
    this.tokenStatus$ = this.store.select(fromPageReducer.getTokenStatusAsync);
    this.isValidating$ = this.store.select(fromPageReducer.getIsValidating);
    this.resent$ = this.store.select(fromPageReducer.getResent);
    this.lockedUntil$ = this.store.select(fromPageReducer.getLockedUntil);
    this.notificationsToken$ = this.store.select(fromPageReducer.getNotificationsToken);
    this.downloadingPdf$ = this.store.select(fromPageReducer.getDownloadingPdf);
  }

  ngOnInit(): void {
    this.store.dispatch(new fromPageActions.RequestToken({resend: false, suppressEmail: false}));
    this.lockedUntilSub = this.lockedUntil$.subscribe(x => {
      if (!!x) {
        this.lockedUntil = new Date(x);
      }
    });
    this.userContextSub = this.userContext$.subscribe(userContext => {
      const baseUrl = userContext?.ConfigSettings?.find(c => c.Name === 'SignalR').Value;
      const signalREnabled = userContext?.ConfigSettings?.find(c => c.Name === 'SignalREnabled').Value;
      if (signalREnabled === 'true' && !!baseUrl) {
        this.notificationsHubUrl = `${baseUrl}/notifications`;
      }
    });
    this.notificationsTokenSub = this.notificationsToken$.subscribe(token => {
      if (!!token && !!this.notificationsHubUrl) {
        this.initHubConnection(token);
      }
    });
  }

  ngOnDestroy() {
    this.lockedUntilSub.unsubscribe();
  }

  validateCode(): void {
    this.store.dispatch(new fromPageActions.ValidateToken(this.verificationCode));
  }

  resend(): void {
    this.store.dispatch(new fromPageActions.RequestToken({resend: true, suppressEmail: false}));
  }

  startStatementDownload(): void {
    this.store.dispatch(new fromPageActions.StartDownloadPdf());
  }

  get lockedUntilTimeLeft(): number {
    const currentDate = new Date();
    return this.differenceInMinutes(currentDate, this.lockedUntil) !== 0 ?
    this.differenceInMinutes(currentDate, this.lockedUntil) : 1;
  }

  private differenceInMinutes(firstDate: Date, secondDate: Date): number {
    let diff = (secondDate.getTime() - firstDate.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }

  private initHubConnection(accessToken: string): void {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(this.notificationsHubUrl, { accessTokenFactory: () => accessToken })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Critical)
      .build();
    const that = this;
    connection.start().then(function () {
      // connected
      that.notificationConnected = true;
    });

    connection.on(HubMethodName.ReceiveNotification, (notification: AppNotification<any>) => {
      console.log(notification);
      if (notification.Level === NotificationLevel.Success) {
        const successPayload = notification.Payload as SuccessStatusPayLoad;
        if (!!successPayload?.ExportedViewLink) {
          that.store.dispatch(new fromPageActions.DownloadPdfSuccess(successPayload.ExportedViewLink));
        }
      } else if (notification.Level === NotificationLevel.Error) {
        that.store.dispatch(new fromPageActions.DownloadPdfError());
      }
    });
  }
}
