import { Component, OnInit, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { Permissions } from 'libs/constants';
import { SimpleYesNoModalComponent } from 'libs/ui/common';
import { SimpleYesNoModalOptions } from 'libs/models/common';
import { Template, TemplateListItem } from 'libs/models';

import { NewTemplateModalComponent} from '../components';
import * as fromTemplateActions from '../../template/actions';
import * as fromTemplateReducers from '../../template/reducers';
import * as fromTemplateListActions from '../actions';
import * as fromTemplateListReducers from '../reducers';
import { CopyTemplateModalComponent } from '../../../shared';
import { SaveError } from 'libs/features/job-description-management';

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
  public templateDeleting$: Observable<boolean>;
  public templateListError$: Observable<boolean>;
  public templateListErrorMessage$: Observable<string>;
  public templateSaveError$: Observable<SaveError>;
  public templateError$: Observable<boolean>;
  public templateErrorMessage$: Observable<string>;
  public templateDeleteModalOptions: SimpleYesNoModalOptions;
  public permissions = Permissions;

  constructor(private store: Store<fromTemplateListReducers.State>) {
    this.templateListItems$ = this.store.select(fromTemplateListReducers.getTemplatesList);
    this.templateListLoading$ = this.store.select(fromTemplateListReducers.getTemplateListLoading);
    this.templateListError$ = this.store.select(fromTemplateListReducers.getTemplateListError);
    this.templateListErrorMessage$ = this.store.select(fromTemplateListReducers.getTemplateListLoadingErrorMessage);
    this.templateDeleting$ = this.store.select(fromTemplateListReducers.getTemplateDeleting);
    this.templateSaveError$ = this.store.select(fromTemplateReducers.getTemplateSaveError);
    this.templateError$ = this.store.select(fromTemplateReducers.getTemplateError);
    this.templateErrorMessage$ = this.store.select(fromTemplateReducers.getTemplateErrorMessage);
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
    this.store.dispatch(new fromTemplateListActions.DeleteTemplate({id : templateListItem.TemplateId}));
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
