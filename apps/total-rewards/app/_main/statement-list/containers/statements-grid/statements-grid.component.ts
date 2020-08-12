import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GridDataResult, DataStateChangeEvent, RowClassArgs } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

import { GridTypeEnum } from 'libs/models/common';
import * as fromGridActions from 'libs/core/actions/grid.actions';

import * as fromTotalRewardsReducer from './../../reducers';
import * as fromTotalRewardsStatementGridActions from '../../actions/statement-grid.actions';
import * as fromStatementGridActions from '../../actions/statement-grid.actions';
import { StatementListViewModel } from '../../../../shared/models';
import { statementsGridFields } from '../../models';

@Component({
  selector: 'pf-statements-grid',
  templateUrl: './statements-grid.component.html',
  styleUrls: ['./statements-grid.component.scss']
})
export class StatementsGridComponent implements OnInit {
  @Input() autoLoad = false;
  @Input() displayNoStatementsCreatedImage: boolean;
  @Output() createNewStatementClicked = new EventEmitter();

  statementsGridData$: Observable<GridDataResult>;
  statementsGridState$: Observable<State>;
  statementsLoading$: Observable<boolean>;
  statementsLoadingError$: Observable<boolean>;
  openActionMenuStatement$: Observable<StatementListViewModel>;

  @ViewChild(TooltipDirective, { static: true }) public tooltipDir: TooltipDirective;
  selectedDropdown: NgbDropdown;
  gridFields = statementsGridFields;

  constructor(private store: Store<fromTotalRewardsReducer.State>, private router: Router) { }

  ngOnInit() {
    this.statementsGridState$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsGridState));
    this.statementsGridData$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsGridData));
    this.statementsLoading$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsLoading));
    this.statementsLoadingError$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsLoadingError));
    this.openActionMenuStatement$ = this.store.pipe(select(fromTotalRewardsReducer.getStatementsOpenActionMenuStatement));
    if (this.autoLoad) {
      this.store.dispatch(new fromTotalRewardsStatementGridActions.LoadStatements());
    }
    window.addEventListener('scroll', this.onScroll, true);
  }

  onDataStateChange(state: DataStateChangeEvent): void {
    this.store.dispatch(new fromGridActions.UpdateGrid(GridTypeEnum.TotalRewardsStatements, state));
    this.store.dispatch(new fromTotalRewardsStatementGridActions.LoadStatements());
  }

  onActionMenuOpen(statement: StatementListViewModel): void {
    this.store.dispatch(new fromTotalRewardsStatementGridActions.OpenActionMenu(statement));
  }

  onActionMenuClose(): void {
    this.store.dispatch(new fromTotalRewardsStatementGridActions.CloseActionMenu());
  }

  onActionMenuDeleteClick(statement: StatementListViewModel): void {
    this.store.dispatch(new fromStatementGridActions.ConfirmDeleteStatement(statement));
  }

  navigateToStatementEdit(statementId: string): void {
    this.router.navigate(['/statement/edit/', statementId]).then();
  }

  navigateToStatementAssign(statementId: string): void {
    this.router.navigate(['/statement/edit/', statementId, 'assignments']).then();
  }

  handleSelectedRowAction(dropdown: NgbDropdown): void {
    this.selectedDropdown = dropdown;
  }

  onScroll = (): void => {
    if (!!this.selectedDropdown) {
      this.selectedDropdown.close();
    }
  }

  getRowClass(context: RowClassArgs) {
    return 'clickable-row';
  }

  onCellClick({ dataItem, rowIndex, originalEvent, column }) {
    if (!dataItem?.Id || originalEvent.button !== 0 || column?.title === 'Actions') {
      return;
    }
    this.navigateToStatementEdit(dataItem.Id);
  }

  handleCreateStatementClicked() {
    this.createNewStatementClicked.emit();
  }

  showGridTooltip(e: any): void {
    if ((e.target.offsetWidth < e.target.scrollWidth) && e.target.classList.contains('show-tooltip')) {
      this.tooltipDir.toggle(e.target);
    } else {
      this.tooltipDir.hide();
    }
  }
}
