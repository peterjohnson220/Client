import { Component, OnInit, Input, TemplateRef, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromReducer from '../reducers';
import * as fromActions from '../actions';

@Component({
  selector: 'pf-data-grid',
  templateUrl: './pf-data-grid.component.html',
  styleUrls: ['./pf-data-grid.component.scss'],
})
export class PfDataGridComponent implements OnChanges, OnInit, OnDestroy {

  @Input() pageViewId: string;
  @Input() title: string;
  @Input() navigationURL: string;
  @Input() showTitle = true;
  @Input() showColumnChooser = true;
  @Input() allowExport = true;
  @Input() showFilterChooser = true;
  @Input() primaryKey: string;
  @Input() columnTemplates: any;
  @Input() splitViewTemplate: TemplateRef<any>;
  @Input() gridActionsTemplate: TemplateRef<any>;
  @Input() gridGlobalActionsTemplate: TemplateRef<any>;

  selection = [];

  splitViewEmitter = new EventEmitter<string>();

  constructor(private store: Store<fromReducer.State>) {}

  ngOnInit(): void {
    this.splitViewEmitter.subscribe(res => {
      switch (res) {
        case 'close':
          this.selection = [];
          break;
        default:
          break;
      }
    });
  }

  ngOnDestroy() {
    this.splitViewEmitter.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageViewId']) {
      this.store.dispatch(new fromActions.LoadViewConfig(changes['pageViewId'].currentValue));
    }
  }

  isSplitView(): boolean {
    return this.splitViewTemplate && this.selection.length > 0;
  }
}
