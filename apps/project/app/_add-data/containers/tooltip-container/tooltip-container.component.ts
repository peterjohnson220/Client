import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { MatchesDetailsTooltipData, JobDetailsToolTipData } from '../../models';
import * as fromTooltipContainerActions from '../../actions/tooltip-container.actions';
import * as fromAddDataReducer from '../../reducers';

@Component({
  selector: 'pf-tooltip-container',
  templateUrl: './tooltip-container.component.html',
  styleUrls: ['./tooltip-container.component.scss']
})
export class TooltipContainerComponent implements OnInit, OnDestroy {
  searchResultsContainerWidth: number;
  searchResultsContainerHeight: number;

  jobDetailsTooltipOpen$: Observable<boolean>;
  jobDetailsTooltipOpenSub: Subscription;
  jobDetailsTooltipData: JobDetailsToolTipData;
  jobDetailsTooltipIndex: number;

  matchesDetailsTooltipOpen$: Observable<boolean>;
  getMatchesDetails$: Observable<string[]>;
  getMatchesDetailsSub: Subscription;
  loadingMatchesDetails$: Observable<boolean>;
  loadingMatchesDetailsSub: Subscription;
  matchesDetailsTooltipData: MatchesDetailsTooltipData;
  isMatchesTooltipHovered: boolean;
  loadingMatchesDetails: boolean;

  constructor(private store: Store<fromAddDataReducer.State>) {
    this.jobDetailsTooltipOpen$ = this.store.select(fromAddDataReducer.getJobDetailsTooltipOpen);
    this.matchesDetailsTooltipOpen$ = this.store.select(fromAddDataReducer.getMatchesDetailsTooltipOpen);
    this.loadingMatchesDetails$ = this.store.select(fromAddDataReducer.getLoadingMatchesDetails);
    this.getMatchesDetails$ = this.store.select(fromAddDataReducer.getMatchesDetails);
  }

  ngOnInit(): void {
    this.jobDetailsTooltipOpenSub = this.jobDetailsTooltipOpen$.subscribe(tooltipOpen => this.resetJobDetailsTooltipIndex(tooltipOpen));
    this.loadingMatchesDetailsSub = this.loadingMatchesDetails$.subscribe(loading => this.loadingMatchesDetails = loading);
    this.getMatchesDetailsSub = this.getMatchesDetails$.subscribe(data => this.openMatchesDetailsTooltip(data));
  }

  ngOnDestroy(): void {
    this.jobDetailsTooltipOpenSub.unsubscribe();
    this.loadingMatchesDetailsSub.unsubscribe();
    this.getMatchesDetailsSub.unsubscribe();
  }

  handleSearchResultsContainerScroll(): void {
    if (this.jobDetailsTooltipIndex === -1) {
      return;
    }
    this.clearJobDetailsTooltip();
  }

  handleJobTitleClick(data: JobDetailsToolTipData, index: number): void {
    if (!!this.jobDetailsTooltipData && this.jobDetailsTooltipIndex === index) {
      this.clearJobDetailsTooltip();
      return;
    }
    this.jobDetailsTooltipData = data;
    this.jobDetailsTooltipIndex = index;
    this.store.dispatch(new fromTooltipContainerActions.OpenJobDetailsTooltip());
  }

  handleMatchesMouseEnter(data: MatchesDetailsTooltipData): void {
    if (!!this.jobDetailsTooltipData) {
      this.clearJobDetailsTooltip();
    }
    if (this.loadingMatchesDetails) {
      this.clearMatchesDetailsTooltip();
      return;
    }
    this.matchesDetailsTooltipData = data;
    this.store.dispatch(new fromTooltipContainerActions.GetMatchesDetails(data.Request));
  }

  handleMatchesMouseLeave(): void {
    if (this.isMatchesTooltipHovered) {
      return;
    }
    this.clearMatchesDetailsTooltip();
  }

  setMatchesTooltipHovered(isHovered: boolean) {
    this.isMatchesTooltipHovered = isHovered;
    if (!isHovered) {
      this.clearMatchesDetailsTooltip();
    }
  }

  openMatchesDetailsTooltip(matchesDetails: string[]): void {
    if (matchesDetails.length === 0) {
      return;
    }
    this.matchesDetailsTooltipData.MatchesDetails = matchesDetails;
    this.store.dispatch(new fromTooltipContainerActions.OpenMatchesDetailsTooltip());
  }

  clearJobDetailsTooltip(): void {
    this.store.dispatch(new fromTooltipContainerActions.CloseJobDetailsTooltip());
    this.jobDetailsTooltipIndex = -1;
  }

  clearMatchesDetailsTooltip(): void {
    this.store.dispatch(new fromTooltipContainerActions.CloseMatchesDetailsTooltip());
  }

  hasResultsContainerSize(): boolean {
    return (!!this.searchResultsContainerHeight && !!this.searchResultsContainerWidth);
  }

  private resetJobDetailsTooltipIndex(tooltipOpen: boolean): void {
    if (!tooltipOpen) {
      this.jobDetailsTooltipIndex = -1;
    }
  }

}
