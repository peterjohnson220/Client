import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import * as fromJobDescriptionReducer from '../../../../_job-description/reducers/job-description.reducer';
import * as fromJobDescriptionActions from '../../../../_job-description/actions/job-description.actions';
import * as fromJobDescriptionGridActions from '../../../../_job-description/actions/job-description-grid.actions';


@Component({
  selector: 'pf-delete-job-description-modal',
  templateUrl: './delete-job-description-modal.component.html',
  styleUrls: ['./delete-job-description-modal.component.scss']
})
export class DeleteJobDescriptionModalComponent implements OnInit, OnDestroy {
  @ViewChild('deleteJobDescriptionModal', { static: true }) public deleteJobDescriptionModal: any;

  private jobDescriptionIds: number[];
  private deleteJobDescriptionSuccess$: Observable<boolean>;
  private deleteJobDescriptionSuccessSubscription: Subscription;
  public modalRef: NgbModalRef;

  constructor( private modalService: NgbModal,
    private store: Store<fromJobDescriptionReducer.State>) {
      this.deleteJobDescriptionSuccess$ = this.store.select(fromJobDescriptionReducer.getDeletingJobDescriptionSuccess);
  }

  ngOnInit() {
    this.deleteJobDescriptionSuccessSubscription = this.deleteJobDescriptionSuccess$.subscribe(result => {
      if (result === true) {
        if  (this.modalRef) {
          this.modalRef.close();
        }
      }
    });
  }

  open(jobDescriptionIds: number[]) {
    this.jobDescriptionIds = jobDescriptionIds;
    this.modalRef = this.modalService.open(this.deleteJobDescriptionModal, { backdrop: 'static', size: 'lg' });
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  submit() {
    this.store.dispatch(new fromJobDescriptionActions.DeleteJobDescription({ jobDescriptionIds: this.jobDescriptionIds }));
    this.store.dispatch(new fromJobDescriptionGridActions.AddDeletingJobStatus(this.jobDescriptionIds));
    this.close();
   }

  ngOnDestroy() {
    this.deleteJobDescriptionSuccessSubscription.unsubscribe();
  }

}
