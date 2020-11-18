import { Component, OnInit } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AsyncStateObj } from 'libs/models/state';
import { ProjectTemplate } from 'libs/models/payfactors-api/project/response';

import * as fromUserSettingsReducer from '../../../reducers';
import * as fromProjectTemplateActions from '../../../actions/project-template.actions';

@Component({
  selector: 'pf-project-templates',
  templateUrl: './project-templates.component.html',
  styleUrls: ['./project-templates.component.scss']
})
export class ProjectTemplatesComponent implements OnInit {
  projectTemplates$: Observable<AsyncStateObj<ProjectTemplate[]>>;
  selectedTemplate: ProjectTemplate;

  showDeleteTemplateModal = new BehaviorSubject<boolean>(false);
  showDeleteTemplateModal$ = this.showDeleteTemplateModal.asObservable();

  constructor( public store: Store<fromUserSettingsReducer.State>) {
    this.projectTemplates$ = this.store.select(fromUserSettingsReducer.getProjectTemplatesAsync);
  }

  ngOnInit(): void {
  }

  handleAddClicked() {
    alert('Project Templates add button clicked');
  }

  handleDeleteClicked(template: ProjectTemplate) {
    this.selectedTemplate = template;
    this.showDeleteTemplateModal.next(true);
  }

  handleModalDismissed(): void {
    this.selectedTemplate = null;
    this.showDeleteTemplateModal.next(false);
  }

  handleDeleteConfirmed() {
    if (!!this.selectedTemplate) {
      this.store.dispatch(new fromProjectTemplateActions.DeleteProjectTemplate(this.selectedTemplate.ProjectTemplateId));
      this.selectedTemplate = null;
    }
    this.showDeleteTemplateModal.next(false);
  }

  trackByFn(index: any, template: ProjectTemplate) {
    return template.ProjectTemplateId;
  }

}
