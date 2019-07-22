import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges
} from '@angular/core';

import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, flatMap, map, takeUntil } from 'rxjs/operators';
import { orderBy, cloneDeep } from 'lodash';

import { UserApiService } from 'libs/data/payfactors-api/user';

import { PayfactorsApiModelMapper } from '../../helpers';
import * as fromTicketReducer from '../../reducers';
import { PfServicesRep, TicketDetail, UserTicketState, UserTicketType } from '../../models';

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

  public selectedPfServicesRep: PfServicesRep;
  public selectedUserTicketState: UserTicketState;
  public selectedUserTicketType: UserTicketType;

  private companySubscription$ = new Subscription();
  private userTicketSubscription$ = new Subscription();
  private userTicketTypeSubscription$ = new Subscription();

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

    this.userTicketTypeSubscription$ = this.ticketType$
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(v => v && v.length > 0),
        debounceTime(250),
        distinctUntilChanged(),
        flatMap(v => {
          return this.userTicketTypes$;
        })
      )
      .subscribe(v => {
        if (this.ticket && this.ticket.UserTicketType) {
          this.userTicketTypes = cloneDeep(v);
          const match = this.userTicketTypes.find(e =>
            (e.TicketTypeName === this.ticket.UserTicketType.TicketTypeName && !this.ticket.UserTicketType.TicketSubTypeName)
            || (e.TicketTypeName === this.ticket.UserTicketType.TicketTypeName
              && e.TicketSubTypeName === this.ticket.UserTicketType.TicketSubTypeName));
          if (match) {
            this.selectedUserTicketType = match;
            this.ref.markForCheck();
          } else {

            const localType: UserTicketType = {
              UserTicketTypeId: this.ticket.UserTicketType.UserTicketTypeId,
              TicketFileTypeId: this.ticket.UserTicketType.TicketFileTypeId,
              TicketTypeName: this.ticket.UserTicketType.TicketTypeName,
              SortOrder: this.ticket.UserTicketType.SortOrder,
              TicketSubTypeName: this.ticket.UserTicketType.TicketSubTypeName,
              TicketTypeDisplayName: this.ticket.UserTicketType.TicketTypeDisplayName,
              TicketCssClass: this.ticket.UserTicketType.TicketCssClass
            };

            this.userTicketTypes.push(localType);
            this.userTicketTypes = orderBy(this.userTicketTypes, ['SortOrder', 'TicketSubTypeName'], 'asc');

            this.selectedUserTicketType = localType;
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
    if (!changes.ticket.previousValue || changes.ticket.previousValue.UserTicketType.TicketTypeDisplayName
      !== changes.ticket.currentValue.UserTicketType.TicketTypeDisplayName) {

      this.ticketType$.next(changes.ticket.currentValue.UserTicketType.TicketTypeDisplayName);
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
    this.ticketType$.unsubscribe();
    this.userTicketSubscription$.unsubscribe();
    this.userTicketTypeSubscription$.unsubscribe();
  }
}
