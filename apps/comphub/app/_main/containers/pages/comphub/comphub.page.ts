import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { AccordionCard, ComphubPages } from '../../../data';
import { PricingPaymarket, JobData } from '../../../models';

@Component({
  selector: 'pf-comphub-page',
  templateUrl: './comphub.page.html',
  styleUrls: ['./comphub.page.scss']
})
export class ComphubPageComponent implements OnInit, OnDestroy {
  comphubPages = ComphubPages;
  cardContentContainerWidth: number;
  enabledPages: ComphubPages[];
  cards: AccordionCard[];
  selectedCardIndex: number;

  cards$: Observable<AccordionCard[]>;
  selectedPageId$: Observable<ComphubPages>;
  selectedJob$: Observable<string>;
  selectedPaymarket$: Observable<PricingPaymarket>;
  selectedJobData$: Observable<JobData>;
  enabledPages$: Observable<ComphubPages[]>;
  accessedPages$: Observable<ComphubPages[]>;

  private enabledPagesSub: Subscription;
  private cardsSub: Subscription;
  private selectedPageIdSub: Subscription;

  private readonly cardHeaderWidth = 60;
  private readonly cardHeaderMargin = 8;
  private readonly numberOfCardHeaders = 3;
  private readonly sideBarWidth = 56;

  constructor(private store: Store<fromComphubMainReducer.State>) {
    this.cards$ = this.store.select(fromComphubMainReducer.getCards);
    this.selectedPageId$ = this.store.select(fromComphubMainReducer.getSelectedPageId);
    this.selectedJob$ = this.store.select(fromComphubMainReducer.getSelectedJob);
    this.selectedPaymarket$ = this.store.select(fromComphubMainReducer.getSelectedPaymarket);
    this.selectedJobData$ = this.store.select(fromComphubMainReducer.getSelectedJobData);
    this.enabledPages$ = this.store.select(fromComphubMainReducer.getEnabledPages);
    this.accessedPages$ = this.store.select(fromComphubMainReducer.getPagesAccessed);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    window.setTimeout(() => {
      this.updateCardContentContainerWidth();
    }, 100);
  }

  ngOnInit() {
    this.updateCardContentContainerWidth();
    this.enabledPagesSub = this.enabledPages$.subscribe(ep => this.enabledPages = ep);
    this.cardsSub = this.cards$.subscribe(cards => this.cards = cards);
    this.selectedPageIdSub = this.selectedPageId$.subscribe(pageId => this.selectedCardIndex = this.cards.findIndex(c => c.Id === pageId));
    this.store.dispatch(new fromComphubPageActions.Init());
  }

  ngOnDestroy() {
    this.enabledPagesSub.unsubscribe();
    this.cardsSub.unsubscribe();
    this.selectedPageIdSub.unsubscribe();
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
