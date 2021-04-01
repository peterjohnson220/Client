import { Component } from '@angular/core';

import { SortDescriptor } from '@progress/kendo-data-query';

import { ActionBarConfig, getDefaultActionBarConfig, GridConfig } from 'libs/features/grids/pf-data-grid/models';

import { SurveysPageConfig } from '../models';

@Component({
  selector: 'pf-surveys-page',
  templateUrl: './surveys.page.html',
  styleUrls: ['./surveys.page.scss']
})
export class SurveysPageComponent {
  pageViewId = SurveysPageConfig.SurveysPageViewId;
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'Surveys_Survey_Publisher'
  }];
  actionBarConfig: ActionBarConfig;
  gridConfig: GridConfig;

  constructor() {
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      AllowSaveFilter: false,
      ShowColumnChooser: true
    };
    this.gridConfig = {
      PersistColumnWidth: false,
      EnableInfiniteScroll: true,
      ScrollToTop: true
    };
  }
}

