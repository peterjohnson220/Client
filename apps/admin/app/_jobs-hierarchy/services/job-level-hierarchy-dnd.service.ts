import { Injectable } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { DragulaService } from 'ng2-dragula';

import { DragulaHelperService } from 'libs/core';

@Injectable()
export class JobLevelHierarchyDndService {
    private dropSubscription: Subscription;

    constructor(private dragulaService: DragulaService) { }

    initDnD(dropCompleteCallbackFn: any) {
        this.dragulaService.createGroup('job-levels-in-hierarchy-bag', {
            moves: function (el, container, handle) {
                return (handle.classList.contains('dnd-job-level-reorder-handle'));
            }
        });

        this.dropSubscription = this.dragulaService.dropModel('job-levels-in-hierarchy-bag').subscribe((dropModel) => {
            this.onDropModel(dropModel, dropCompleteCallbackFn);
        });
    }

    private onDropModel(dropModel, dropCompleteCallbackFn) {
        const reOrderObj = DragulaHelperService.getReorderSourceAndTargetIndex(dropModel);
        const attributeIndex = dropModel.el.dataset.attributeIndex;
        if (dropCompleteCallbackFn) {
            dropCompleteCallbackFn(attributeIndex,  reOrderObj.sourceIndex, reOrderObj.targetIndex);
        }
    }

    destroyDnD() {
        this.dragulaService.destroy('job-levels-in-hierarchy-bag');
        this.dropSubscription.unsubscribe();
    }
}
