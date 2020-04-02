import { Component, OnDestroy, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj } from 'libs/models/state';

import * as fromTransferDataPageActions from '../../../../actions/transfer-data-page.actions';
import * as fromDataManagementMainReducer from '../../../../reducers';
import { JdmView } from '../../../../models';
import { TransferDataWorkflowStep } from '../../../../data';

@Component({
    selector: 'pf-outbound-jdm-view-selection-page',
    templateUrl: './outbound-jdm-view-selection.page.html',
    styleUrls: ['./outbound-jdm-view-selection.page.scss']
  })

  export class OutboundJdmViewSelectionPageComponent implements OnInit, OnDestroy {
    unsubscribe$: Subject<boolean> = new Subject<boolean>();

    jdmViewSelectionPageLoading$: Observable<boolean>;
    jdmViewSelectionPageLoadingError$: Observable<boolean>;
    jdmViews$: Observable<AsyncStateObj<JdmView[]>>;

    jdmViews: JdmView[];

    constructor(private store: Store<fromDataManagementMainReducer.State>, private router: Router) {
      this.jdmViews$ = this.store.select(fromDataManagementMainReducer.getOutboundJdmViews);
    }

    ngOnInit() {
      this.store.dispatch(new fromTransferDataPageActions.InitOutboundJdmViewSelectionPage());

      this.jdmViews$.pipe(filter(v => !!v), takeUntil(this.unsubscribe$)).subscribe(s => {
          this.jdmViews = cloneDeep(s.obj);
      });

    }

    ngOnDestroy() {
      this.unsubscribe$.next(true);
      this.unsubscribe$.unsubscribe();
    }

    checkForSelectedJdmViews() {
      return this.jdmViews.filter(v => v.isChecked).length > 0;
    }

    cancel() {
      this.store.dispatch(new fromTransferDataPageActions.ResetOutboundTransferDataPageWorkflow());
      this.router.navigate(['/']);
    }

    next() {
      this.store.dispatch(new fromTransferDataPageActions.UpdateOutboundWorkflowstep(TransferDataWorkflowStep.Mappings));
      this.store.dispatch(new fromTransferDataPageActions.UpdateOutboundJdmViews(this.jdmViews));
      this.router.navigate(['/transfer-data/outbound/field-mapping']);
    }

    back() {
      this.store.dispatch(new fromTransferDataPageActions.UpdateOutboundWorkflowstep(TransferDataWorkflowStep.Authentication));
      this.router.navigate(['/transfer-data/outbound/authentication']);
    }
  }
