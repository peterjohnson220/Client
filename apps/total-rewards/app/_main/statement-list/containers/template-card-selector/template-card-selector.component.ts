import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import * as fromTotalRewardsReducer from './../../reducers';
import * as fromTemplateSelectorActions from '../../actions/template-selector.actions';

import {Template} from '../../../../shared/models';

@Component({
  selector: 'pf-total-rewards-template-card-selector',
  templateUrl: './template-card-selector.component.html',
  styleUrls: ['./template-card-selector.component.scss']
})
export class TemplateCardSelectorComponent implements OnInit {
  @Input() autoLoad = false;
  @Output() onSelectClick = new EventEmitter<string>();

  templates$: Observable<Template[]>;
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;
  creatingStatement$: Observable<boolean>;
  creatingStatementError$: Observable<boolean>;

  constructor(private store: Store<fromTotalRewardsReducer.State>) {}

  ngOnInit(): void {
    this.templates$ = this.store.pipe(select(fromTotalRewardsReducer.getTemplates));
    this.loading$ = this.store.pipe(select(fromTotalRewardsReducer.getTemplatesLoading));
    this.loadingError$ = this.store.pipe(select(fromTotalRewardsReducer.getTemplatesLoadingError));
    this.creatingStatement$ = this.store.pipe(select(fromTotalRewardsReducer.getCreatingStatement));
    this.creatingStatementError$ = this.store.pipe(select(fromTotalRewardsReducer.getCreatingStatementError));
    if (this.autoLoad) {
      this.store.dispatch(new fromTemplateSelectorActions.LoadTemplates());
    }
  }

  reload(): void {
    this.store.dispatch(new fromTemplateSelectorActions.LoadTemplates());
  }

  onSelect(templateId: string) {
    this.onSelectClick.emit(templateId);
  }

  onPreview(templateId: string) {
    alert('Preview Button Clicked for id:' + templateId);
  }

}
