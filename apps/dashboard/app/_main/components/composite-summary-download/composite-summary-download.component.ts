import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { RegexStrings } from 'libs/constants/regex-strings';
import * as fromFileReducer from 'libs/features/file-download/reducers/file-download.reducer';
import { FileModel } from 'libs/models/file';
import { CompositeSummaryDownload } from '../../actions/composite-summary-download.actions';
import { FileType } from 'libs/models/dashboard';

@Component({
  selector: 'pf-composite-summary-download',
  templateUrl: './composite-summary-download.component.html',
  styleUrls: ['./composite-summary-download.component.scss']
})
export class CompositeSummaryDownloadComponent implements OnDestroy, OnInit {

  errorText: string;
  file$: Observable<FileModel>;
  id: string;
  paramsSubscription: Subscription;

  constructor(private route: ActivatedRoute, private store: Store<fromFileReducer.State>) {

  }

  ngOnDestroy() {
    if (this.paramsSubscription && !this.paramsSubscription.closed) {
      this.paramsSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.paramsSubscription = this.route.queryParamMap.subscribe({
      next: this.startDownload,
    });
  }

  startDownload = (params: ParamMap) => {
    this.id = params.get('compositeDataLoadExternalId');

    if (!RegexStrings.GUID.test(this.id)) {
      this.errorText = `Invalid composite data load external ID: ${this.id}`;
    } else {
      this.store.dispatch(new CompositeSummaryDownload({
        Id: this.id,
        FileType: FileType.InvalidRecordsFile
      }));

      this.file$ = this.store.pipe(
        select(fromFileReducer.selectFileById, this.id),
      );
    }
  }

}
