import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { EntityDescriptionTypeEnum } from 'libs/models/entity-description/entity-description-type.enum';

import { MultiSelectFilter, MultiSelectOption } from '../../../models';
import * as fromSearchReducer from '../../../reducers';

@Component({
  selector: 'pf-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
  styleUrls: ['./multi-select-filter.component.scss']
})
export class MultiSelectFilterComponent {
  @Input() filter: MultiSelectFilter;
  @Input() displayDescriptions = false;
  @Output() optionSelected: EventEmitter<{filterId: string, option: MultiSelectOption}> = new EventEmitter();

  companyDescription$: Observable<string>;
  loadingCompanyDescription: Observable<boolean>;

  constructor (public store: Store<fromSearchReducer.State>) {
  }

  optionDisabled(option: MultiSelectOption) {
    return (!option.Selected && option.Count === 0) || this.filter.Locked;
  }

  handleOptionSelected(filterId: string, option: MultiSelectOption) {
    if (this.optionDisabled(option)) {
      return;
    }
    this.optionSelected.emit({ filterId, option });
  }
  fieldHasDescription(): boolean {
    return this.displayDescriptions && (this.filter.BackingField === 'company_name' || this.filter.BackingField === 'subsidiary_name');
  }

  getEntityId(option: MultiSelectOption) {
    switch (this.filter.BackingField) {
      case 'company_name':
        return Number(JSON.parse(option.Value));
      case 'subsidiary_name':
        return Number(JSON.parse(option.Value).ChildOptionValue);
    }
  }

  getEntityType() {
    switch (this.filter.BackingField) {
      case 'company_name':
        return EntityDescriptionTypeEnum.Company;
      case 'subsidiary_name':
        return EntityDescriptionTypeEnum.Subsidiary;
    }
  }
}
