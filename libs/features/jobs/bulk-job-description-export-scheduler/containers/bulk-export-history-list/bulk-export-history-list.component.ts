import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromBulkExportJobsReducer from '../../reducers';

@Component({
  selector: 'pf-bulk-export-history-list',
  templateUrl: './bulk-export-history-list.component.html',
  styleUrls: ['./bulk-export-history-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkExportHistoryComponent {
  @Input() validationMode: boolean;

  exportHistory$: Observable<any[]>;

  constructor(private store: Store<fromBulkExportJobsReducer.State>) {
    this.exportHistory$ = this.store.select(fromBulkExportJobsReducer.getBulkExportHistory);
  }
}
