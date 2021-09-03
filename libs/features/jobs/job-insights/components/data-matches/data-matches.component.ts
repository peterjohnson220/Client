import { Component, Input } from '@angular/core';

import { compRate } from 'libs/core';
import { PricingMatchForJobInsights } from 'libs/models/payfactors-api/jobs';

@Component({
  selector: 'pf-data-matches',
  templateUrl: './data-matches.component.html',
  styleUrls: ['./data-matches.component.scss']
})
export class DataMatchesComponent {
  @Input() jobTitleCode: string;
  @Input() pricingMatches: PricingMatchForJobInsights[];
  @Input() rate = compRate.annual;

  basePayFields = ['Base10', 'Base25', 'Base50', 'Base75', 'Base90'];
  totalCashFields = ['TCC10', 'TCC25', 'TCC50', 'TCC75', 'TCC90'];
  displayNames = ['10th', '25th', '50th', '75th', '90th'];
}
