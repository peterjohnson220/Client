import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KendoDropDownItem } from '../../../../../models';
import { Weights, WeightsLabeled, WeightTypeDisplay } from '../../../../../data/data-sets';



@Component ({
  selector: 'pf-weighting-type-dropdown',
  templateUrl: './weighting-type-dropdown.component.html',
  styleUrls: ['./weighting-type-dropdown.component.scss']
})

export class WeightingTypeDropdownComponent {
  @Input() selectedWeightingType = WeightTypeDisplay.Inc;
  @Input() includeLabel;
  @Output() weightingTypeChanged = new EventEmitter();

  weights: KendoDropDownItem[] = this.includeLabel ? WeightsLabeled : Weights;

  constructor() {}
  handleDropdownValueChanged(item: KendoDropDownItem) {
      this.weightingTypeChanged.emit(item);
  }
}
