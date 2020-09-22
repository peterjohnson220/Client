import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

import { Observable } from 'rxjs';

import { FileRestrictions } from '@progress/kendo-angular-upload';

import {
    BONUS_TARGET_COLUMN_NAME, BONUS_TARGET_DISPLAY_NAME, DATE_FORMATS, LoaderType, ORG_DATA_CLIENTFIELDS_INDEX_RESET, ORG_DATA_REMOVE_URL,
    ORG_DATA_UPLOAD_URL
} from 'libs/features/org-data-loader/constants';
import {
    DateFormatItem, EntityFieldMappingDefinitionModel, FilenamePattern, getEntityFieldMappingDefinition, LoaderEntityStatus,
    VisibleLoaderOptionModel
} from 'libs/features/org-data-loader/models';
import { LoaderFieldSet } from 'libs/models/data-loads';

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
  dateFormats: Array<{ text: string, value: string }> = DATE_FORMATS;
  dateFormatsFilteredData: Array<{ text: string, value: string }>;
  templateReferenceConstants = {
    LoaderType,
  };


  @Input() fieldMappings$: Observable<LoaderFieldSet[]>;
  @Input() fieldMappingsLoading: boolean;
  @Input() payfactorsDataFields: string[];
  @Input() loaderType: LoaderType;
  @Input() dateFormat: string;
  @Input() delimiter: string;
  @Input() isFullReplace: boolean;
  @Input() loadEnabled: boolean;
  @Input() filenamePattern: FilenamePattern;
  @Input() visibleLoaderOptions: VisibleLoaderOptionModel;
  @Input() suppliedClientFields: string[] = [];
  @Output() mappingComplete = new EventEmitter<any>();
  private mappingErrorMessage = false;

  constructor() {
    this.uploadSaveUrl = ORG_DATA_UPLOAD_URL;
    this.removeUrl = ORG_DATA_REMOVE_URL;
    this.fileRestrictions = {
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
        this.resetMapping();
        if (this.suppliedClientFields.length === 0) {
          this.addSavedMappings(mappings);
        } else {
          const entityMappings = mappings.find(item => item.LoaderType === this.loaderType);
          if (this.clientFieldsMatchSavedMappings(entityMappings)) {
            this.addSavedMappings(mappings);
          } else {
            entityMappings ? this.mappingErrorMessage = true : this.mappingErrorMessage = false;
            this.clientFields = this.suppliedClientFields;
            this.mapSimilarFields();
          }
        }
      } else {
        if (this.suppliedClientFields.length !== 0) {
          this.resetMapping();
          this.clientFields = this.suppliedClientFields;
          this.mapSimilarFields();
        }
      }
    });
  }

  private addSavedMappings(mappings) {
    this.mappedFields = [];
    const entityMapping = mappings.find(lfs => lfs.LoaderType === this.loaderType);
    if (entityMapping) {
      for (const mapping of entityMapping.LoaderFieldMappings) {
        let internalField = mapping.InternalField;
        if (internalField === BONUS_TARGET_COLUMN_NAME) {
          internalField = BONUS_TARGET_DISPLAY_NAME;
        }
        this.addMapping(internalField, mapping.ClientField);
      }
    }
  }

  changeIsFullReplace(isFullReplace: boolean) {
    this.isFullReplace = isFullReplace;
    this.fireCompleteEvent();
  }

  successEventHandler = function ($event) {
    if ($event.response.body) {
      this.clientFields = $event.response.body.value;
      this.mapSimilarFields();
      this.fireCompleteEvent();
    }
  };

  uploadEventHandler = function ($event) {
    this.resetMapping();
    $event.data = { delimiter: this.delimiter };
  };

  removeEventHandler = function () {
    this.resetMapping();
    this.fireCompleteEvent();
  };

  ApplyMapping() {
    this.addMapping(this.selectedPfField, this.selectedClientField);
    this.fireCompleteEvent();
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
  }

  private compareFields(pfField, clientField) {
    const pfFieldOriginal = pfField;

    pfField = this.applyRegExp(pfField);
    clientField = this.applyRegExp(clientField);

    if (pfField !== clientField) {
      const custField = getEntityFieldMappingDefinition(this.loaderType).fieldMappingDefinitionModel.find(f => f.Key === pfFieldOriginal);
      if (custField !== undefined) {
        return this.applyRegExp(custField.Value) === clientField;
      }
      return false;
    }
    return true;
  }

  private applyRegExp(value) {
    return value.toLowerCase().replace(new RegExp('[_ ]', 'g'), '');
  }

  private mapSimilarFields() {
    for (let i = 0; i < this.clientFields.length; i++) {
      for (let j = 0; j < this.payfactorsDataFields.length; j++) {
        if (this.compareFields(this.payfactorsDataFields[j], this.clientFields[i])) {
          this.addMapping(this.payfactorsDataFields[j], this.clientFields[i]);
          i = ORG_DATA_CLIENTFIELDS_INDEX_RESET;
          break;
        }
      }
    }
    this.fireCompleteEvent();
  }

  private fireCompleteEvent() {
    let payload: LoaderEntityStatus = {
      complete: this.clientFields.length === 0,
      loaderType: this.loaderType,
      loadEnabled: true,
      mappings: this.clientFields.length === 0 ? this.mappedFields : null,
    };

    payload = this.configureCompleteEventPayloadForLoaderType(payload);

    this.mappingComplete.emit(payload);
  }

  private configureCompleteEventPayloadForLoaderType(basePayload: LoaderEntityStatus) {
    let payload: LoaderEntityStatus = {
      ...basePayload,
    };

    switch (this.loaderType) {
      case LoaderType.Employees:
        payload = {
          ...payload,
          complete: isString(this.dateFormat) && !isEmpty(this.dateFormat) && payload.complete,
          dateFormat: this.dateFormat,
          isFullReplace: this.isFullReplace,
        };
        break;
      case LoaderType.StructureMapping:
        payload = {
          ...payload,
          isFullReplace: this.isFullReplace,
        };
        break;
    }

    return payload;
  }

  private resetMapping() {
    this.clientFields = [];
    this.mappedFields = [];
    this.payfactorsDataFields = this.payfactorsDataFieldsForReset;
    this.fireCompleteEvent();
  }

  private clientFieldsMatchSavedMappings(entityMapping: LoaderFieldSet) {
    let areHeadersValid = true;

    if (!entityMapping) {
      return false;
    }
    this.suppliedClientFields.forEach(field => {
      if (!entityMapping.LoaderFieldMappings.find(mapping => mapping.ClientField === field)) {
        areHeadersValid = false;
      }
    });

    return areHeadersValid;
  }
}
