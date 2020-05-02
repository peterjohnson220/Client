import {Component, Input, OnInit} from '@angular/core';

import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import * as fromTotalRewardsReducer from './../../reducers';
import * as fromTemplateSelectorActions from '../../actions/template-selector.actions';

import {Template} from '../../../../shared/models';
import {Router} from '@angular/router';

@Component({
  selector: 'pf-total-rewards-template-card-selector',
  templateUrl: './template-card-selector.component.html',
  styleUrls: ['./template-card-selector.component.scss']
})
export class TemplateCardSelectorComponent implements OnInit {
  @Input() autoLoad = false;
  templates$: Observable<Template[]>;
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;

  constructor(private store: Store<fromTotalRewardsReducer.State>, private router: Router) {}

  ngOnInit(): void {
    this.templates$ = this.store.pipe(select(fromTotalRewardsReducer.getTemplates));
    this.loading$ = this.store.pipe(select(fromTotalRewardsReducer.getTemplatesLoading));
    this.loadingError$ = this.store.pipe(select(fromTotalRewardsReducer.getTemplatesLoadingError));
    if (this.autoLoad) {
      this.store.dispatch(new fromTemplateSelectorActions.LoadTemplates());
    }
  }

  reload(): void {
    this.store.dispatch(new fromTemplateSelectorActions.LoadTemplates());
  }

  onCreate(templateId: string) {
    this.router.navigate(['/statement/edit/clone/', templateId]).then();
  }

  onPreview(templateId: string) {
    alert('Preview Button Clicked for id:' + templateId);
  }

}
