import {Component, Input, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';

import {Observable, Subscription} from 'rxjs/index';

import { JobResult, JobDetailsToolTipData } from '../../models';
import * as fromAddDataReducer from '../../reducers';
import * as fromSearchResultActions from '../../actions/search-results.actions';


@Component({
  // The job result table row needs to be an immediate child of the tbody.
  // this component will be used through an attribute selector.
  // tslint:disable-next-line
  selector: '[pf-job-result]',
  templateUrl: './job-result.component.html',
  styleUrls: ['./job-result.component.scss']
})
export class JobResultComponent implements OnInit, OnDestroy {

  @Input() job: JobResult;
  @Output() jobTitleClick: EventEmitter<JobDetailsToolTipData> = new EventEmitter<JobDetailsToolTipData>();

  // observables
  loadingResults$: Observable<boolean>;

  // Subscription
  private loadingResultsSub: Subscription;

  constructor(
    private store: Store<fromAddDataReducer.State>
  ) {
    this.loadingResults$ = this.store.select(fromAddDataReducer.getLoadingResults);
  }

  toggleDataCutsLabel: string;
  showDataCuts: boolean;


  private readonly showCutsLabel: string = 'Show Cuts';
  private readonly hideCutsLabel: string = 'Hide Cuts';

  ngOnInit(): void {
    this.toggleDataCutsLabel = this.showDataCuts ? this.hideCutsLabel : this.showCutsLabel;
    this.loadingResultsSub = this.loadingResults$.subscribe(() => {
      this.showDataCuts = false;
      this.toggleDataCutsLabel = this.showCutsLabel;
    });

  }
  ngOnDestroy() {
    this.loadingResultsSub.unsubscribe();
  }

  toggleDataCutsDisplay(): void {
    this.showDataCuts = !this.showDataCuts;
    this.toggleDataCutsLabel = this.showDataCuts ? this.hideCutsLabel : this.showCutsLabel;

    if (this.showDataCuts) {
      if (this.job.DataCuts.length === 0) {
        this.store.dispatch(new fromSearchResultActions.GetSurveyDataResults(this.job));
      }
    }
  }

  handleJobTitleClick(event: MouseEvent): void {
    const data: JobDetailsToolTipData = {
      TargetX: event.offsetX + 10,
      TargetY: event.clientY,
      Job: this.job
    };
    this.jobTitleClick.emit(data);
  }


}
