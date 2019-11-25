import { Component, Input, Output, EventEmitter } from '@angular/core';

import { WeightingType } from 'libs/constants/weighting-type';

@Component ({
  selector: 'pf-weighting-type-dropdown',
  templateUrl: './weighting-type-dropdown.component.html',
  styleUrls: ['./weighting-type-dropdown.component.scss']
})

export class WeightingTypeDropdownComponent {
  @Input() selectedWeightingType = WeightingType.INC_WEIGHTED;
  @Output() weightingTypeChanged = new EventEmitter();

  availableWeightingTypes = [WeightingType.INC_WEIGHTED, WeightingType.ORG_WEIGHTED];

  constructor() {}

  handleDropdownValueChanged(selectedWeightingType: string) {
    if (selectedWeightingType === WeightingType.INC_WEIGHTED) {
      this.weightingTypeChanged.emit(WeightingType.INC);
    } else {
      this.weightingTypeChanged.emit(WeightingType.ORG);
    }
  }
}
