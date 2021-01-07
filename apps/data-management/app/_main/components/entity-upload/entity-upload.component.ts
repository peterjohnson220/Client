import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';

import isObject from 'lodash/isObject';

import { FileUploadComponent } from 'libs/features/org-data-loader/components/file-upload/';
import { DATE_FORMATS, LoaderType } from 'libs/features/org-data-loader/constants';
import { DateFormatItem } from 'libs/features/org-data-loader/models';
import { ConfigurationGroup } from 'libs/models/data-loads';

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
  @Input() dateFormat: string;
  @Input() selectedMapping: ConfigurationGroup;
  @Input() mappingOptions: ConfigurationGroup[] = [];
  @Output() onMappingChange: EventEmitter<ConfigurationGroup> = new EventEmitter<ConfigurationGroup>();
  @Output() onDelimiterChange: EventEmitter<String> = new EventEmitter<string>();
  @Output() onDateChange: EventEmitter<String> = new EventEmitter<string>();

  dateFormats: Array<{ text: string, value: string }> = DATE_FORMATS;
  dateFormatsFilteredData: Array<{ text: string, value: string }>;

  constructor() {
    this.dateFormatsFilteredData = this.dateFormats.slice();
  }

  public ClearAllFiles(): void {
    this.uploadComponents.forEach((child) => {
      child.ClearFile();
    });
  }

  selectionChange(dateFormat: DateFormatItem) {
    if (dateFormat) {
      this.dateFormat = dateFormat.value;
    } else {
      this.dateFormat = null;
    }
    this.onDateChange.emit(this.dateFormat);
  }

  filterChange(filter: string) {
    this.dateFormatsFilteredData = this.dateFormats.filter((s) => s.value.indexOf(filter) !== -1);
  }

  public entityWithDateSelected() {
    return (
      this.entities.find(f => f.templateReferenceConstants === LoaderType.Employees).isChecked
      || this.entities.find(f => f.templateReferenceConstants === LoaderType.EmployeeTags).isChecked);
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
