import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { UserContext } from 'libs/models/security';
import { SystemUserGroupNames } from 'libs/constants';
import * as fromRootReducer from 'libs/state/state';
import * as fromBasicDataGridReducer from 'libs/features/grids/basic-data-grid/reducers';
import * as fromLayoutWrapperReducer from 'libs/ui/layout-wrapper/reducers';

import * as fromComphubPageActions from '../../../../_shared/actions/comphub-page.actions';
import * as fromComphubSharedReducer from '../../../../_shared/reducers';
import { AccordionCard, ComphubPages } from '../../../../_shared/data';
import { QuickPriceHistoryContext, WorkflowContext } from '../../../../_shared/models';

@Component({
  selector: 'pf-comphub-page',
  templateUrl: './comphub.page.html',
  styleUrls: ['./comphub.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComphubPageComponent implements OnInit, OnDestroy {
  comphubPages = ComphubPages;
  cardContentContainerWidth: number;
  historySummaryCardContainerWidth: number;
  cardHeaderMargin = 8;
  enabledPages: ComphubPages[];
  cards: AccordionCard[];
  resizeEventCompleteTimer: number;
  resizeEvent: boolean;

  cards$: Observable<AccordionCard[]>;
  enabledPages$: Observable<ComphubPages[]>;
  accessedPages$: Observable<ComphubPages[]>;
  workflowContext$: Observable<WorkflowContext>;
  userContext$: Observable<UserContext>;
  historyGridInitialized$: Observable<boolean>;
  showJobsHistorySummary$: Observable<boolean>;
  leftSidebarOpen$: Observable<boolean>;

  private enabledPagesSub: Subscription;
  private cardsSub: Subscription;
  private workflowContextSub: Subscription;
  private leftSidebarOpenSubscription: Subscription;

  workflowContext: WorkflowContext;
  systemUserGroupNames = SystemUserGroupNames;
  summaryCard: AccordionCard;
  isLeftSidebarOpened: boolean;

  protected numberOfCardHeaders: number;
  protected readonly cardHeaderWidth = 60;
  protected readonly sideBarClosedWidth = 56;
  protected readonly sideBarOpenedWidth = 200;

  constructor(
    private store: Store<fromComphubSharedReducer.State>,
    private basicGridStore: Store<fromBasicDataGridReducer.State>,
    private layoutWrapperStore: Store<fromLayoutWrapperReducer.State>,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.cards$ = this.store.select(fromComphubSharedReducer.getCards);
    this.enabledPages$ = this.store.select(fromComphubSharedReducer.getEnabledPages);
    this.accessedPages$ = this.store.select(fromComphubSharedReducer.getPagesAccessed);
    this.workflowContext$ = this.store.select(fromComphubSharedReducer.getWorkflowContext);
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
    this.showJobsHistorySummary$ = this.store.select(fromComphubSharedReducer.getShowJobPricedHistorySummary);
    this.historyGridInitialized$ = this.store.select(fromBasicDataGridReducer.getIsInitialized, QuickPriceHistoryContext.gridId);
    this.leftSidebarOpen$ = this.layoutWrapperStore.select(fromLayoutWrapperReducer.getLeftSidebarOpen);
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
    this.enabledPagesSub = this.enabledPages$.subscribe(ep => this.enabledPages = ep);
    this.cardsSub = this.cards$.subscribe(cards => {
      this.cards = cards;
      this.summaryCard = cards.find(x => x.Id === ComphubPages.Summary || x.Id === ComphubPages.TrendsSummary);
      this.numberOfCardHeaders = this.cards.length - 1;
      this.updateCardContentContainerWidth();
    });
    this.workflowContextSub = this.workflowContext$.subscribe(wfc => this.workflowContext = wfc);

    this.leftSidebarOpenSubscription = this.leftSidebarOpen$.subscribe(isOpen => {
      this.isLeftSidebarOpened = isOpen;
      this.onResize();
      this.changeDetectorRef.detectChanges();
    });

    this.store.dispatch(new fromComphubPageActions.Init());
  }

  ngOnDestroy() {
    this.enabledPagesSub.unsubscribe();
    this.cardsSub.unsubscribe();
    this.workflowContextSub.unsubscribe();
    this.leftSidebarOpenSubscription.unsubscribe();
  }

  trackById(index: number, card: AccordionCard) {
    return card.Id;
  }

  handleCardChange(cardId: string) {
    if (this.enabledPages.some(ep => ep === cardId)) {
      this.store.dispatch(new fromComphubPageActions.NavigateToCard({cardId: cardId}));
    }
  }

  protected updateCardContentContainerWidth() {
    const wrapperElement = document.getElementsByClassName('wrapper');
    if (wrapperElement === undefined || wrapperElement[0] === undefined) {
      return;
    }
    const sidebarWidth = this.isLeftSidebarOpened ? this.sideBarOpenedWidth : this.sideBarClosedWidth;
    this.historySummaryCardContainerWidth = wrapperElement[0].clientWidth - sidebarWidth;
    this.cardContentContainerWidth = wrapperElement[0].clientWidth - sidebarWidth -
      (this.cardHeaderWidth * this.numberOfCardHeaders) -
      (this.cardHeaderMargin * (this.numberOfCardHeaders - 1));
  }
}
