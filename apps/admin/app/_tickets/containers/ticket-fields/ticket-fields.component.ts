import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges
} from '@angular/core';

import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, flatMap, map, takeUntil } from 'rxjs/operators';
import orderBy from 'lodash/orderBy';
import cloneDeep from 'lodash/cloneDeep';

import { UserApiService } from 'libs/data/payfactors-api/user';
import { TicketValuePickerComponent } from '../index';

import { PayfactorsApiModelMapper } from '../../helpers';
import * as fromTicketReducer from '../../reducers';
import { PfServicesRep, TicketDetail, UserTicketState, UserTicketType } from '../../models';
import { TicketFieldType } from '../../constants/tickets-constants';

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
  userTicketTypes$: Observable<UserTicketType[]>;

  pfServicesReps: PfServicesRep[] = [];
  userTicketTypes: UserTicketType[] = [];
  userTicketStates: UserTicketState[] = [];

  public ticketFieldType = TicketFieldType;
  public selectedPfServicesRep: PfServicesRep;

  private companySubscription$ = new Subscription();

  private companyId$ = new BehaviorSubject<number>(0);
  private ticketState$ = new BehaviorSubject<string>(null);
  private ticketType$ = new BehaviorSubject<string>(null);
  private unsubscribe$ = new Subject();

  constructor(private store: Store<fromTicketReducer.State>,
    private userApiService: UserApiService,
    private ref: ChangeDetectorRef) {
    this.lookupsLoading$ = this.store.select(fromTicketReducer.getLookupLoading);
    this.lookupsLoadingError$ = this.store.select(fromTicketReducer.getLookupLoadingError);
    this.userTicketStates$ = this.store.select(fromTicketReducer.getUserTicketStates);
    this.userTicketTypes$ = this.store.select(fromTicketReducer.getUserTicketTypes);
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
        this.ref.markForCheck();
      });

    this.userTicketStates$
      .pipe(
        filter(v => v && v.length > 0),
        takeUntil(this.unsubscribe$)
      ).subscribe(v => {
        this.userTicketStates = v;
        this.ref.markForCheck();
      });

    this.userTicketTypes$
      .pipe(
        filter(v => v && v.length > 0),
        takeUntil(this.unsubscribe$)
      ).subscribe(v => {
        this.userTicketTypes = v;
        this.ref.markForCheck();
      });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.ticket.previousValue || changes.ticket.previousValue.CompanyId !== changes.ticket.currentValue.CompanyId) {
      this.companyId$.next(changes.ticket.currentValue.CompanyId);
    }
    if (!changes.ticket.previousValue || changes.ticket.previousValue.TicketStatus !== changes.ticket.currentValue.TicketStatus) {
      this.ticketState$.next(changes.ticket.currentValue.TicketState);
    }
    if (!changes.ticket.previousValue || changes.ticket.previousValue.UserTicketType.TicketTypeDisplayName
      !== changes.ticket.currentValue.UserTicketType.TicketTypeDisplayName) {

      this.ticketType$.next(changes.ticket.currentValue.UserTicketType.TicketTypeDisplayName);
    }
  }

  getSelectedUserState(value: string): UserTicketState {
    return this.userTicketStates.find(f => f.UserTicketState === value);
  }

  getSelectedUserType(value: string): UserTicketType {
    return this.userTicketTypes.find(f => f.TicketTypeDisplayName === value);
  }

  getSelectedServiceRep(value: number): PfServicesRep {
    return this.pfServicesReps.find(f => f.PfServicesRepId === value);
  }

  ngOnDestroy(): void {
    this.companyId$.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
    this.companySubscription$.unsubscribe();
    this.ticketState$.unsubscribe();
    this.ticketType$.unsubscribe();
  }
}
