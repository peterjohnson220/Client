import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as cloneDeep from 'lodash.clonedeep';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CellClickEvent, GridComponent, GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';

import { ListAreaColumn } from 'libs/models/common/list-area';
// import { StructureRangeGroupResponse } from 'libs/models/payfactors-api/structures';
import { AsyncStateObj } from 'libs/models/state';

import * as fromStructuresMainReducer from '../../reducers';
import * as fromJobRangeModelingActions from '../../actions/job-range-modeling-grid.actions';
import { StructureRangeDataDto } from '../../models';
import { testJobRangeModelingGridData } from '../../constants/test-data.constants';
import { JobRangeModelingConstants } from '../../constants/structures.constants';

@Component({
  selector: 'pf-job-range-modeling-grid',
  templateUrl: './job-range-modeling-grid.component.html',
  styleUrls: ['./job-range-modeling-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobRangeModelingGridComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(GridComponent, { static: false }) grid: GridComponent;

  editableColumns: string[] = ['CurrentMin', 'CurrentMid', 'CurrentMax', 'RangeSpread', 'MidPointDiff'];
  gridState: State = { skip: 0, take: 100, sort: [] };
  currentModel: any;
  firstGridLoadDispatched = false;
  listAreaColumns: ListAreaColumn[];
  gridData: StructureRangeDataDto[];

  currentModel$: Observable<any>;
  gridDataResultAsync$: Observable<AsyncStateObj<GridDataResult>>;
  listAreaColumnsAsync$: Observable<AsyncStateObj<ListAreaColumn[]>>;
  listAreaColumnsReordering$: Observable<boolean>;
  listAreaColumnsVisible$: Observable<ListAreaColumn[]>;

  currentModelSubscription: Subscription;
  gridDataResultSubscription: Subscription;
  listAreaColumnsSubscription: Subscription;
  listAreaColumnsReorderingSubscription: Subscription;

  constructor(private store: Store<fromStructuresMainReducer.State>, private formBuilder: FormBuilder) {
    this.currentModel$ = this.store.select(fromStructuresMainReducer.getCurrentModel);
    this.gridDataResultAsync$ = this.store.select(fromStructuresMainReducer.getGridDataResultAsync);
    this.listAreaColumnsAsync$ = this.store.select(fromStructuresMainReducer.getListAreaColumnsAsync);
    this.listAreaColumnsReordering$ = this.store.select(fromStructuresMainReducer.getListAreaColumnsReordering);
    this.listAreaColumnsVisible$ = this.store.select(fromStructuresMainReducer.getListAreaColumnsVisible);
  }

  handleCellClick(event: CellClickEvent) {
    if (this.editableColumns.indexOf((event.column as any).field) === JobRangeModelingConstants.NOT_FOUND_INDEX) {
      return;
    }

    if (!event.isEdited) {
      event.sender.editCell(event.rowIndex, event.columnIndex, this.createFormGroup(event.dataItem));
    }
  }

  handleCellClose(event: any) {
    if (!event.formGroup.valid) {
      event.preventDefault();
    } else if (event.formGroup.dirty) {
      this.assignChangesToDataItem(event.formGroup.value, event.dataItem);

      // TODO: Implement ability to save job-specific ranges
    }
  }

  handleColumnReorder() {
    setTimeout(() => {
      this.store.dispatch(new fromJobRangeModelingActions.ReorderListAreaColumns());
    }, 1);
  }

  handlePageChange(event: PageChangeEvent) {
    const newGridState = cloneDeep(this.gridState);

    newGridState.skip = event.skip;
    this.gridState = newGridState;
  }

  private assignChangesToDataItem(formGroupValue: any, dataItem: StructureRangeDataDto) {
    if (formGroupValue.Mid !== dataItem.CurrentMid) {
      dataItem.CurrentMin = Math.round(formGroupValue.Min * formGroupValue.Mid / formGroupValue.Mid);
      dataItem.CurrentMid = formGroupValue.Mid;
      dataItem.CurrentMax = Math.round(formGroupValue.Max * formGroupValue.Mid / formGroupValue.Mid);

      return;
    }

    if (formGroupValue.RangeSpread !== dataItem.RangeSpread) {
      const spreadValue = formGroupValue.RangeSpread / 100;

      dataItem.CurrentMin = Math.round(formGroupValue.Mid - ((formGroupValue.Mid * spreadValue) / (2 + spreadValue)));
      dataItem.CurrentMax = Math.round(formGroupValue.Mid + ((formGroupValue.Mid * spreadValue) / (2 + spreadValue)));

      return;
    }

    if (formGroupValue.MidPointDiff !== dataItem.MidPointDiff) {
      const diffValue = formGroupValue.MidPointDiff / 100;
      const newMid = formGroupValue.PreviousMid * (1 + diffValue);
      const oldMid = formGroupValue.Mid;

      dataItem.CurrentMin = Math.round(newMid);
      dataItem.CurrentMid = Math.round(formGroupValue.Min * newMid / oldMid);
      dataItem.CurrentMax = Math.round(formGroupValue.Max * newMid / oldMid);

      return;
    }
  }

  private createFormGroup(dataItem: StructureRangeDataDto): FormGroup {
    return this.formBuilder.group({
      'Min': dataItem.CurrentMin,
      'Mid': dataItem.CurrentMid,
      'Max': dataItem.CurrentMax,
      'RangeSpread': dataItem.RangeSpread,
      'MidPointDiff': dataItem.MidPointDiff
    });
  }

  // TODO: Remove once endpoint exists
  private loadTestData() {
    const gridDataResult = {
      total: testJobRangeModelingGridData.length,
      data: testJobRangeModelingGridData
    };

    this.store.dispatch(new fromJobRangeModelingActions.LoadJobRangeModelingGridSuccess(gridDataResult));
  }

  private reorderListAreaColumns() {
    const saveListAreaColumnsRequest = {
      Columns: []
    };

    this.grid.columnList.rootColumns().forEach(column => {
      const columns: ListAreaColumn[] = this.listAreaColumns.filter(lac => lac.ColumnDatabaseName === (column as any).field);
      const newListAreaColumn = cloneDeep(columns[0]);

      newListAreaColumn.Order = column.orderIndex + 1;
      saveListAreaColumnsRequest.Columns.push(newListAreaColumn);
    });

    this.store.dispatch(new fromJobRangeModelingActions.SaveListAreaColumns(saveListAreaColumnsRequest));
  }

  ngAfterViewInit(): void {
    this.grid.pageChange.pipe(debounceTime(500))
      .subscribe((e) => this.handlePageChange(e));
  }


  ngOnInit(): void {
    this.currentModelSubscription = this.currentModel$.subscribe(model => {
      this.currentModel = model;

      if (!this.firstGridLoadDispatched && this.currentModel) {
        // TODO: Uncomment once endpoints exist
        // this.store.dispatch(new fromJobRangeModelingActions.LoadJobRangeModelingGrid(this.currentModel.CompanyStructuresRangeGroupId));

        // TODO: Remove once endpoint exists
        this.loadTestData();

        this.firstGridLoadDispatched = true;
      }
    });

    this.listAreaColumnsReorderingSubscription = this.listAreaColumnsReordering$.subscribe(listAreaColumnsReordering => {
      if (listAreaColumnsReordering) {
        this.store.dispatch(new fromJobRangeModelingActions.ReorderListAreaColumnsSuccess());
        this.reorderListAreaColumns();
      }
    });

    this.gridDataResultSubscription = this.gridDataResultAsync$.subscribe(gridDataResultAsync => {
      this.gridData = gridDataResultAsync && gridDataResultAsync.obj ? gridDataResultAsync.obj.data : null;
    });

    const listAreaColumnsRequest = {
      ListAreaName: 'Structures',
      UdfType: 'jobs'
    };

    this.store.dispatch(new fromJobRangeModelingActions.LoadListAreaColumns(listAreaColumnsRequest));

    this.listAreaColumnsSubscription = this.listAreaColumnsAsync$.subscribe(listAreaColumnsAsync => {
      this.listAreaColumns = listAreaColumnsAsync.obj;
    });
  }

  ngOnDestroy(): void {
    this.currentModelSubscription.unsubscribe();
    this.gridDataResultSubscription.unsubscribe();
    this.listAreaColumnsSubscription.unsubscribe();
  }
}
