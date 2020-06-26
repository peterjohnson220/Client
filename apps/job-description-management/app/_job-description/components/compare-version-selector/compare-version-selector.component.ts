import {Component, EventEmitter, Input, Output} from '@angular/core';

import {JobDescriptionHistoryListItem} from 'libs/features/job-description-management/models';

@Component({
  selector: 'pf-compare-version-selector',
  templateUrl: './compare-version-selector.component.html',
  styleUrls: ['./compare-version-selector.component.scss']
})
export class CompareVersionSelectorComponent {
  @Input() jobDescriptionHistoryList: JobDescriptionHistoryListItem[];
  @Input() value: JobDescriptionHistoryListItem;
  @Output() versionChanged = new EventEmitter();

  constructor() { }
}
