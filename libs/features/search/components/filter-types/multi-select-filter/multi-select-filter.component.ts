import { Component, EventEmitter, Input, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { MultiSelectFilter, MultiSelectOption } from '../../../models';
import * as fromCompanyDescriptionActions from '../../../../company/company-detail/actions';
import * as fromSearchReducer from '../../../reducers';
import * as fromCompanyDescriptionReducer from '../../../../company/company-detail/reducers';

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
  subsidiaryJobDescription$: Observable<string>;
  loadingSubsidiaryJobDescription: Observable<boolean>;
  hoveringOption: MultiSelectOption;

  constructor (public store: Store<fromSearchReducer.State>) {
    this.companyDescription$ = this.store.pipe(select(fromCompanyDescriptionReducer.getCompanyDescription));
    this.loadingCompanyDescription = this.store.pipe(select(fromCompanyDescriptionReducer.getCompanyDescriptionLoading));
    this.subsidiaryJobDescription$ = this.store.pipe(select(fromCompanyDescriptionReducer.getSubsidiaryDescription));
    this.loadingSubsidiaryJobDescription = this.store.pipe(select(fromCompanyDescriptionReducer.getSubsidiaryDescriptionLoading));
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

  mouseEnter(option: MultiSelectOption) {
    this.hoveringOption = option;
      setTimeout( () => {
        switch (this.filter.BackingField) {
          case 'company_name':
            const companyId = Number(JSON.parse(option.Value));
            if (this.hoveringOption && this.hoveringOption.Name === option.Name) {
              this.store.dispatch(new fromCompanyDescriptionActions.GetCompanyDescription(companyId));
            }
            break;
          case 'subsidiary_name':
            const subsidiaryId = Number(JSON.parse(option.Value).ChildOptionValue);
            if (this.hoveringOption && this.hoveringOption.Name === option.Name) {
              this.store.dispatch(new fromCompanyDescriptionActions.GetSubsidiaryDescription(subsidiaryId));
            }
            break;
          default:
            break;
        }
      }, 500 );
  }

  onMouseLeave() {
    this.hoveringOption = null;
  }
}
