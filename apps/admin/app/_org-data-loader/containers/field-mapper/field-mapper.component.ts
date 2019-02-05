import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FileRestrictions } from '@progress/kendo-angular-upload';
import {Observable} from 'rxjs';

import {
  DATE_FORMATS, ORG_DATA_CLIENTFIELDS_INDEX_RESET, ORG_DATA_REMOVE_URL,
  ORG_DATA_UPLOAD_URL
} from '../../constants';
import {DateFormatItem, LoaderFieldSet} from '../../models';

@Component({
  selector: 'pf-field-mapper',
  templateUrl: './field-mapper.component.html',
  styleUrls: ['./field-mapper.component.scss']
})
export class FieldMapperComponent implements OnInit {
  uploadSaveUrl: string;
  removeUrl: string;
  fileRestrictions: FileRestrictions;
  clientFields;
  selectedPfField: string;
  selectedClientField: string;
  mappedFields: string[];
  selectedMapping: string;
  payfactorsDataFieldsForReset: string[];
  dateFormats: Array<{ text: string, value: string}> = DATE_FORMATS;
  dateFormatsFilteredData: Array<{ text: string, value: string}>;

  @Input() fieldMappings$: Observable<LoaderFieldSet[]>;
  @Input() fieldMappingsLoading: boolean;
  @Input() payfactorsDataFields: string[];
  @Input() loaderType: string;
  @Input() dateFormat: string;
  @Input() delimiter: string;
  @Output() mappingComplete = new EventEmitter<any>();

  constructor() {
    this.uploadSaveUrl = ORG_DATA_UPLOAD_URL;
    this.removeUrl = ORG_DATA_REMOVE_URL;
    this.fileRestrictions  = {
      allowedExtensions: ['csv']
    };
    this.mappedFields = [];
    this.clientFields = [];
    this.dateFormatsFilteredData = this.dateFormats.slice();
  }

  ngOnInit() {
    this.payfactorsDataFieldsForReset = this.payfactorsDataFields;
    this.fieldMappings$.subscribe(mappings => {
      if (mappings.length > 0) {
        const entityMapping = mappings.find(lfs => lfs.LoaderType === this.loaderType);
        if (entityMapping) {
          for (const mapping of entityMapping.LoaderFieldMappings) {
            this.addMapping(mapping.InternalField, mapping.ClientField);
          }
        }
      }
    });
  }

  successEventHandler = function($event) {
    if ($event.response.body) {
      this.clientFields = $event.response.body.value;
      this.mapSimilarFields();
      this.fireCompleteEvent();
    }
  };

  uploadEventHandler = function($event) {
    this.resetMapping();
    $event.data = {delimiter: this.delimiter};
  };

  removeEventHandler = function() {
    this.resetMapping();
    this.fireCompleteEvent();
  };

  ApplyMapping() {
    this.addMapping(this.selectedPfField, this.selectedClientField);
    this.selectedClientField = '';
    this.selectedPfField = '';
  }

  formatMappingForDisplay(field: string) {
    return field.replace('__', ' > ');
  }

  RemoveMapping() {
    const fields = this.selectedMapping.split('__');

    this.payfactorsDataFields.push(fields[0]);
    this.clientFields.push(fields[1]);
    this.mappedFields = this.mappedFields.filter(x => x !== this.selectedMapping);

    this.selectedMapping = '';
    this.fireCompleteEvent();
  }

  selectionChange(dateFormat: DateFormatItem) {
    if (dateFormat) {
      this.dateFormat = dateFormat.value;
      this.fireCompleteEvent();
    } else {
      this.dateFormat = null;
      this.fireCompleteEvent();
    }
  }

  filterChange(filter: string) {
    this.dateFormatsFilteredData = this.dateFormats.filter((s) => s.value.indexOf(filter) !== -1);
  }

  // Private Methods

  private addMapping(pfField, clientField) {
    const value = pfField + '__' + clientField;
    this.mappedFields.push(value);

    this.payfactorsDataFields = this.payfactorsDataFields.filter(x => x !== pfField);
    this.clientFields = this.clientFields.filter(x => x !== clientField);
    this.fireCompleteEvent();
  }

  private compareFields(pfField, clientField) {
    pfField = pfField.toLowerCase().replace(new RegExp('[_ ]', 'g'), '');
    clientField = clientField.toLowerCase().replace(new RegExp('[_ ]', 'g'), '');

    return pfField === clientField;
  }
  private mapSimilarFields() {
    for (let i = 0; i < this.clientFields.length; i++) {
      /* the Bonus_Target field in the client files do not map to the Pf Bonus_Target field,
    but rather to the BonusTargetPct so we need to ignore this auto mapping */
      if (this.clientFields[i] === 'Bonus_Target') {
        continue;
      }
      for (let j = 0; j < this.payfactorsDataFields.length; j++) {
        if (this.compareFields(this.payfactorsDataFields[j], this.clientFields[i])) {
          this.addMapping(this.payfactorsDataFields[j], this.clientFields[i]);
          i = ORG_DATA_CLIENTFIELDS_INDEX_RESET;
          break;
        }
      }
    }
  }

  private fireCompleteEvent() {
    if (this.clientFields.length > 0 || (this.loaderType === 'Employees' && (!this.dateFormat || this.dateFormat === ''))) {
      this.mappingComplete.emit({
        complete: false
      });
    } else {
      this.mappingComplete.emit({
        complete: true,
        mappings: this.mappedFields,
        dateFormat: this.dateFormat
      });
    }
  }

  private resetMapping() {
    this.clientFields = [];
    this.mappedFields = [];
    this.payfactorsDataFields = this.payfactorsDataFieldsForReset;
    this.fireCompleteEvent();
  }
}
