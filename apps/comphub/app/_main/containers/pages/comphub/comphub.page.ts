import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { debounceTime, map } from 'rxjs/operators';
import { combineLatest, Observable, Subscription } from 'rxjs';

import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { AccordionCard, ComphubPages } from '../../../data';
import { CountryDataSet, JobData, PricingPaymarket, WorkflowContext, ExchangeDataSet } from '../../../models';

@Component({
  selector: 'pf-comphub-page',
  templateUrl: './comphub.page.html',
  styleUrls: ['./comphub.page.scss']
})
export class ComphubPageComponent implements OnInit, OnDestroy {
  comphubPages = ComphubPages;
  cardContentContainerWidth: number;
  cardHeaderMargin = 8;
  enabledPages: ComphubPages[];
  cards: AccordionCard[];
  activeCountryDataSet: CountryDataSet;
  resizeEventCompleteTimer: number;
  resizeEvent: boolean;

  cards$: Observable<AccordionCard[]>;
  selectedPageId$: Observable<ComphubPages>;
  selectedPageIdDelayed$: Observable<ComphubPages>;
  selectedJob$: Observable<string>;
  selectedPaymarket$: Observable<PricingPaymarket>;
  selectedJobData$: Observable<JobData>;
  enabledPages$: Observable<ComphubPages[]>;
  accessedPages$: Observable<ComphubPages[]>;
  activeCountryDataSet$: Observable<CountryDataSet>;
  activeExchangeDataSet$: Observable<ExchangeDataSet>;

  private enabledPagesSub: Subscription;
  private cardsSub: Subscription;
  private workflowContextSub: Subscription;

  workflowContext: WorkflowContext = {
    selectedPageId: ComphubPages.Jobs,
    selectedPageIdDelayed: ComphubPages.Jobs,
    selectedPageIndex: 0,
    activeCountryDataSet: null,
    activeExchangeDataSet: null
  };

  private readonly cardHeaderWidth = 60;
  private readonly numberOfCardHeaders = 3;
  private readonly sideBarWidth = 56;

  constructor(private store: Store<fromComphubMainReducer.State>) {
    this.cards$ = this.store.select(fromComphubMainReducer.getCards);
    this.selectedPageId$ = this.store.select(fromComphubMainReducer.getSelectedPageId);
    this.selectedPageIdDelayed$ = this.store.select(fromComphubMainReducer.getSelectedPageId).pipe(debounceTime(750));
    this.selectedJob$ = this.store.select(fromComphubMainReducer.getSelectedJob);
    this.selectedPaymarket$ = this.store.select(fromComphubMainReducer.getSelectedPaymarket);
    this.selectedJobData$ = this.store.select(fromComphubMainReducer.getSelectedJobData);
    this.enabledPages$ = this.store.select(fromComphubMainReducer.getEnabledPages);
    this.accessedPages$ = this.store.select(fromComphubMainReducer.getPagesAccessed);
    this.activeCountryDataSet$ = this.store.select(fromComphubMainReducer.getActiveCountryDataSet);
    this.activeExchangeDataSet$ = this.store.select(fromComphubMainReducer.getActiveExchangeDataSet);
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
    this.updateCardContentContainerWidth();
    this.enabledPagesSub = this.enabledPages$.subscribe(ep => this.enabledPages = ep);
    this.cardsSub = this.cards$.subscribe(cards => this.cards = cards);

    // Build a workflow context object using the latest values from the store
    this.workflowContextSub = combineLatest(
      this.selectedPageId$,
      this.selectedPageIdDelayed$,
      this.activeCountryDataSet$,
      this.activeExchangeDataSet$
    ).pipe(
      map(([selectedPageId, selectedPageIdDelayed, activeCountryDataSet, activeExchangeDataSet]) => {
        return {
          selectedPageId,
          selectedPageIdDelayed,
          selectedPageIndex: this.cards.findIndex(c => c.Id === selectedPageId),
          activeCountryDataSet,
          activeExchangeDataSet
        };
      })
    ).subscribe((wc) => this.workflowContext = wc);

    this.store.dispatch(new fromComphubPageActions.Init());
    this.store.dispatch(new fromComphubPageActions.GetCountryDataSets());
    this.store.dispatch(new fromComphubPageActions.GetExchangeDataSets());
  }

  ngOnDestroy() {
    this.enabledPagesSub.unsubscribe();
    this.cardsSub.unsubscribe();
    this.workflowContextSub.unsubscribe();
  }

  trackById(index: number, card: AccordionCard) {
    return card.Id;
  }

  handleCardChange(cardId: string) {
    if (this.enabledPages.some(ep => ep === cardId)) {
      this.store.dispatch(new fromComphubPageActions.NavigateToCard({ cardId: cardId }));
    }
  }

  private updateCardContentContainerWidth() {
    const wrapperElement = document.getElementsByClassName('wrapper');
    if (wrapperElement === undefined || wrapperElement[0] === undefined) {
      return;
    }
    this.cardContentContainerWidth = wrapperElement[0].clientWidth - this.sideBarWidth -
      (this.cardHeaderWidth * this.numberOfCardHeaders) -
      (this.cardHeaderMargin * (this.numberOfCardHeaders - 1));
  }
}
