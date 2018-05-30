import { Component, Input, ChangeDetectionStrategy} from '@angular/core';

import { ExchangeStatCompanyMakeup } from 'libs/models';

import { GuidelineLimits } from '../../models';

@Component({
  selector: 'pf-guidelines-badge',
  templateUrl: './guidelines-badge.component.html',
  styleUrls: ['./guidelines-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuidelinesBadgeComponent {
  @Input() companies: ExchangeStatCompanyMakeup[];
  @Input() guidelineLimits: GuidelineLimits;

  get hasMinimumCompanies(): boolean {
    return this.hasCompaniesAndLimits &&
      this.companies.length >= this.guidelineLimits.MinCompanies;
  }

  get hasNoDominatingData(): boolean {
    return this.hasCompaniesAndLimits &&
      !this.companies.some(c => c.Percentage > this.guidelineLimits.DominatingPercentage);
  }

  get dominatingCompanies(): any[] {
    return this.hasCompaniesAndLimits &&
      this.companies.filter(c => c.Percentage > this.guidelineLimits.DominatingPercentage).map(c => {
        return {
          Company: c.Company,
          Percentage: +(c.Percentage * 100).toFixed(2)
        };
      }
    );
  }

  get hasCompaniesAndLimits(): boolean {
    return this.companies && !!this.guidelineLimits;
  }

  constructor() { }
}
