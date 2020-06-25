import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';

import * as fromJobDescriptionHistoryListActions from '../../actions/job-description-history-list.actions';
import * as fromJobDescriptionManagementReducer from '../../reducers';
import { JobDescriptionHistoryListItem } from 'libs/features/job-description-management';

@Component({
  selector: 'pf-job-description-history-grid',
  templateUrl: './job-description-history-grid.component.html',
  styleUrls: ['./job-description-history-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobDescriptionHistoryGridComponent implements OnChanges {
  @Input() jobDescriptionId: number;
  @Input() currentVersion: number;
  @Output() historyListItemClicked = new EventEmitter();

  historyListItems$: Observable<AsyncStateObj<JobDescriptionHistoryListItem[]>>;

  constructor(
    private router: Router,
    private store: Store<fromJobDescriptionManagementReducer.State>
  ) {
    this.historyListItems$ = this.store.pipe(select(fromJobDescriptionManagementReducer.getJobDescriptionHistoryList));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes && !!changes.jobDescriptionId &&
      changes.jobDescriptionId.currentValue !== changes.jobDescriptionId.previousValue) {
      this.loadHistory(changes.jobDescriptionId.currentValue);
    }
  }

  loadHistory(jobDescriptionId: number): void {
    this.jobDescriptionId = jobDescriptionId;
    this.store.dispatch(new fromJobDescriptionHistoryListActions.LoadJobDescriptionHistoryListItems({
      JobDescriptionId: this.jobDescriptionId
    }));
  }

  handleHistoryItemClicked(index: number, historyListItem: JobDescriptionHistoryListItem) {
    if (index === 0) {
      this.router.navigate([`/job-descriptions/${this.jobDescriptionId}`]);
    } else {
      this.router.navigate([`/job-descriptions/${this.jobDescriptionId}`,
        { versionNumber: historyListItem.VersionNumber }]);
    }
    this.historyListItemClicked.emit();
  }
}
