import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { GenericKeyValue } from 'libs/models/common';

import { SurveyDataField, SurveyDataFieldGroup } from '../../models';

@Component({
  selector: 'pf-current-fields-panel',
  templateUrl: './current-fields-panel.component.html',
  styleUrls: ['./current-fields-panel.component.scss']
})
export class CurrentFieldsPanelComponent implements OnChanges {
  @Input() fieldGroups: SurveyDataFieldGroup[];

  activeAccordionIds: string[];
  panelController: GenericKeyValue<string, boolean>[];

  constructor() {
    this.activeAccordionIds = [];
    this.panelController = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.fieldGroups?.currentValue) {
      this.updatePanelActiveController();
    }
  }

  trackByGroup(index: any, item: string): string {
    return item;
  }

  trackByField(index: any, item: SurveyDataField): string {
    return `${item.EntitySourceName}_${item.SourceName}`;
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

  private updatePanelActiveController(): void {
    this.fieldGroups.forEach(group => {
      if (!this.panelController.some((p) => p.Key === group.GroupName)) {
        this.panelController.push({ Key: group.GroupName, Value: true });
        this.activeAccordionIds.push(group.GroupName);
      }
    });
  }
}
