import {Component, Input, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';

import {ControlType} from 'libs/models/common';
import { JobDescriptionControl } from 'libs/models/jdm';

import {JobDescriptionVersionCompareService} from '../../services';
import * as fromJobDescriptionManagementSharedReducer from '../../../shared/reducers';

@Component({
  selector: 'pf-job-description-compare-control-result',
  templateUrl: './job-description-compare-control-result.component.html',
  styleUrls: ['./job-description-compare-control-result.component.scss']
})
export class JobDescriptionCompareControlResultComponent implements OnInit {
  showHeader = true;
  hideBody = true;
  controlType: ControlType;

  @Input() control: JobDescriptionControl;
  @Input() controlTypesLoaded: boolean;
  @Input() index: number;

  constructor(
    private sharedStore: Store<fromJobDescriptionManagementSharedReducer.State>,
    private jobDescriptionVersionCompareService: JobDescriptionVersionCompareService,
  ) { }

  toggleBody() {
    this.hideBody = !this.hideBody;
  }

  wasAdded() {
    return this.control.Statuses && this.jobDescriptionVersionCompareService.wasAdded(this.control.Statuses);
  }

  wasRemoved() {
    return this.control.Statuses && this.jobDescriptionVersionCompareService.wasRemoved(this.control.Statuses);
  }

  wasMoved() {
    return this.control.Statuses && this.jobDescriptionVersionCompareService.wasMoved(this.control.Statuses);
  }

  ngOnInit() {
    this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getControlTypeAndVersion).subscribe((controlTypes) => {
      this.controlType = controlTypes.find(ct => ct.Type === this.control.Type && ct.ControlVersion === this.control.ControlVersion );
    });

    if (this.control.Statuses) {
      this.hideBody = !this.control.Statuses.some(s => s === 'ChildrenChanged');
    }

    if (this.control.AdditionalProperties) {
      this.showHeader = this.control.AdditionalProperties.ShowControlName;
    }

  }
}
