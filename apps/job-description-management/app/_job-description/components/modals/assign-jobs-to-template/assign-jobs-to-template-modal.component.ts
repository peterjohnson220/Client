import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
  } from '@angular/core';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { TemplateListItem } from 'libs/models/jdm';

import * as fromTemplateListActions from '../../../../shared/actions/template-list.actions';
import * as fromTemplateListReducer from '../../../../shared/reducers';
import { CompanyJobViewListItem } from '../../../models';

@Component({
  selector: 'pf-assign-jobs-to-template-modal',
  templateUrl: './assign-jobs-to-template-modal.component.html'
})

export class AssignJobsToTemplateModalComponent {
  @ViewChild('assignJobsToTemplateModal', { static: true }) public assignJobsToTemplateModal: any;

  @Input() selectedCompanyJob: CompanyJobViewListItem;

  @Output() templateAssignedToJob = new EventEmitter();

  private templateListItems$: Observable<TemplateListItem[]>;
  private templateListLoading$: Observable<boolean>;

  public templateId = -1;
  public modalRef: NgbModalRef;

  constructor(
    private store: Store<fromTemplateListReducer.State>,
    private modalService: NgbModal
  ) {
    this.templateListItems$ = this.store.select(fromTemplateListReducer.getTemplateList);
    this.templateListLoading$ = this.store.select(fromTemplateListReducer.getTemplateListLoading);
  }

  open() {
    this.store.dispatch(new fromTemplateListActions.LoadTemplateList({ publishedOnly: true }));
    this.templateId = -1;
    this.modalRef = this.modalService.open(this.assignJobsToTemplateModal, { backdrop: 'static' });
  }

  submit() {
    this.templateAssignedToJob.emit({ selectedCompanyJob: this.selectedCompanyJob, templateId: this.templateId });
    this.modalRef.close();
  }
}
