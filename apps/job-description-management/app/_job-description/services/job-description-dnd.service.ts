import { Injectable } from '@angular/core';

import { DragulaService } from 'ng2-dragula';
import { Store } from '@ngrx/store';
import { filter, first } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';

import { JobDescription, JobDescriptionControl } from 'libs/models/jdm';
import { DragulaHelperService } from 'libs/core/services';
import { ControlType } from 'libs/models/common';

import * as fromJobDescriptionManagementSharedReducer from '../../shared/reducers';
import { ControlDataHelper } from '../../shared/helpers';
import { JobDescriptionManagementService } from '../../shared/services';
import { AddSourceControlDataRowDto, AppendToControlDataAttributeValueDto } from '../models';

@Injectable()
export class JobDescriptionDnDService {
  private sourceJobDescription: JobDescription;
  private dropSubscription: Subscription;
  private outSubscription: Subscription;
  private overSubscription: Subscription;

  appendToControlDataAttributeValue$: Subject<AppendToControlDataAttributeValueDto>;
  addSourcedControlDataRow$: Subject<AddSourceControlDataRowDto>;

  constructor(private sharedStore: Store<fromJobDescriptionManagementSharedReducer.State>,
              private dragulaService: DragulaService,
              private jobDescriptionManagementService: JobDescriptionManagementService) {
    this.appendToControlDataAttributeValue$ = new Subject();
    this.addSourcedControlDataRow$ = new Subject();
  }

  initJobDescriptionPageDnD(jobDescription: JobDescription, dropCompleteCallbackFn: any) {
    this.sourceJobDescription = jobDescription;

    this.dragulaService.createGroup('library-bag', {
      accepts: function (el, target, source, sibling) {
        return target.className.includes('dnd-library-accept');
      },
      copy: true,
      moves: function (el, container, handle) {
        return el.className === 'dnd-library-draggable';
      }
    });

    // Drop
    this.dropSubscription = this.dragulaService.drop('library-bag').subscribe(value => {
      const dropModel = DragulaHelperService.getDropModel(value);

      if (!dropModel) {
        return;
      }

      const targetDataSet = dropModel.target.dataset;
      const elementDataSet = dropModel.element.dataset;

      this.getControlAndType(targetDataSet.sectionId, targetDataSet.controlId, (jdc, ct) => {
        let data = elementDataSet.content;

        if (ct.EditorType === 'SmartList') {
          data += '========>FROM LIBRARY';
        }

        this.addSourcedDataToControl(jdc, ct, data);
      });

      setTimeout(() => {
        DragulaHelperService.removeDroppedElement(dropModel);
      }, 300);

      dropCompleteCallbackFn();
    });

    // Over
    this.overSubscription = this.dragulaService.over('library-bag').subscribe(({el, container, source}) => {
      this.toggleLibraryAcceptColor(container, '#ffffd7');
    });


    // Out
    this.outSubscription = this.dragulaService.out('library-bag').subscribe(value => {
      const dropModel = DragulaHelperService.getDropModel(value);

      this.toggleLibraryAcceptColor(dropModel.target, '#fff');
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

  private addSourcedDataToControl(jobDescriptionControl: JobDescriptionControl, controlType: ControlType, data: string) {
    // Find which attribute can be sourced
    const sourcedAttribute = controlType.Attributes.find(a => a.CanBeSourced);

    // Leave if no sourceable attribute
    if (!sourcedAttribute) {
      return;
    }

    // Append the data to existing Row if it is a Editor Type of Single or If the last row has No Data in it
    if (
      controlType.EditorType === 'Single' ||
      (jobDescriptionControl.Data.length &&
        !this.jobDescriptionManagementService.hasData(
          controlType.Attributes, jobDescriptionControl.Data[jobDescriptionControl.Data.length - 1]))
    ) {
      const hasTemplateDataRow = this.hasTemplateDataRow(jobDescriptionControl);
      const rteWrappedData = `${jobDescriptionControl.Data[hasTemplateDataRow ? 1 : 0][sourcedAttribute.Name].length ? '<p><br></p>' : ''}<p>${data}</p>`;
      const appendData = sourcedAttribute.Type === 'RichText' ? rteWrappedData : data;
      const dataRow = jobDescriptionControl.Data[jobDescriptionControl.Data.length - 1];

      this.appendToControlDataAttributeValue$.next({
        jobDescriptionControl: jobDescriptionControl,
        dataRow: dataRow,
        attribute: sourcedAttribute.Name,
        value: appendData
      });
    } else {
      this.addSourcedControlDataRow$.next({
        jobDescriptionControl: jobDescriptionControl,
        attributes: controlType.Attributes,
        data: data
      });
    }
  }

  private toggleLibraryAcceptColor(element: any, color: string) {
    if (element.className.includes('dnd-library-accept')) {
      const controlTables = element.querySelectorAll('.control-table');

      if (controlTables) {
        for (let i = 0; i < controlTables.length; i++) {
          controlTables[i].style.backgroundColor = color;
        }
      }
    }
  }

  private hasTemplateDataRow(jobDescriptionControl: JobDescriptionControl) {
    return jobDescriptionControl.Data.some(dataRow => dataRow.TemplateId);
  }

  private getControlAndType(sectionId: number, controlId: number, callbackFn: any) {
    // Get the job description control that the library item was dropped into from store
    const jobDescriptionControlIds = {
      SectionId: sectionId,
      Id: controlId
    };

    const jobDescriptionControl = ControlDataHelper.getControl(this.sourceJobDescription, jobDescriptionControlIds);

    this.sharedStore
      .select(fromJobDescriptionManagementSharedReducer.getControlTypeAndVersion).pipe(
      filter(cts => !!cts),
      first()
    ).subscribe(ct => {
      // Execute provided function once we have both a control and type
      callbackFn(jobDescriptionControl, ct);
    });
  }
}
