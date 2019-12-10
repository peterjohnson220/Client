import { Component, Input, QueryList, ViewChildren } from '@angular/core';

import { EntityChoice } from '../../models';
import { FileUploadComponent } from '../file-upload/';

@Component({
  selector: 'pf-entity-upload',
  templateUrl: './entity-upload.component.html',
  styleUrls: ['./entity-upload.component.scss']
})
export class EntityUploadComponent {

  @Input() entities: EntityChoice[];

  @ViewChildren('fileUpload') uploadComponents: QueryList<FileUploadComponent>;

  savedMappings$: any;
  showUpload = true;
  selectedMapping: any;
  selectedDelimiter: any;

  constructor() {
    this.selectedDelimiter = '';
    // TODO: Wire me up on constructor
    this.savedMappings$ = [
      { MappingId: -1, MappingName: 'Add New Mapping' },
      { MappingId: 1, MappingName: 'Saved Manual Mapping' }
    ];
  }

  public ClearAllFiles(): void {
    this.uploadComponents.forEach((child) => {
      child.ClearFile();
    });
  }

  selectedEntities(): EntityChoice[] {
    if (!this.entities) {
      return [];
    }

    return this.entities.filter(x => x.isChecked);
  }
}
