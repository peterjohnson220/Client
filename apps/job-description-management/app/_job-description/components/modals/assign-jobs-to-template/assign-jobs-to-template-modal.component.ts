import {
  Component,
  EventEmitter,
  Input, OnDestroy, OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as cloneDeep from 'lodash.clonedeep';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { TemplateListItem } from 'libs/models/jdm';

import * as fromTemplateListActions from '../../../../shared/actions/template-list.actions';
import * as fromTemplateListReducer from '../../../../shared/reducers';
import { CompanyJobViewListItem } from '../../../models';
import * as fromJobDescriptionListReducer from '../../../reducers';

@Component({
  selector: 'pf-assign-jobs-to-template-modal',
  templateUrl: './assign-jobs-to-template-modal.component.html',
  styleUrls: ['./assign-jobs-to-template-modal.component.scss']
})

export class AssignJobsToTemplateModalComponent implements OnInit, OnDestroy {
  @Input() canRestrictJobDescriptionFromPublicView: boolean;
  @Input() selectedCompanyJob: CompanyJobViewListItem;
  @Output() templateAssignedToJob = new EventEmitter();
  @ViewChild('assignJobsToTemplateModal', {static: true}) public assignJobsToTemplateModal: any;

  public errorMessage = false;
  public modalRef: NgbModalRef;
  public publicView: Array<any> = [{ text: 'Enabled', value: true }, { text: 'Disabled', value: false }];
  public publicViewSelectedValue = true;
  public templateId = -1;
  public templateListItems$: Observable<TemplateListItem[]>;
  public templateListLoading$: Observable<boolean>;

  private assigningTemplateError$: Observable<boolean>;
  private assigningTemplateErrorSubscription: Subscription;
  private assigningTemplateSuccess$: Observable<boolean>;
  private assigningTemplateSuccessSubscription: Subscription;

  constructor(
    private store: Store<fromTemplateListReducer.State>,
    private modalService: NgbModal
  ) {
    this.assigningTemplateError$ = this.store.select((fromJobDescriptionListReducer.getCompanyJobsJobDescriptionTemplateIdSavingError));
    this.assigningTemplateSuccess$ = this.store.select((fromJobDescriptionListReducer.getCompanyJobsJobDescriptionTemplateIdSavingSuccess));
    this.templateListItems$ = this.store.select(fromTemplateListReducer.getTemplateList);
    this.templateListLoading$ = this.store.select(fromTemplateListReducer.getTemplateListLoading);
  }

  ngOnInit() {
    this.errorMessage = false;

    this.assigningTemplateSuccessSubscription = this.assigningTemplateSuccess$.subscribe((isSuccess) => {
      if (isSuccess && this.modalRef) {
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
    const companyJob = cloneDeep(this.selectedCompanyJob);
    companyJob.PublicView = this.publicViewSelectedValue;
    this.templateAssignedToJob.emit({selectedCompanyJob: companyJob, templateId: this.templateId});
  }
}
