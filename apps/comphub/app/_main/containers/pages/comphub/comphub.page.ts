import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { UserContext } from 'libs/models/security';
import { CompanyClientTypeConstants, QuickPriceType, SystemUserGroupNames } from 'libs/constants';
import { DataViewFilter } from 'libs/models/payfactors-api/reports/request';
import * as fromRootReducer from 'libs/state/state';
import * as fromBasicDataGridReducer from 'libs/features/grids/basic-data-grid/reducers';
import * as fromBasicDataGridActions from 'libs/features/grids/basic-data-grid/actions/basic-data-grid.actions';
import * as fromLayoutWrapperReducer from 'libs/ui/layout-wrapper/reducers';

import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { AccordionCard, ComphubPages } from '../../../data';
import { QuickPriceHistoryContext, WorkflowContext } from '../../../models';

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
  private userContextSub: Subscription;
  private historyGridInitializedSubscription: Subscription;
  private showJobHistorySummarySubscription: Subscription;
  private leftSidebarOpenSubscription: Subscription;

  workflowContext: WorkflowContext;
  systemUserGroupNames = SystemUserGroupNames;
  summaryCard: AccordionCard;
  showJobHistorySummary: boolean;
  isLeftSidebarOpened: boolean;

  private numberOfCardHeaders: number;
  private readonly cardHeaderWidth = 60;
  private readonly sideBarClosedWidth = 56;
  private readonly sideBarOpenedWidth = 200;

  constructor(
    private store: Store<fromComphubMainReducer.State>,
    private basicGridStore: Store<fromBasicDataGridReducer.State>,
    private layoutWrapperStore: Store<fromLayoutWrapperReducer.State>,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.cards$ = this.store.select(fromComphubMainReducer.getCards);
    this.enabledPages$ = this.store.select(fromComphubMainReducer.getEnabledPages);
    this.accessedPages$ = this.store.select(fromComphubMainReducer.getPagesAccessed);
    this.workflowContext$ = this.store.select(fromComphubMainReducer.getWorkflowContext);
    this.userContext$ = this.store.select(fromRootReducer.getUserContext);
    this.showJobsHistorySummary$ = this.store.select(fromComphubMainReducer.getShowJobPricedHistorySummary);
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
      this.summaryCard = cards.find(x => x.Id === ComphubPages.Summary);
      this.numberOfCardHeaders = this.cards.length - 1;
      this.updateCardContentContainerWidth();
    });
    this.workflowContextSub = this.workflowContext$.subscribe(wfc => this.workflowContext = wfc);
    this.userContextSub = this.userContext$.subscribe(uc => {
      if (uc.ClientType === CompanyClientTypeConstants.PEER_AND_ANALYSIS || uc.ClientType === CompanyClientTypeConstants.PEER || uc.ClientType == CompanyClientTypeConstants.ENTERPRISE) {
        this.store.dispatch(new fromComphubPageActions.SetQuickPriceTypeInWorkflowContext(QuickPriceType.PEER));
        this.store.dispatch(new fromComphubPageActions.GetExchangeDataSets());
      } else if (uc.CompanySystemUserGroupsGroupName === this.systemUserGroupNames.SmallBusiness) {
        this.store.dispatch(new fromComphubPageActions.SetQuickPriceTypeInWorkflowContext(QuickPriceType.SMALL_BUSINESS));
        this.store.dispatch(new fromComphubPageActions.GetCountryDataSets());
      } else {
        this.store.dispatch(new fromComphubPageActions.SetQuickPriceTypeInWorkflowContext(QuickPriceType.ENTERPRISE));
        this.store.dispatch(new fromComphubPageActions.GetCountryDataSets());
      }
      if (uc?.UserId) {
        this.initHistoryGrid(uc.UserId);
      }
    });
    this.historyGridInitializedSubscription = this.historyGridInitialized$.subscribe(initialized => {
      if (initialized) {
        this.basicGridStore.dispatch(new fromBasicDataGridActions.GetCount(QuickPriceHistoryContext.gridId));
      }
    });

    this.showJobHistorySummarySubscription = this.showJobsHistorySummary$.subscribe(x => {
      this.showJobHistorySummary = x;
    });
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
    this.userContextSub.unsubscribe();
    this.historyGridInitializedSubscription.unsubscribe();
    this.showJobHistorySummarySubscription.unsubscribe();
    this.leftSidebarOpenSubscription.unsubscribe();
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
    const sidebarWidth = this.isLeftSidebarOpened ? this.sideBarOpenedWidth : this.sideBarClosedWidth;
    this.historySummaryCardContainerWidth = wrapperElement[0].clientWidth - sidebarWidth;
    this.cardContentContainerWidth = wrapperElement[0].clientWidth - sidebarWidth -
      (this.cardHeaderWidth * this.numberOfCardHeaders) -
      (this.cardHeaderMargin * (this.numberOfCardHeaders - 1));
  }

  private initHistoryGrid(userId: number): void {
    const filters: DataViewFilter[] = QuickPriceHistoryContext.getFilters(userId);
    this.basicGridStore.dispatch(new fromBasicDataGridActions.InitGrid(
      QuickPriceHistoryContext.gridId,
      {
        BaseEntity: QuickPriceHistoryContext.baseEntity,
        ApplyDefaultFilters: false,
        Fields: QuickPriceHistoryContext.fields,
        Filters: filters,
        DefaultSort: QuickPriceHistoryContext.defaultSort
      }
    ));
  }
}
