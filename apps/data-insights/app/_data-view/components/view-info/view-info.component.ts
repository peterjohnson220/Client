import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { IntlService } from '@progress/kendo-angular-intl';

import { UserDataView, Filter } from 'libs/features/formula-editor';

@Component({
  selector: 'pf-view-info',
  templateUrl: './view-info.component.html',
  styleUrls: ['./view-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewInfoComponent implements OnChanges {
  @Input() dataView: UserDataView;
  @Input() activeFilters: Filter[];

  showViewInformation: boolean;
  message: string;
  constructor(private intlService: IntlService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!!changes) {
      this.updateViewInformation();
    }
  }

  private updateViewInformation() {
    this.showViewInformation = this.dataView && this.dataView.Entity.Name === 'Employee History';
    if (this.showViewInformation && this.activeFilters && this.activeFilters.length) {
      this.message = `Data displayed reflects an effective date of ${this.getEffectiveDate()}.`;
    }
  }

  private getEffectiveDate(): string {
    const effectiveDateFilter = this.activeFilters.find(f => f.IsLocked);
    if (effectiveDateFilter && effectiveDateFilter.SelectedOptions.length) {
      const value = this.intlService.parseDate(effectiveDateFilter.SelectedOptions[0]);
      return this.intlService.formatDate(value, 'MM/dd/yyyy');
    }
    return null;
  }

}
