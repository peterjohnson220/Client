import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as fromLoaderDashboardPageReducer from '../../reducers';
import * as fromLoaderDashboardPageActions from '../../actions/loader-dashboard-page.actions';
import { EntityChoice, getEntityChoiceForRedrop } from '../../../../../data-management/app/_main/models';
import { UpdatedArchiveSummaryModel } from '../../models';
import { AsyncStateObj } from 'libs/models';
import { FileUploadComponent } from 'libs/features/org-data-loader/components';

@Component({
  selector: 'pf-loader-dashboard-file-archive-redrop',
  templateUrl: './loader-dashboard-file-archive-redrop.component.html',
  styleUrls: ['./loader-dashboard-file-archive-redrop.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderDashboardFileArchiveRedropComponent implements OnInit, OnDestroy {
  @ViewChildren('fileUpload') uploadComponents: QueryList<FileUploadComponent>;

  private unsubscribe$ = new Subject<boolean>();
  public updatedArchiveSummaryObj$: Observable<AsyncStateObj<UpdatedArchiveSummaryModel>>;
  public redropFileObj$: Observable<File>;
  public redropEntity: EntityChoice;
  public updatedArchiveSummary: UpdatedArchiveSummaryModel;
  public selectedCompositeDataLoadId: number;
  public selectedClientName: string;
  public selectedClientId: number;

  constructor(private store: Store<fromLoaderDashboardPageReducer.State>,
              private changeDetector: ChangeDetectorRef) {
    this.redropEntity = getEntityChoiceForRedrop();
  }

  ngOnInit(): void {
    this.updatedArchiveSummaryObj$ = this.store.select(fromLoaderDashboardPageReducer.getUpdatedArchiveSummaryObj);
    this.updatedArchiveSummaryObj$.pipe(takeUntil(this.unsubscribe$)).subscribe(v => {
      if (v && !v.loading) {
        this.updatedArchiveSummary = v.obj;
        this.changeDetector.detectChanges();
      }
    });
    this.redropFileObj$ = this.store.select(fromLoaderDashboardPageReducer.getRedropFileObj);
    this.redropFileObj$.pipe(takeUntil(this.unsubscribe$)).subscribe(v => {
      this.redropEntity.File = v;
      this.changeDetector.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.unsubscribe();
  }

  public OnFileDropped(file: File): void {
    this.redropEntity.File = file;
    this.store.dispatch(new fromLoaderDashboardPageActions.GetArchiveData({ file: this.redropEntity.File }));
  }

  public OnFileRemoved(): void {
    this.redropEntity.File = null;
    this.updatedArchiveSummary = new UpdatedArchiveSummaryModel();
    this.store.dispatch(new fromLoaderDashboardPageActions.ClearArchiveData());
    this.changeDetector.detectChanges();
  }

  public OpenRedropConfirmationModal(): void {
    this.selectedCompositeDataLoadId = this.updatedArchiveSummary.CompositeDataLoadId;
    this.selectedClientName = this.updatedArchiveSummary.CompanyName;
    this.selectedClientId = this.updatedArchiveSummary.CompanyId;
    this.store.dispatch(new fromLoaderDashboardPageActions.OpenRedropConfirmationModal());
  }

  public HandleRedropConfirmationResponse(confirmed: boolean): void {
    if (confirmed) {
      this.store.dispatch(new fromLoaderDashboardPageActions.RedropArchive({
        file: this.redropEntity.File,
        compositeDataLoadId: this.updatedArchiveSummary.CompositeDataLoadId
      }));
    }
  }

  public orgDataExportAction() {
    if (this.updatedArchiveSummary.CompanyId) {
      this.store.dispatch(new fromLoaderDashboardPageActions.PublishDownloadOrgDataMessage(this.updatedArchiveSummary.CompanyId));
    }
  }
}
