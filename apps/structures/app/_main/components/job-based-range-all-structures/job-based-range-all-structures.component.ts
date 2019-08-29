import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { CompanyStructureView } from 'libs/models/structures/company-structure-view.model';

@Component({
  selector: 'pf-job-based-range-all-structures',
  templateUrl: './job-based-range-all-structures.component.html',
  styleUrls: ['./job-based-range-all-structures.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobBasedRangeAllStructuresComponent {
  @Input() isCompanyStructureViewsLoading: boolean;
  @Input() isCompanyStructureViewsLoadingError: boolean;
  @Input() filteredCompanyStructureViews: CompanyStructureView[];
  @Output() favoriteClicked: EventEmitter<CompanyStructureView> = new EventEmitter();

  handleFavoriteClicked(structureView: CompanyStructureView) {
    this.favoriteClicked.emit(structureView);
  }
}
