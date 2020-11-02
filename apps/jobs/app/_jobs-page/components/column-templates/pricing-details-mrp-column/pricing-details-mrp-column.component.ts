import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

import { MrpFormatterService } from 'libs/core/services/mrp-formatter.service';
import { MrpModel } from 'libs/models/common/mrp.model';

@Component({
  selector: 'pf-pricing-details-mrp-column',
  templateUrl: './pricing-details-mrp-column.component.html'
})

export class PricingDetailsMrpColumnComponent implements OnChanges {
  @Input() dataRow: any;
  @Input() fieldName: string;
  @Input() mrpDisplayOverrides: any;

  mrpModel: MrpModel;
  mrpOverride = '';

  constructor(private mrpFormatterService: MrpFormatterService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mrpDisplayOverrides'] && changes['fieldName']) {
      this.mrpOverride = changes['mrpDisplayOverrides']
        .currentValue[
          Object.keys(changes['mrpDisplayOverrides'].currentValue)
            .find(key => changes['fieldName'].currentValue.includes(key))
        ];
    }

    if (changes['fieldName']) {
      this.mrpModel = this.mrpFormatterService.formatMrp(changes['fieldName'].currentValue, this.dataRow);
    }
  }
}
