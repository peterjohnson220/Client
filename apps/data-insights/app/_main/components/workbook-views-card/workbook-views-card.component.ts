import { Component, Input, Output, EventEmitter, OnDestroy, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';

import { ReportOrderType } from 'libs/constants';
import { View, Workbook } from 'libs/features/surveys/reports/models';

import { SaveReportOrderData } from '../../models';

@Component({
  selector: 'pf-workbook-views-card',
  templateUrl: './workbook-views-card.component.html',
  styleUrls: ['./workbook-views-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkbookViewsCardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() workbook: Workbook;
  @Output() favoriteClicked: EventEmitter<{ workbookId: string, view: View }> =
    new EventEmitter<{ workbookId: string, view: View }>();
  @Output() viewsOrderUpdated: EventEmitter<SaveReportOrderData> = new EventEmitter<SaveReportOrderData>();

  isCollapsed = false;
  dragulaSub: Subscription;
  workbookViews: View[];

  constructor(
    private dragulaService: DragulaService
  ) {}

  ngOnInit(): void {
    if (!!this.workbook) {
      this.dragulaSub = new Subscription();
      this.dragulaSub.add(this.dragulaService.dropModel(`views-${this.workbook.WorkbookId}`).subscribe(({ sourceModel }) => {
        this.handleDropModel(sourceModel);
      }));
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes && !!changes.workbook && !!changes.workbook.currentValue.Views) {
      this.workbookViews = this.workbook.Views.obj;
    }
  }

  ngOnDestroy(): void {
    this.dragulaSub.unsubscribe();
  }

  trackByViews(index: any, view: View) {
    return view.ViewId;
  }

  handleFavoriteClicked(obj: {workbookId: string, view: View}) {
    this.favoriteClicked.emit(obj);
  }

  private handleDropModel(sourceModel: any[]) {
    if (!sourceModel) {
      return;
    }
    const viewIds = sourceModel.map((x: View) => x.ViewId);
    const saveReportOrderData: SaveReportOrderData = {
      Type: ReportOrderType.Custom,
      WorkbookId: this.workbook.WorkbookId,
      ViewIds: viewIds
    };
    this.viewsOrderUpdated.emit(saveReportOrderData);
  }
}
