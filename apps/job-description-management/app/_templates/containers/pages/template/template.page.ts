import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Template } from '../../../models';
import * as fromTemplateActions from '../../../actions';
import * as fromTemplateReducers from '../../../reducers';
import { AssignTemplateToJobModalComponent } from '../../../components';

@Component({
  selector: 'pf-job-description-template',
  templateUrl: './template.page.html',
  styleUrls: ['./template.page.scss']
})
export class TemplatePageComponent implements OnInit, OnDestroy {

  @ViewChild(AssignTemplateToJobModalComponent, {static: true}) assignModalComponent: AssignTemplateToJobModalComponent;

  public template$: Observable<Template>;
  public templateLoading$: Observable<boolean>;
  public templateLoadingError$: Observable<boolean>;
  private templateId: number;

  constructor(
    private store: Store<fromTemplateReducers.State>,
    private route: ActivatedRoute) {
      this.template$ = this.store.select(fromTemplateReducers.getTemplate);
      this.templateLoading$ = this.store.select(fromTemplateReducers.getTemplateLoading);
      this.templateLoadingError$ = this.store.select(fromTemplateReducers.getTemplateLoadingError);
  }

  ngOnInit() {
    // subscribe to router event
    this.route.params.subscribe((params: Params) => {
      this.templateId = parseInt(params['id'], 10);
      if (this.templateId > 0) {
        this.store.dispatch(new fromTemplateActions.LoadTemplate({templateId: this.templateId}));
        this.store.dispatch(new fromTemplateActions.LoadTemplateAssignmentSummary({templateId: this.templateId}));
      } else {
        // Display an error messgae on the template page
      }
    });
  }

  ngOnDestroy() {
    this.store.dispatch(new fromTemplateActions.CleanTemplateState());
  }

  publishTemplateClick($event: any) {
      // Will be implemented in ARCH-122
  }

  beginEditing() {
    // Will be implemented in ARCH-122
  }

  // Modals
  showAddSectionModal($event: any) {
    // Will be implemented in ARCH-122
  }

  showAssignModal() {
      this.assignModalComponent.open();
  }

  showCopyConfirmModal($event: any) {
    // Will be implemented in ARCH-121
  }

  showDiscardDraftModal($event: any) {
    // Will be implemented in ARCH-122
  }

  handleCancelExportSettings($event: any) {
    // Will be implemented in ARCH-121
  }

  handleDoneWithExportSettings($event: any) {
    // Will be implemented in ARCH-121
  }

  handleExportSettingsClick($event: any) {
    // Will be implemented in ARCH-121
  }

}
