import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { WindowRef } from 'libs/core/services';

import { environment } from 'environments/environment';
import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../reducers';

import { JobPricingLimitInfo, WorkflowContext } from '../../../models';
import { ComphubPages } from '../../../data';

@Component({
  selector: 'pf-card-layout',
  templateUrl: './card-layout.component.html',
  styleUrls: ['./card-layout.component.scss']
})
export class CardLayoutComponent implements OnInit {
  @Input() pageTitle = '';
  @Input() pageSubTitle = '';
  @Input() pageIconClass = '';
  @Input() hideBackButton: boolean;
  @Input() hideNextButton: boolean;
  @Input() nextButtonEnabled: boolean;
  @Input() backButtonEnabled: boolean;
  @Input() page: ComphubPages;
  @Input() workflowContext: WorkflowContext;
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  jobPricingLimitInfo$: Observable<JobPricingLimitInfo>;
  jobPricingLimitInfoSub: Subscription;
  jobPricingBlocked$: Observable<boolean>;
  jobPricingLimitInfo: JobPricingLimitInfo;
  comphubPages = ComphubPages;

  constructor(
    private store: Store<fromComphubMainReducer.State>,
    private window: WindowRef,
    private modalService: NgbModal
  ) {
    this.jobPricingLimitInfo$ = this.store.select(fromComphubMainReducer.getJobPricingLimitInfo);
    this.jobPricingBlocked$ = this.store.select(fromComphubMainReducer.getJobPricingBlocked);
  }

  get formattedLimit() {
    return `${this.jobPricingLimitInfo.Used} / ${this.jobPricingLimitInfo.Available}`;
  }

  ngOnInit(): void {
    this.jobPricingLimitInfoSub = this.jobPricingLimitInfo$.subscribe(jpli => this.jobPricingLimitInfo = jpli);
  }

  handleNextButtonClicked() {
    this.store.dispatch(new fromComphubPageActions.NavigateToNextCard());
  }

  handleBackButtonClicked() {
    this.store.dispatch(new fromComphubPageActions.NavigateToPreviousCard());
  }

  handleCloseClicked() {
    this.modalService.open(this.modalContent, <NgbModalOptions> {
      backdrop: 'static'
    });
  }

  handleConfirmedCloseApp() {
    this.window.nativeWindow.location = `/${environment.hostPath}/dashboard`;
  }
}
