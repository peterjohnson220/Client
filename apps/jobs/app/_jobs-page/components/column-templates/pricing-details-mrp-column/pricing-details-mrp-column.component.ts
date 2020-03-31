import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'pf-pricing-details-mrp-column',
  templateUrl: './pricing-details-mrp-column.component.html'
})

export class PricingDetailsMrpColumnComponent implements OnChanges {
  @Input() dataRow: any;
  @Input() fieldName: string;
  category: string;
  percentileSuffix = 'th';
  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fieldName']) {
      this.category = changes['fieldName'].currentValue.split('CompanyJobs_Pricings_')[1].split('MRP')[0];

      const percentile = this.dataRow[`CompanyJobs_Pricings_${this.category}_Reference_Point`];

      if (percentile) {
        const percentileString = percentile.toString();
        switch (percentileString.slice(percentileString.length - 1)) {
          case '1':
            this.percentileSuffix = 'st';
            break;
          case '2':
            this.percentileSuffix = 'nd';
            break;
          case '3':
            this.percentileSuffix = 'rd';
            break;
          default:
            this.percentileSuffix = 'th';
            break;
        }
      }
    }
  }
}
