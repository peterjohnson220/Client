import {
  Component,
  EventEmitter,
  Input, OnDestroy, OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { TemplateListItem } from 'libs/models/jdm';

import * as fromTemplateListActions from '../../../../shared/actions/template-list.actions';
import * as fromTemplateListReducer from '../../../../shared/reducers';
import { CompanyJobViewListItem } from '../../../models';
import * as fromJobDescriptionListReducer from '../../../reducers';

@Component({
  selector: 'pf-assign-jobs-to-template-modal',
  templateUrl: './assign-jobs-to-template-modal.component.html'
})

export class AssignJobsToTemplateModalComponent implements OnInit, OnDestroy {
  @ViewChild('assignJobsToTemplateModal', {static: true}) public assignJobsToTemplateModal: any;

  @Input() selectedCompanyJob: CompanyJobViewListItem;
  @Output() templateAssignedToJob = new EventEmitter();

  private templateListItems$: Observable<TemplateListItem[]>;
  private templateListLoading$: Observable<boolean>;
  private assigningTemplateSuccess$: Observable<boolean>;
  private assigningTemplateError$: Observable<boolean>;

  private assigningTemplateSuccessSubscription: Subscription;
  private assigningTemplateErrorSubscription: Subscription;

  public templateId = -1;
  public modalRef: NgbModalRef;
  errorMessage = false;

  constructor(
    private store: Store<fromTemplateListReducer.State>,
    private modalService: NgbModal
  ) {
    this.templateListItems$ = this.store.select(fromTemplateListReducer.getTemplateList);
    this.templateListLoading$ = this.store.select(fromTemplateListReducer.getTemplateListLoading);
    this.assigningTemplateSuccess$ = this.store.select((fromJobDescriptionListReducer.getCompanyJobsJobDescriptionTemplateIdSavingSuccess));
    this.assigningTemplateError$ = this.store.select((fromJobDescriptionListReducer.getCompanyJobsJobDescriptionTemplateIdSavingError));
  }

  ngOnInit() {
    this.errorMessage = false;

    this.assigningTemplateSuccessSubscription = this.assigningTemplateSuccess$.subscribe((isSuccess) => {
      if (isSuccess) {
        this.modalRef.close();
      }
    });

    this.assigningTemplateErrorSubscription = this.assigningTemplateError$.subscribe((error) => {
      if (error) {
        this.errorMessage = true;
      }
    });
  }

  ngOnDestroy() {
    this.assigningTemplateErrorSubscription.unsubscribe();
    this.assigningTemplateSuccessSubscription.unsubscribe();
  }

  open() {
    this.store.dispatch(new fromTemplateListActions.LoadTemplateList({publishedOnly: true}));
    this.templateId = -1;
    this.modalRef = this.modalService.open(this.assignJobsToTemplateModal, {backdrop: 'static'});
  }

  submit() {
    this.templateAssignedToJob.emit({selectedCompanyJob: this.selectedCompanyJob, templateId: this.templateId});

  }
}
