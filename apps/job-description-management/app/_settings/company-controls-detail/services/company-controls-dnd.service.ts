import { Injectable } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { DragulaService } from 'ng2-dragula';

import { DragulaHelperService } from 'libs/core';

@Injectable()
export class CompanyControlsDndService {
    private dropSubscription: Subscription;

    constructor(
        private dragulaService: DragulaService
    ) { }

    initDnD(dropCompleteCallbackFn: any) {

        this.dragulaService.createGroup('choice-list-reorder-bag', {
            moves: function (el, container, handle) {
                return (handle.classList.contains('dnd-choice-reorder-handle')
                || handle.classList.contains('svg-inline--fa')
                || handle.classList.contains('fa-ellipsis-v'))
                // When the cursor is directly over the verticle ellipsis,
                // both the handle and container classes will be empty
                || (el.classList.contains('choice-list-container') && (handle.classList.length === 0 || handle.classList.contains('ng-fa-icon')));
            },
            ignoreInputTextSelection: false
        });

        this.dropSubscription = this.dragulaService.dropModel('choice-list-reorder-bag').subscribe((dropModel) => {
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
        this.dragulaService.destroy('choice-list-reorder-bag');
        this.dropSubscription.unsubscribe();
    }
}
