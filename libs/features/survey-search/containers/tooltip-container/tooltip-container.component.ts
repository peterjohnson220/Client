import {Component, OnInit, OnDestroy, Input} from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { MatchesDetailsTooltipData } from '../../models';
import * as fromTooltipContainerActions from '../../actions/tooltip-container.actions';
import * as fromSharedSurveySearchReducer from '../../reducers';

@Component({
  selector: 'pf-tooltip-container',
  templateUrl: './tooltip-container.component.html',
  styleUrls: ['./tooltip-container.component.scss']
})
export class TooltipContainerComponent implements OnInit, OnDestroy {
  @Input() legacyIframeImplementation;

  searchResultsContainerWidth: number;
  searchResultsContainerHeight: number;

  matchesDetailsTooltipOpen$: Observable<boolean>;
  getMatchesDetails$: Observable<string[]>;
  getMatchesDetailsSub: Subscription;
  loadingMatchesDetails$: Observable<boolean>;
  loadingMatchesDetailsSub: Subscription;
  matchesDetailsTooltipData: MatchesDetailsTooltipData;
  isMatchesTooltipHovered: boolean;
  loadingMatchesDetails: boolean;

  constructor(private store: Store<fromSharedSurveySearchReducer.State>) {
    this.matchesDetailsTooltipOpen$ = this.store.select(fromSharedSurveySearchReducer.getMatchesDetailsTooltipOpen);
    this.loadingMatchesDetails$ = this.store.select(fromSharedSurveySearchReducer.getLoadingMatchesDetails);
    this.getMatchesDetails$ = this.store.select(fromSharedSurveySearchReducer.getMatchesDetails);
  }

  ngOnInit(): void {
    this.loadingMatchesDetailsSub = this.loadingMatchesDetails$.subscribe(loading => this.loadingMatchesDetails = loading);
    this.getMatchesDetailsSub = this.getMatchesDetails$.subscribe(data => this.openMatchesDetailsTooltip(data));
  }

  ngOnDestroy(): void {
    this.loadingMatchesDetailsSub.unsubscribe();
    this.getMatchesDetailsSub.unsubscribe();
  }

  handleMatchesMouseEnter(data: MatchesDetailsTooltipData): void {
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

  clearMatchesDetailsTooltip(): void {
    this.store.dispatch(new fromTooltipContainerActions.CloseMatchesDetailsTooltip());
  }

  hasResultsContainerSize(): boolean {
    return (!!this.searchResultsContainerHeight && !!this.searchResultsContainerWidth);
  }
}
