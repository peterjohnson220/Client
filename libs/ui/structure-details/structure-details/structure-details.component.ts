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

  displayDetails: StructureDetails;
  effectiveDate: string;
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['structureDetails']) {
      this.displayDetails = changes['structureDetails'].currentValue;
      this.effectiveDate = moment(this.structureDetails.EffectiveDate).format('MM/DD/YYYY');
    }
  }

}
