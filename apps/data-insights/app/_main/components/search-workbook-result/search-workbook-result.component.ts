import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { ReportType } from 'libs/features/reports/models';

import { SearchResult } from '../../models';

@Component({
  selector: 'pf-search-workbook-result',
  templateUrl: './search-workbook-result.component.html',
  styleUrls: ['./search-workbook-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchWorkbookResultComponent {
  @Input() result: SearchResult;

  reportTypes = ReportType;

  constructor() {}

}
