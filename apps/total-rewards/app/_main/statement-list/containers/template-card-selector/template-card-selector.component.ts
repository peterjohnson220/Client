import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import {select, Store} from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { generateMockEmployeeRewardsData } from 'libs/models/payfactors-api/total-rewards';
import { generateMockStatement, Statement, StatementModeEnum, Template, TemplatePreview } from 'libs/features/total-rewards/total-rewards-statement/models';

import * as fromTotalRewardsReducer from './../../reducers';
import * as fromTemplateSelectorActions from '../../actions/template-selector.actions';

@Component({
  selector: 'pf-total-rewards-template-card-selector',
  templateUrl: './template-card-selector.component.html',
  styleUrls: ['./template-card-selector.component.scss']
})
export class TemplateCardSelectorComponent implements OnInit, OnDestroy {
  @Input() autoLoad = false;
  @Output() onSelectClick = new EventEmitter<string>();

  templates$: Observable<Template[]>;
  loading$: Observable<boolean>;
  loadingError$: Observable<boolean>;
  creatingStatement$: Observable<boolean>;
  creatingStatementError$: Observable<boolean>;

  showPreviewModal = new BehaviorSubject<boolean>(false);
  showPreviewModal$ = this.showPreviewModal.asObservable();
  templatePreview: TemplatePreview;
  templates: Template[];
  statementModeEnum = StatementModeEnum;
  mockStatement: Statement;
  mockData = generateMockEmployeeRewardsData();

  templateSub: Subscription;

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
    this.templateSub = this.templates$.subscribe(template => this.templates = template);
  }

  ngOnDestroy(): void {
    this.templateSub.unsubscribe();
  }

  reload(): void {
    this.store.dispatch(new fromTemplateSelectorActions.LoadTemplates());
  }

  onSelect(templateId: string) {
    this.onSelectClick.emit(templateId);
  }

  onPreview(templateId: string, templateName: string) {
    const matchingTemplate = this.templates.find(t => t.id === templateId);
    if (matchingTemplate) {
      this.mockStatement = {...generateMockStatement(), Pages : matchingTemplate.Pages};
    } else {
      return;
    }
    this.showPreviewModal.next(true);
    this.templatePreview = {
      Id: templateId,
      Name: templateName
    };
  }

  closePreviewModal() {
    this.showPreviewModal.next(false);
    this.templatePreview = null;
  }

}
