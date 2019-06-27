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

  validationResultItemTypes = ValidationResultItemTypeEnum;

  ngOnInit() {
    this.hideIfEmpty = this.hideIfEmpty || false;
  }

  isTableVisible() {
    return !this.hideIfEmpty || this.validationResults.length > 0;
  }
}


