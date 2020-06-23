import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';

import * as fromPageReducer from '../reducers/statement-assignment.page.reducer';
import * as fromPageActions from '../actions/statement-assignment.page.actions';
import * as fromAssignmentsModalActions from '../actions/statement-assignment-modal.actions';
import { StatementAssignmentModalComponent } from '../containers/statement-assignment-modal';

@Component({
  selector: 'pf-statement-assignment-page',
  templateUrl: './statement-assignment.page.html',
  styleUrls: ['./statement-assignment.page.scss']
})
export class StatementAssignmentPageComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(StatementAssignmentModalComponent, {static: true}) public StatementAssignmentModalComponent: StatementAssignmentModalComponent;

  routeParamSubscription$ = new Subscription();
  queryParamSubscription$ = new Subscription();

  statementId: string;
  constructor(private store: Store<fromPageReducer.State>, private route: ActivatedRoute) { }

  private setSearchContext() {
    const setContextMessage: MessageEvent = {
      data: {
        payfactorsMessage: {
          type: 'Set Context',
          payload: {}
        }
      }
    } as MessageEvent;
    this.StatementAssignmentModalComponent.onMessage(setContextMessage);
  }

  ngAfterViewInit(): void {
    this.queryParamSubscription$ = this.route.queryParams.subscribe( queryParams => {
      if (queryParams['openModal'] && (queryParams['openModal'] === '1')) {
        this.store.dispatch(new fromAssignmentsModalActions.OpenModal());
      }
    });
  }

  ngOnInit(): void {
    this.routeParamSubscription$ = this.route.params.subscribe(params => {
      if (params['id']) {
        this.statementId = params['id'];
        this.store.dispatch(new fromPageActions.SetStatementId(this.statementId));
      }
    });
    this.setSearchContext();
  }

  ngOnDestroy(): void {
    this.routeParamSubscription$.unsubscribe();
    this.queryParamSubscription$.unsubscribe();
    this.store.dispatch(new fromPageActions.ResetState());
  }

  openAssignModal(): void {
    this.setSearchContext();

    this.store.dispatch( new fromAssignmentsModalActions.OpenModal());
  }
}
