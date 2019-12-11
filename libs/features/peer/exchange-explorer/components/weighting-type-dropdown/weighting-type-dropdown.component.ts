import { Component, Input, Output, EventEmitter } from '@angular/core';

import { KendoDropDownItem } from 'libs/models';
import { Weights, WeightsLabeled, WeightType, WeightTypeDisplayLabeled } from 'libs/data/data-sets';

@Component ({
  selector: 'pf-weighting-type-dropdown',
  templateUrl: './weighting-type-dropdown.component.html',
  styleUrls: ['./weighting-type-dropdown.component.scss']
})

export class WeightingTypeDropdownComponent {
  @Input() selectedWeightingType: KendoDropDownItem = { Name: WeightTypeDisplayLabeled.Inc, Value: WeightType.Inc };
  @Input() includeLabel = false;
  @Output() weightingTypeChanged = new EventEmitter();

  weights: KendoDropDownItem[] = this.includeLabel ?  Weights : WeightsLabeled;

  constructor() {}

  handleDropdownValueChanged(item: KendoDropDownItem) {
      this.weightingTypeChanged.emit(item);
  }
}
