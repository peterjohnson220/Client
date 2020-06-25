import { Component, Input, Output, EventEmitter } from '@angular/core';

import { KendoDropDownItem } from 'libs/models';
import { Weights, WeightsLabeled } from 'libs/data/data-sets';

@Component ({
  selector: 'pf-weighting-type-dropdown',
  templateUrl: './weighting-type-dropdown.component.html',
  styleUrls: ['./weighting-type-dropdown.component.scss']
})

export class WeightingTypeDropdownComponent {
  @Input() selectedWeightingType: KendoDropDownItem;
  @Input() includeLabel: boolean;
  @Input() inComponent = true;
  @Output() weightingTypeChanged = new EventEmitter();

  constructor() {}

  get weights(): KendoDropDownItem[] {
    return this.includeLabel ?  Weights : WeightsLabeled;
  }

  get popupSettings() {
    return this.inComponent ? { popupClass: 'drop-up', appendTo: 'component'} : {};
  }

  handleDropdownValueChanged(item: KendoDropDownItem) {
      this.weightingTypeChanged.emit(item);
  }
}
