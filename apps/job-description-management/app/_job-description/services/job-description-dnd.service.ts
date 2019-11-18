import { Injectable } from '@angular/core';

import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

import { DragulaHelperService } from 'libs/core/services';

import { JobDescriptionLibraryDropModel } from '../models';


@Injectable()
export class JobDescriptionDnDService {
  private dropSubscription: Subscription;
  private outSubscription: Subscription;
  private overSubscription: Subscription;

  constructor(private dragulaService: DragulaService) {
  }

  initJobDescriptionPageDnD(dropCompleteCallbackFn: any) {
    this.dragulaService.createGroup('library-bag', {
      accepts: function (el, target) {
        return target.className.includes('dnd-library-accept');
      },
      copy: true,
      copyItem: function(item: any) {
        return ({ ...item });
      },
      moves: function (el) {
        return el.className === 'dnd-library-draggable';
      }
    });

    // Drop
    this.dropSubscription = this.dragulaService.drop('library-bag').subscribe(value => {
      const dropModel = DragulaHelperService.getDropModel(value);

      if (!dropModel || !dropModel.target) {
        return;
      }

      const targetDataSet = dropModel.target.dataset;
      const elementDataSet = dropModel.element.dataset;

      const libraryDropModel: JobDescriptionLibraryDropModel = {
        SectionId: Number(targetDataSet.sectionId),
        ControlId: Number(targetDataSet.controlId),
        DropContent: elementDataSet.content
      };

      dropCompleteCallbackFn(libraryDropModel);
      dropModel.element.innerHTML = '';
    });

    // Over
    this.overSubscription = this.dragulaService.over('library-bag').subscribe(({el, container, source}) => {
      this.toggleLibraryAcceptColor(container, '#ffffd7');
    });


    // Out
    this.outSubscription = this.dragulaService.out('library-bag').subscribe(({el, container, source}) => {
      this.toggleLibraryAcceptColor(container, '#fff');
    });
  }

  destroyJobDescriptionPageDnD() {
    this.dragulaService.destroy('library-bag');
    if (this.outSubscription) {
      this.outSubscription.unsubscribe();
    }
    if (this.overSubscription) {
      this.overSubscription.unsubscribe();
    }
    if (this.dropSubscription) {
      this.dropSubscription.unsubscribe();
    }
  }

  private toggleLibraryAcceptColor(element: any, color: string) {
    if (element && element.className.includes('dnd-library-accept')) {
      const controlTables = element.querySelectorAll('.control-table');

      if (controlTables) {
        for (let i = 0; i < controlTables.length; i++) {
          controlTables[i].style.backgroundColor = color;
        }
      }
    }
  }
}
