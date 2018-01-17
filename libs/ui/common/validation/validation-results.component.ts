import { Component, Input, OnInit } from '@angular/core';

import { ValidationResultItem, ValidationResultItemTypeEnum } from '../../../models';

@Component({
  selector: 'pf-validation-results',
  templateUrl: './validation-results.component.html',
  styleUrls: [ './validation-results.component.scss' ]
})
export class ValidationResultsComponent implements OnInit {
  @Input() validationResults: ValidationResultItem[];
  @Input() hideIfEmpty: boolean;

  ngOnInit() {
    this.hideIfEmpty = this.hideIfEmpty || false;
  }

  isTableVisible() {
    return !this.hideIfEmpty || this.validationResults.length > 0;
  }

  getTypeIconClass(validationResultItem: ValidationResultItem) {
    switch (validationResultItem.Type) {
      case ValidationResultItemTypeEnum.Success:
        return 'far fa-check-circle text-success';
      case ValidationResultItemTypeEnum.Info:
        return 'fas fa-info-circle text-info';
      case ValidationResultItemTypeEnum.Warning:
        return 'fas fa-exclamation-triangle text-warning';
      case ValidationResultItemTypeEnum.Error:
        return 'fas fa-exclamation-circle text-danger';
    }
  }
}


