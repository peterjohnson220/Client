import { Component } from '@angular/core';

import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStructuresMainReducer from '../../../reducers';
import { CompanyStructureRangeGroup } from '../../../../../../../libs/models/structures/company-structure-range-group.model';
import * as fromJobRangeModelingModalActions from '../../../actions/job-range-modeling-modal.actions';

@Component({
  selector: 'pf-modeling-settings-modal-page',
  templateUrl: './modeling-settings-modal-page.component.html',
  styleUrls: ['./modeling-settings-modal-page.component.scss']
})
export class ModelingSettingsModalPageComponent {
  currentModel: CompanyStructureRangeGroup;

  currentModelSubscription: Subscription;

  constructor(
    private store: Store<fromStructuresMainReducer.State>
  ) {
    this.currentModelSubscription = this.store.select(fromStructuresMainReducer.getCurrentModel).subscribe(
      emittedModel => {
        this.currentModel = emittedModel;
        if (this.currentModel && this.currentModel.RangeGroupName) {
          this.store.dispatch(new fromJobRangeModelingModalActions.UpdateTitle(`${this.currentModel.RangeGroupName} - Model Settings`));
        }
      });
  }
}
