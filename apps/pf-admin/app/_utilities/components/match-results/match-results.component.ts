import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { AsyncStateObj } from 'libs/models';

import { MatchResult } from '../../models';

@Component({
  selector: 'pf-match-results',
  templateUrl: './match-results.component.html',
  styleUrls: ['./match-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchResultsComponent {
  @Input() matchResultsAsync: AsyncStateObj<MatchResult[]>;
  @Input() filteredMatchResults: MatchResult[];
  @Input() scopeSelected: boolean;
  @Output() matchResultSelected = new EventEmitter<MatchResult>();
  @Output() filterClicked = new EventEmitter<string>();
  @Output() applyExactMatchClicked = new EventEmitter<MatchResult>();

  get matchResults(): MatchResult[] {
    return this.matchResultsAsync.obj;
  }

  get matchCount(): number {
    return !!this.matchResults ? this.matchResults.length : 0;
  }

  get exactMatchCount(): number {
    return !!this.matchResults ? this.matchResults.filter(mr => mr.IsExactMatch).length : 0;
  }

  get nonMatchCount(): number {
    return !!this.matchResults ? this.matchResults.length - this.exactMatchCount : 0;
  }

  trackByFn(matchResult: MatchResult, index: number) {
    return matchResult.Id;
  }

  handleMatchResultClicked(matchResult: MatchResult) {
    this.matchResultSelected.emit(matchResult);
  }

  handleFilterClicked(type: string) {
    this.filterClicked.emit(type);
  }

  handleApplyExactMatchClicked(matchResult: MatchResult, event: MouseEvent) {
    event.stopPropagation();
    this.applyExactMatchClicked.emit(matchResult);
  }

  constructor() {}
}
