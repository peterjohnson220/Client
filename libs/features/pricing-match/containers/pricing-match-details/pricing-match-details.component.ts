import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { copyTextToClipboard } from 'libs/core/functions';
import { PricingMatchTypes } from '../../constants';

@Component({
  selector: 'pf-pricing-match-details',
  templateUrl: './pricing-match-details.component.html',
  styleUrls: ['./pricing-match-details.component.scss']
})
export class PricingMatchDetailsComponent implements OnInit, OnChanges {
  @Input() pricingMatch: any;
  @Input() pricingMatchType: string;
  pricingMatchTypes = PricingMatchTypes;
  source: string;
  scope: string;
  constructor() {
    this.pricingMatchTypes = PricingMatchTypes;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pricingMatchType'] && changes['pricingMatchType'].currentValue) {
      switch (this.pricingMatchType) {
        case PricingMatchTypes.MD_JOB:
          this.source = `Payfactors effective`;
          this.scope = `${this.pricingMatch.Name} -
            ${this.pricingMatch.IndustryValue} ${this.pricingMatch.IndustryValue === 'All' ? 'Industries' : this.pricingMatch.IndustryValue}/
            ${this.pricingMatch.SizeValue} ${this.pricingMatch.SizeValue === 'All' ? 'Sizes' : '(' + this.pricingMatch.SizeLabel + ')'}/
            ${this.pricingMatch.GeoValue} ${this.pricingMatch.GeoValue === 'All' ? 'Locations' : ''}`;
          break;
        case PricingMatchTypes.SURVEY:
          this.source = `${this.pricingMatch.Publisher} ${this.pricingMatch.SurveyName} effective`;
          this.scope = `${this.pricingMatch.Scope}`;
          break;
        default:
          break;
      }
    }
  }

  onClipboardClick() {
    copyTextToClipboard(this.pricingMatch.JobDescription);
  }
}
