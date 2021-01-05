import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

import { AsyncStateObj } from 'libs/models/state';
import { CompositeField, CompositeFieldHierarchy, ProjectTemplateFields } from 'libs/models/projects/project-templates';
import { GenericKeyValue } from 'libs/models';

import * as fromProjectTemplateManagementReducer from '../../reducers';
import { ProjectTemplateHelper } from '../../helpers';

@Component({
  selector: 'pf-project-template-fields',
  templateUrl: './project-template-fields.component.html',
  styleUrls: ['./project-template-fields.component.scss']
})
export class ProjectTemplateFieldsComponent implements OnInit, OnDestroy {
  templateFieldsAsync$: Observable<AsyncStateObj<ProjectTemplateFields>>;

  templateFieldsSubscription: Subscription;

  @ViewChild('fieldsAccordion', { static: true }) accordion: NgbAccordion;
  selectedGroups: CompositeFieldHierarchy[];
  panelController: GenericKeyValue<string, boolean>[];
  activeAccordionIds: string[];
  referencePoints = {};

  constructor(
    private store: Store<fromProjectTemplateManagementReducer.State>
  ) {
    this.templateFieldsAsync$ = this.store.pipe(select(fromProjectTemplateManagementReducer.getTemplateFieldsAsync));
    this.activeAccordionIds = [];
    this.panelController = [];
  }

  ngOnInit(): void {
    this.templateFieldsSubscription = this.templateFieldsAsync$.subscribe(asyncObj => {
      if (asyncObj?.obj?.TemplateFields?.length) {
        this.selectedGroups = asyncObj.obj.TemplateFields.filter(g => g.Fields.some(f => f.Checked));
        this.updatePanelActiveController();
        this.setReferencePoints(asyncObj.obj);
      }
    });
  }

  ngOnDestroy(): void {
    this.templateFieldsSubscription?.unsubscribe();
  }


  togglePanel(category: string): void {
    const panelToUpdate = this.panelController.find(p => p.Key === category);
    if (panelToUpdate) {
      panelToUpdate.Value = !panelToUpdate.Value;
      this.activeAccordionIds = this.panelController.map(p => {
        if (p.Value) {
          return p.Key;
        }
      });
    }
  }

  trackByCategory(index: any, item: CompositeFieldHierarchy) {
    return item.Category;
  }

  trackByField(index: any, item: CompositeField) {
    return item.ListCompositeFieldId;
  }

  getReferencePoint(field: CompositeField, referencePointsList: number[]) {
    const value = ProjectTemplateHelper.getReferencePoint(field, referencePointsList);
    return `${value}${this.getSuffix(value)}`;
  }

  setReferencePoints(template: ProjectTemplateFields) {
    this.referencePoints = {};
    template.TemplateFields.forEach(t => {
      t.Fields.forEach(f => {
        if (f.Checked) {
          this.referencePoints[f.FieldName] = this.getReferencePoint(f, template.ReferencePoints);
        }
      });
    });
  }

  private updatePanelActiveController(): void {
    this.selectedGroups.forEach(group => {
      if (!this.panelController.some((p) => p.Key === group.Category)) {
        this.panelController.push({ Key: group.Category, Value: true });
        this.activeAccordionIds.push(group.Category);
      }
    });
  }

  private getSuffix(value: number): string {
    switch (value.toString().substring(value.toString().length - 1)) {
      case '1':
        return 'st';
      case '2':
        return 'nd';
      case '3':
        return 'rd';
      default:
        return 'th';
    }
  }
}
