import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { View } from '../../models';

@Component({
  selector: 'pf-favorite-views',
  templateUrl: './favorite-views.component.html',
  styleUrls: ['./favorite-views.component.scss']
})
export class FavoriteViewsComponent implements OnInit {

  @Input() favoriteViews: View;
  @Output() favoriteClicked: EventEmitter<{ workbookId: string, view: View }> =
    new EventEmitter<{ workbookId: string, view: View }>();

  constructor() { }

  ngOnInit() {
  }

  trackByFn(index: any, view: View) {
    return view.ViewId;
  }

  handleFavoriteClicked(obj: {workbookId: string, view: View}) {
    this.favoriteClicked.emit(obj);
  }

}