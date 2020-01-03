import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { isObject } from 'lodash';

import { EntityDataField } from '../../models';

@Component({
  selector: 'pf-entity-mapping',
  templateUrl: './entity-mapping.component.html',
  styleUrls: ['./entity-mapping.component.scss']
})
export class EntityMappingComponent implements OnChanges {

  @Input() entity: string;
  @Input() providerFields: EntityDataField[];
  @Input() payfactorsFields: EntityDataField[];

  filteredProviderFields: EntityDataField[];
  filteredPayfactorsFields: EntityDataField[];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (isObject(changes.providerFields)) {
      this.filteredProviderFields = this.providerFields;
    }

    if (isObject(changes.payfactorsFields)) {
      this.filteredPayfactorsFields = this.payfactorsFields;
    }
  }

  handleSearchTermChanged(searchTerm: string, type: string): void {
    if (type === 'provider' && this.providerFields && this.providerFields.length) {
      this.filteredProviderFields = this.providerFields.filter( pf =>
        pf.FieldName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
      );
    }

    if (type === 'payfactors' && this.payfactorsFields && this.payfactorsFields.length) {
      this.filteredPayfactorsFields = this.payfactorsFields.filter( pf =>
        pf.FieldName.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
      );
    }
  }
}
