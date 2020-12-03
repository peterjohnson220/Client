import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';

import isObject from 'lodash/isObject';

import { ConfigurationGroup } from 'libs/models/data-loads';
import { FileUploadComponent } from 'libs/features/org-data-loader/components/file-upload/';

import { EntityChoice } from '../../models';


@Component({
  selector: 'pf-entity-upload',
  templateUrl: './entity-upload.component.html',
  styleUrls: ['./entity-upload.component.scss']
})
export class EntityUploadComponent {
  @ViewChildren('fileUpload') uploadComponents: QueryList<FileUploadComponent>;

  @Input() entities: EntityChoice[];
  @Input() selectedDelimiter = ',';

  @Input() selectedMapping: ConfigurationGroup;
  @Input() mappingOptions: ConfigurationGroup[] = [];
  @Output() onMappingChange: EventEmitter<ConfigurationGroup> = new EventEmitter<ConfigurationGroup>();
  @Output() onDelimiterChange: EventEmitter<String> = new EventEmitter<string>();

  constructor() { }

  public ClearAllFiles(): void {
    this.uploadComponents.forEach((child) => {
      child.ClearFile();
    });
  }

  public HasAnyFiles(): boolean {
    const a = this.entities.findIndex(f => f.isChecked && isObject(f.File));
    return a >= 0;
  }

  public ClearAllErrorMessages(): void {
    this.uploadComponents.forEach((child) => {
      child.ClearErrorMessage();
    });
  }

  public mappingChange($event: any) {
    this.onMappingChange.emit($event);
  }

  public delimiterChange($event: string) {
    this.onDelimiterChange.emit($event);
  }

  selectedEntities(): EntityChoice[] {
    if (!this.entities) {
      return [];
    }

    return this.entities.filter(x => x.isChecked);
  }
}
