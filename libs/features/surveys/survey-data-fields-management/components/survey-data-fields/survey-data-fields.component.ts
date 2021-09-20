import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Observable } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';

import { SurveyDataField, SurveyDataFieldGroup, SurveyDataFieldsConfig } from '../../models';

@Component({
  selector: 'pf-survey-data-fields',
  templateUrl: './survey-data-fields.component.html',
  styleUrls: ['./survey-data-fields.component.scss']
})
export class SurveyDataFieldsComponent implements OnChanges {
  @Input() fields: SurveyDataField[];
  @Input() showModal$: Observable<boolean>;
  @Input() saving$: Observable<boolean>;

  @Output() onDismiss: EventEmitter<any> = new EventEmitter();
  @Output() onSubmit: EventEmitter<SurveyDataField[]> = new EventEmitter();

  modalConfig = SurveyDataFieldsConfig;
  modalTabs: string[];
  activeAccordionIds: string[] = [];
  activeTab: string;
  tabsConfiguration = {};
  allFieldGroups: SurveyDataFieldGroup[];
  isUpdated: boolean;

  constructor() {
    this.isUpdated = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.fields?.currentValue?.length) {
      this.configureTabs(changes.fields.currentValue);
    }
  }

  getKeys(object: any): string[] {
    return Object.keys(object);
  }

  trackByGroup(index: any, item: string) {
    return item;
  }

  trackByField(index: any, item: SurveyDataField) {
    return `${item.EntitySourceName}_${item.SourceName}`;
  }

  handleSelectionChanged(field: SurveyDataField) {
    field.IsSelected = !field.IsSelected;
    this.isUpdated = true;
    this.updateCurrentFields(field);
  }

  handleDismiss(): void {
    this.isUpdated = false;
    this.onDismiss.emit();
  }

  handleSubmit(): void {
    this.isUpdated = false;
    this.onSubmit.emit(this.fields);
  }

  private configureTabs(allFields: SurveyDataField[]): void {
    const allAccordionIds = [];
    this.tabsConfiguration = {};
    this.allFieldGroups = [];
    this.fields = cloneDeep(allFields);
    this.fields.forEach(field => {
      const isAgingFactorField = field.EntitySourceName === 'CompanySurveys' && field.SourceName === 'Aging_Factor';
      if (isAgingFactorField) {
        field.Group = 'Survey Aging Factor';
        this.tabsConfiguration['Basic'] = {};
        this.tabsConfiguration['Basic']['Survey Aging Factor'] = { Fields: [field] };
        allAccordionIds.push('Basic_Survey Aging Factor');
        this.configureCurrentFields(field);
      } else {
        const tab = this.modalConfig.groupTabConfig[field.Group];
        if (tab) {
          this.tabsConfiguration[tab] = this.tabsConfiguration[tab] || {};
          this.tabsConfiguration[tab][field.Group] = this.tabsConfiguration[tab][field.Group] || { Fields : [] };
          this.tabsConfiguration[tab][field.Group].Fields.push(field);
          allAccordionIds.push(`${tab}_${field.Group}`);
          this.configureCurrentFields(field);
        }
      }
    });

    this.modalTabs = this.getKeys(this.tabsConfiguration);

    if (!this.activeAccordionIds.length) {
      this.modalTabs.map((mt, tabIndex) => {
        this.getKeys(this.tabsConfiguration[mt]).map((p, panelIndex) => {
          this.activeAccordionIds.push(`panel-${tabIndex}-${panelIndex}`);
        });
      });
    }

    this.activeTab = this.modalTabs[0];
  }

  private configureCurrentFields(field: SurveyDataField): void {
    const group = this.allFieldGroups.find(g => g.GroupName === field.Group);
    if (!group) {
      this.allFieldGroups.push({
        GroupName: field.Group,
        Fields: [field],
        HasSelectedField: field.IsSelected
      });
    } else {
      group.Fields.push(field);
      group.HasSelectedField = group.Fields.some(f => f.IsSelected);
    }
  }

  private updateCurrentFields(field: SurveyDataField): void {
    const group = this.allFieldGroups.find(g => g.GroupName === field.Group);
    if (group) {
      group.HasSelectedField = group.Fields.some(f => f.IsSelected);
    }
  }
}
