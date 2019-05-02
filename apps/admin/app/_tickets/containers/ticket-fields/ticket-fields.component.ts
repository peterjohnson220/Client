import {
    ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges
} from '@angular/core';

import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, flatMap, map, takeUntil } from 'rxjs/operators';

import { UserApiService } from 'libs/data/payfactors-api/user';

import { PayfactorsApiModelMapper } from '../../helpers';
import * as fromTicketReducer from '../../reducers';
import {PfServicesRep, TicketDetail, UserTicketState} from '../../models';

@Component({
  selector: 'pf-ticket-fields',
  templateUrl: './ticket-fields.component.html',
  styleUrls: ['./ticket-fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketFieldsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() ticket: TicketDetail;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();
  lookupsLoading$: Observable<boolean>;
  lookupsLoadingError$: Observable<boolean>;
  userTicketStates$: Observable<UserTicketState[]>;
  pfServicesReps: PfServicesRep[] = [];
  public selectedPfServicesRep: PfServicesRep;
  public selectedUserTicketState: UserTicketState;
  private companySubscription$ = new Subscription();
  private userTicketSubscription$ = new Subscription();
  private companyId$ = new BehaviorSubject<number>(0);
  private ticketState$ = new BehaviorSubject<string>(null);
  private unsubscribe$ = new Subject();

  constructor(private store: Store<fromTicketReducer.State>,
              private userApiService: UserApiService,
              private ref: ChangeDetectorRef) {
    this.lookupsLoading$ = this.store.select(fromTicketReducer.getLookupLoading);
    this.lookupsLoadingError$ = this.store.select(fromTicketReducer.getLookupLoadingError);
    this.userTicketStates$ = this.store.select(fromTicketReducer.getUserTicketStates);
  }

  ngOnInit() {
    this.configureSubscriptions();
  }

  configureSubscriptions() {
    this.companySubscription$ = this.companyId$
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(v => v && v > 0),
        debounceTime(250),
        distinctUntilChanged(),
        flatMap(v => {
          return this.userApiService.getPfServiceRepsByCompany(v);
        }),
        map(v => {
          return PayfactorsApiModelMapper.mapUserResponseToPfServicesRep(v);
        })
      )
      .subscribe(v => {
        this.pfServicesReps = v;
        if (this.ticket && this.ticket.ServicesUserId) {
          const match = v.find(e => Math.abs(e.PfServicesRepId) === this.ticket.ServicesUserId);
          if (match) {
            this.selectedPfServicesRep = match;
            this.ref.markForCheck();
          }
        }
      });

    this.userTicketSubscription$ = this.ticketState$
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(v => v && v.length > 0),
        debounceTime(250),
        distinctUntilChanged(),
        flatMap(v => {
          return this.userTicketStates$;
        })
      )
      .subscribe(v => {
        if (this.ticket && this.ticket.TicketState) {
          const match = v.find(e => e.UserTicketState === this.ticket.TicketState);
          if (match) {
            this.selectedUserTicketState = match;
            this.ref.markForCheck();
          }
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.ticket.previousValue || changes.ticket.previousValue.CompanyId !== changes.ticket.currentValue.CompanyId) {
      this.companyId$.next(changes.ticket.currentValue.CompanyId);
    }
    if (!changes.ticket.previousValue || changes.ticket.previousValue.TicketStatus !== changes.ticket.currentValue.TicketStatus) {
      this.ticketState$.next(changes.ticket.currentValue.TicketState);
    }
  }

  public comboValueChanged(value: any, source: string): void {
    if (value) {
      if (source === 'assigned') {
        value.PfServicesRepId = Math.abs(value.PfServicesRepId);
      }
      this.valueChange.emit({
        value: value,
        source: source
      });
    }
  }

  ngOnDestroy(): void {
    this.companyId$.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
    this.companySubscription$.unsubscribe();
    this.ticketState$.unsubscribe();
    this.userTicketSubscription$.unsubscribe();
  }
}
