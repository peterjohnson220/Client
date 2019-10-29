import { Component, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { SimpleYesNoModalComponent } from 'libs/ui/common';
import { SimpleYesNoModalOptions } from 'libs/models/common';

import { NewTemplateModalComponent } from '../../../components/modals/new-template';
import { CopyTemplateModalComponent } from '../../../components/modals/copy-template';
import {Template, TemplateListItem} from '../../../models';
import * as fromTemplateActions from '../../../actions/template.actions';
import * as fromTemplateListActions from '../../../actions/template-list.actions';
import * as fromTemplateReducers from '../../../reducers';

@Component({
  selector: 'pf-job-description-template-list',
  templateUrl: './template-list.page.html'
})
export class TemplateListPageComponent implements OnInit {
  @ViewChild(NewTemplateModalComponent, { static: true }) public newTemplateModal: NewTemplateModalComponent;
  @ViewChild(CopyTemplateModalComponent, { static: true }) public copyTemplateModal: CopyTemplateModalComponent;
  @ViewChild(SimpleYesNoModalComponent, { static: true }) public deleteTemplateModal: SimpleYesNoModalComponent;

  public templateListItems$: Observable<TemplateListItem[]>;
  public templateListLoading$: Observable<boolean>;
  public templateDeleteModalOptions: SimpleYesNoModalOptions;

  constructor(
    private store: Store<fromTemplateReducers.State>
  ) {
    this.templateListItems$ = this.store.select(fromTemplateReducers.getTemplatesList);
    this.templateListLoading$ = this.store.select(fromTemplateReducers.getTemplateListLoading);
    this.defineTemplateDeleteModalOptions();
  }

  ngOnInit() {
    this.store.dispatch(new fromTemplateListActions.LoadTemplateList());
  }

  showAddTemplateModal() {
    this.newTemplateModal.open();
  }

  showDeleteModal(templateListItem: TemplateListItem) {
    this.deleteTemplateModal.open(templateListItem);
  }

  showCopyModal(templateListItem: TemplateListItem) {
    this.copyTemplateModal.open( { templateId: templateListItem.TemplateId } );
  }

  handleTemplateDelete(templateListItem: TemplateListItem) {
    this.store.dispatch(new fromTemplateActions.DeleteTemplate({id : templateListItem.TemplateId}));
  }

  handleCreateTemplateComplete(templateName: string) {
    const temp = new Template();
    temp.TemplateName = templateName;
    this.store.dispatch(new fromTemplateActions.SaveTemplate({template: temp}));
  }

  handleCopyTemplateComplete(eventargs: any) {
    this.store.dispatch(new fromTemplateActions.CopyTemplate({templateId: eventargs.context.templateId, templateName: eventargs.templateName}));
  }

  private defineTemplateDeleteModalOptions() {
    this.templateDeleteModalOptions = {
      Title: 'Delete Template',
      Body: 'You are about to delete a template. This cannot be undone. Would you like to continue?',
      ConfirmText: 'Yes',
      CancelText: 'No',
      IsDelete: true
    };
  }
}
