import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { ComphubPageComponent } from '../comphub';
import { AccordionCard, TrendsPages } from '../../../data';
import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../reducers';

import * as fromBasicDataGridReducer from 'libs/features/grids/basic-data-grid/reducers';
import * as fromLayoutWrapperReducer from 'libs/ui/layout-wrapper/reducers';
import { QuickPriceType } from 'libs/constants';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'pf-trends-page',
  templateUrl: './trends.page.html',
  styleUrls: ['./trends.page.scss']
})
export class TrendsPageComponent extends ComphubPageComponent implements OnInit, OnDestroy  {

  trendsPages = TrendsPages;
  enabledTrendPages: TrendsPages[];

  private workflowContextTrendsSub: Subscription;

  trendsCards$: Observable<AccordionCard[]>;
  trendsCards: AccordionCard[];


  constructor(
    private trendsStore: Store<fromComphubMainReducer.State>,
    private trendsBasicGridStore: Store<fromBasicDataGridReducer.State>,
    private trendsLayoutWrapperStore: Store<fromLayoutWrapperReducer.State>,
    private trendsChangeDetectorRef: ChangeDetectorRef
  ) {
    super(trendsStore, trendsBasicGridStore, trendsLayoutWrapperStore, trendsChangeDetectorRef);
    this.trendsCards$ = this.trendsStore.select(fromComphubMainReducer.getCards);
    this.workflowContext$ = this.trendsStore.select(fromComphubMainReducer.getWorkflowContext);

  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateCardContentContainerWidth();

    this.resizeEvent = true;

    clearTimeout(this.resizeEventCompleteTimer);

    this.resizeEventCompleteTimer = window.setTimeout(() => {
      this.resizeEvent = false;
    }, 750);
  }

  ngOnInit() {
    this.workflowContextTrendsSub = this.workflowContext$.subscribe(wfc => this.workflowContext = wfc);
    this.trendsStore.dispatch(new fromComphubPageActions.SetQuickPriceTypeInWorkflowContext(QuickPriceType.TRENDS));
    this.trendsStore.dispatch(new fromComphubPageActions.GetExchangeDataSets());

    this.trendsCards$.subscribe(x => {
      this.trendsCards = x;
    });

    super.numberOfCardHeaders = this.trendsCards.length - 1;
    super.updateCardContentContainerWidth();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.workflowContextTrendsSub.unsubscribe();
  }
}
