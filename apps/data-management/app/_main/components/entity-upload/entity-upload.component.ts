import { Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';

import { ConfigurationGroup, EntityChoice } from '../../models';
import { FileUploadComponent } from '../file-upload/';

@Component({
  selector: 'pf-entity-upload',
  templateUrl: './entity-upload.component.html',
  styleUrls: ['./entity-upload.component.scss']
})
export class EntityUploadComponent {
  @ViewChildren('fileUpload') uploadComponents: QueryList<FileUploadComponent>;

  @Input() entities: EntityChoice[];
  @Input() selectedDelimiter: string;

  @Input() selectedMapping: ConfigurationGroup;
  @Input() mappingOptions: ConfigurationGroup[] = [];
  @Output() onMappingChange: EventEmitter<ConfigurationGroup> = new EventEmitter<ConfigurationGroup>();

  constructor() { }

  public ClearAllFiles(): void {
    this.uploadComponents.forEach((child) => {
      child.ClearFile();
    });
  }

  public mappingChange($event: any) {
    this.onMappingChange.emit($event);
  }

  selectedEntities(): EntityChoice[] {
    if (!this.entities) {
      return [];
    }

    return this.entities.filter(x => x.isChecked);
  }
}
