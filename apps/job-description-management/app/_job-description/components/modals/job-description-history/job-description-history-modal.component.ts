import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { JobDescriptionHistoryListItem } from '../../../models/job-description-history-list-item.model';
import * as fromJobDescriptionHistoryListActions from '../../../actions/job-description-history-list.actions';
import * as fromJobDescriptionHistoryListReducer from '../../../reducers';

@Component({
  selector: 'pf-job-description-history-modal',
  templateUrl: './job-description-history-modal.component.html',
  styleUrls: ['./job-description-history-modal.component.scss']
})

export class JobDescriptionHistoryModalComponent implements OnInit, OnDestroy {
  @ViewChild('jobDescriptionHistoryModalComponent', { static: true }) public jobDescriptionHistoryModalComponent: any;

  private jobDescriptionHistoryList$: Observable<JobDescriptionHistoryListItem[]>;
  private jobDescriptionHistoryListLoading$: Observable<boolean>;

  private jobDescriptionHistorySubscription: Subscription;

  public modalRef: NgbModalRef;
  public jobDescriptionId: number;
  public jobTitle: string;
  public jobDescriptionHistoryListItems: JobDescriptionHistoryListItem[];

  constructor(
    private store: Store<fromJobDescriptionHistoryListReducer.State>,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.jobDescriptionHistoryList$ = this.store.select(fromJobDescriptionHistoryListReducer.getJobDescriptionHistoryList);
    this.jobDescriptionHistoryListLoading$ = this.store.select(fromJobDescriptionHistoryListReducer.getJobDescriptionHistoryListLoading);
  }

  open(jobDescriptionId: number, jobTitle: string) {
    this.jobDescriptionId = jobDescriptionId;
    this.jobTitle = jobTitle;

    const request = { JobDescriptionId: jobDescriptionId };
    this.store.dispatch(new fromJobDescriptionHistoryListActions.LoadJobDescriptionHistoryListItems(request));

    this.modalRef = this.modalService.open(this.jobDescriptionHistoryModalComponent, { backdrop: 'static' });
  }

  historyListItemClicked(historyListItem: JobDescriptionHistoryListItem) {
    if (historyListItem === this.jobDescriptionHistoryListItems[0]) {
      this.router.navigate([`job-description-management/job-descriptions/${this.jobDescriptionId}`]);
    } else {
      this.router.navigate([`job-description-management/job-descriptions/${this.jobDescriptionId}`,
        { versionNumber: historyListItem.VersionNumber }]);
    }

    this.modalRef.close();
  }

  ngOnInit() {
    this.jobDescriptionHistorySubscription = this.jobDescriptionHistoryList$.subscribe(jdhl => {
      if (jdhl) {
        this.jobDescriptionHistoryListItems = jdhl;
      }
    });
  }

  ngOnDestroy() {
    this.jobDescriptionHistorySubscription.unsubscribe();
  }

}
