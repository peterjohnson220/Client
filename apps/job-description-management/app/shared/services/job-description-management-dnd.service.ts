import { Injectable } from '@angular/core';

import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/Subscription';

import { DragulaHelperService } from 'libs/core/services';

import { JobDescriptionManagementDndSource } from '../constants';

@Injectable()
export class JobDescriptionManagementDnDService {
  private dndSource: JobDescriptionManagementDndSource;
  private dragulaSubscription: Subscription;

  constructor(
    private dragulaService: DragulaService) {
  }

  initJobDescriptionManagementDnD(fromDndSource: JobDescriptionManagementDndSource, reOrderCallbackFn: any) {
    this.dndSource = fromDndSource;

    this.dragulaService.createGroup('control-data-reorder-bag', {
      accepts: function(el, target, source) {
        return source === target;
      },
      moves: function (el) {
        return el.classList.contains('re-orderable');
      }
    });

    // Drop
    this.dragulaSubscription = this.dragulaService.dropModel('control-data-reorder-bag').subscribe(dropModel => {
      if (!dropModel) {
        return;
      }

      // TODO: [BC] Fragile, assuming this is three parent elements up.
      const controlDataRendererElementData = dropModel.target.parentElement.parentElement.parentElement.dataset;
      const reorderControlData = {
        SectionId: controlDataRendererElementData.sectionId,
        Id: controlDataRendererElementData.controlId
      };

      if (this.dndSource !== JobDescriptionManagementDndSource.ControlManagement) {
        const {sourceIndex, targetIndex} = DragulaHelperService.getReorderSourceAndTargetIndex(dropModel);
        if (reOrderCallbackFn) {
          reOrderCallbackFn(reorderControlData, sourceIndex, targetIndex);
        }
      }
    });
  }

  destroyJobDescriptionManagementDnD() {
    this.dragulaService.destroy('control-data-reorder-bag');
    if (this.dragulaSubscription) {
      this.dragulaSubscription.unsubscribe();
    }
  }
}
