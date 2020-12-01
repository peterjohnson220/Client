import { Component, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';

import * as moment from 'moment';

import { StructureDetails } from '../models/structure-details.model';
import { PfThemeType } from '../../../features/pf-data-grid/enums/pf-theme-type.enum';

@Component({
  selector: 'pf-structure-details',
  templateUrl: './structure-details.component.html',
  styleUrls: ['./structure-details.component.scss']
})
export class StructureDetailsComponent implements OnChanges {

  @Input() structureDetails: StructureDetails;
  @Input() theme = PfThemeType.Default;
  @Input() optionalCloseButton: TemplateRef<any>;

  summaryText = '';

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['structureDetails']) {
      const structureDetails = changes['structureDetails'].currentValue;

      const effectiveDate = moment(structureDetails.EffectiveDate).format('MM/DD/YYYY');
      this.summaryText = this.summaryText + `The structure ${structureDetails.StructureName} was created in ${structureDetails.CurrencyCode} based on an `;
      this.summaryText = this.summaryText + `${structureDetails.Rate.toLowerCase()} rate and is effective ${effectiveDate}. `;
      this.summaryText = this.summaryText + `This structure is in the ${structureDetails.PayMarket} pay market `;
      this.summaryText = this.summaryText + `with market data based on the ${structureDetails.ControlPoint}.`;
    }
  }

}
