import { Component, Input } from '@angular/core';

import { CompanyStructure } from 'libs/models/structures/company-structure.model';

import { JobRangeModelingConstants } from '../../constants/structures.constants';

@Component({
  selector: 'pf-job-based-range-structure-favorite',
  templateUrl: './job-based-range-structure-favorite.component.html',
  styleUrls: ['./job-based-range-structure-favorite.component.scss']
})
export class JobBasedRangeStructureFavoriteComponent {
  @Input() structureFavorite: CompanyStructure;

  jobRangeModelingLink = JobRangeModelingConstants.JOB_RANGE_MODELING_LINK;
}
