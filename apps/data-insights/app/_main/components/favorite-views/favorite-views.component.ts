import { Component, EventEmitter, Input, Output } from '@angular/core';

import { View, Workbook } from 'libs/features/surveys/reports/models';

@Component({
  selector: 'pf-favorite-views',
  templateUrl: './favorite-views.component.html',
  styleUrls: ['./favorite-views.component.scss']
})
export class FavoriteViewsComponent {

  @Input() favoriteTableauViews: View;
  @Input() favoriteDataViewReports: Workbook;
  @Output() favoriteClicked: EventEmitter<{ workbookId: string, view: View }> =
    new EventEmitter<{ workbookId: string, view: View }>();
  @Output() favoriteDataViewReportClicked: EventEmitter<Workbook> = new EventEmitter<Workbook>();

  trackByFn(index: any, view: View) {
    return view.ViewId;
  }

  handleFavoriteClicked(obj: {workbookId: string, view: View}) {
    this.favoriteClicked.emit(obj);
  }

  handleFavoriteDataViewReportClicked(obj: Workbook) {
    this.favoriteDataViewReportClicked.emit(obj);
  }

}
