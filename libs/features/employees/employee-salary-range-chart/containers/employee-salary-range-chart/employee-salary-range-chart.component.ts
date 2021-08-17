import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as Highcharts from 'highcharts';

import * as fromBasicDataGridReducer from 'libs/features/grids/basic-data-grid/reducers';
import * as fromBasicDataGridActions from 'libs/features/grids/basic-data-grid/actions/basic-data-grid.actions';
import { BasicDataViewField, DataViewFilter, EmployeeModalStructuresResponse } from 'libs/models/payfactors-api';
import { AsyncStateObj } from 'libs/models';
import { RangeDistributionTypeIds } from 'libs/constants/structures/range-distribution-type-ids';

import * as fromEmployeeSalaryRangeChartReducer from '../../reducers';
import * as fromEmployeeSalaryRangeChartActions from '../../actions/employee-salary-range-chart.actions';
import { EmployeeForSalaryRangeChart, EmployeeSalaryRangeChartConfig, EmployeeSalaryRangeChartData } from '../../models';
import { EmployeeSalaryRangeChartHelper } from '../../models/employee-salary-range-chart.helper';

@Component({
  selector: 'pf-employee-salary-range-chart',
  templateUrl: './employee-salary-range-chart.component.html',
  styleUrls: ['./employee-salary-range-chart.component.scss']
})
export class EmployeeSalaryRangeChartComponent implements OnChanges, OnInit, OnDestroy {
  @Input() employee: EmployeeForSalaryRangeChart;

  chartData$: Observable<AsyncStateObj<any[]>>;
  structuresAsync$: Observable<AsyncStateObj<EmployeeModalStructuresResponse[]>>;

  chartDataSubscription: Subscription;
  structuresAsyncSubscription: Subscription;

  Highcharts: typeof Highcharts = Highcharts;
  chart: Highcharts.Chart;
  chartOptions: Highcharts.Options;

  employeeSalaryRangeChartGridId = EmployeeSalaryRangeChartConfig.gridId;
  baseEntity: string;
  fields: BasicDataViewField[];
  chartData: EmployeeSalaryRangeChartData;
  rangeDistributionTypeId: number;
  structures: EmployeeModalStructuresResponse[];
  selectedStructure: EmployeeModalStructuresResponse;

  constructor(
    private basicGridStore: Store<fromBasicDataGridReducer.State>,
    private store: Store<fromEmployeeSalaryRangeChartReducer.State>
  ) {
    this.chartData$ = this.basicGridStore.select(fromBasicDataGridReducer.getData, this.employeeSalaryRangeChartGridId);
    this.structuresAsync$ = this.store.select(fromEmployeeSalaryRangeChartReducer.getEmployeeStructures);
    this.initBulletHighcharts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.employee?.currentValue && changes.employee.currentValue.CompanyEmployeeId) {
      this.loadStructures();
    }
  }

  ngOnInit(): void {
    this.structuresAsyncSubscription = this.structuresAsync$.subscribe((asyncObj) => {
      if (!asyncObj?.loading && asyncObj.obj) {
        this.handleStructuresLoaded(asyncObj.obj);
      }
    });
    this.chartDataSubscription = this.chartData$.subscribe((asyncObj) => {
      if (!asyncObj?.loading && asyncObj?.obj?.length > 0 && this.selectedStructure) {
        this.chartData = EmployeeSalaryRangeChartHelper.buildChartData(this.baseEntity, this.selectedStructure.TypeId, asyncObj.obj[0]);
        this.rangeDistributionTypeId = this.getChartRangeDistributionTypeId();
        if (this.rangeDistributionTypeId) {
          EmployeeSalaryRangeChartHelper.updateChartDataByRangeDistributionType(this.chartData, this.rangeDistributionTypeId);
          this.chartOptions = EmployeeSalaryRangeChartHelper.getChartOptions(this.chartData);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.structuresAsyncSubscription.unsubscribe();
    this.chartDataSubscription.unsubscribe();
  }

  setChartInstance(chart: Highcharts.Chart = null) {
    if (chart) {
      this.chart = chart;
    }
  }

  handleSelectedStructureChanged(selection: EmployeeModalStructuresResponse): void {
    if (this.selectedStructure.TypeId !== selection.TypeId) {
      this.initGrid();
    }
    this.selectedStructure = selection;
    this.updateFilters();
  }

  private initGrid(): void {
    this.baseEntity = EmployeeSalaryRangeChartConfig.getBaseEntityByRangeType(this.selectedStructure.TypeId);
    this.fields = EmployeeSalaryRangeChartConfig.getFieldsByRangeType(this.selectedStructure.TypeId);
    this.basicGridStore.dispatch(new fromBasicDataGridActions.InitGrid(
      this.employeeSalaryRangeChartGridId,
      {
        BaseEntity: this.baseEntity,
        ApplyDefaultFilters: false,
        Fields: this.fields,
        Filters: [],
        Distinct: true,
        PagingOptions: {
          From: 0,
          Count: 40
        }
      }
    ));
  }

  private initBulletHighcharts(): void {
    require('highcharts/modules/bullet.js')(Highcharts);
  }

  private loadStructures(): void {
    this.store.dispatch(new fromEmployeeSalaryRangeChartActions.GetEmployeeStructures(this.employee));
  }

  private handleStructuresLoaded(results: EmployeeModalStructuresResponse[]): void {
    this.structures = results;
    if (this.structures.length > 0) {
      const assignedStructure = this.employee.StructureRangeGroupId
        ? this.structures.find(x => x.CompanyStructuresRangeGroupId === this.employee.StructureRangeGroupId)
        : null;
      this.selectedStructure = assignedStructure ?? this.structures[0];
      this.initGrid();
      this.updateFilters();
    } else {
      this.chartData = null;
      this.rangeDistributionTypeId = null;
    }
  }

  private updateFilters(): void {
    const filters: DataViewFilter[] = EmployeeSalaryRangeChartConfig.getFilters(
      this.employee,
      this.baseEntity,
      this.selectedStructure.CompanyStructuresRangeGroupId);
    this.basicGridStore.dispatch(new fromBasicDataGridActions.UpdateFilters(this.employeeSalaryRangeChartGridId, filters));
  }

  private getChartRangeDistributionTypeId(): number {
    if (!this.chartData?.RangeDistributionTypeId) {
      return null;
    }
    const isValidMinMidMax = this.isAscending([this.chartData.Min, this.chartData.Mid, this.chartData.Max]);
    if (!isValidMinMidMax) {
      return null;
    }
    switch (this.chartData.RangeDistributionTypeId) {
      case RangeDistributionTypeIds.Tertile: {
        const isValidTertile = this.isAscending([
          this.chartData.Min,
          this.chartData.TertileFirst,
          this.chartData.TertileSecond,
          this.chartData.Max
        ]);
        return isValidTertile ? RangeDistributionTypeIds.Tertile : RangeDistributionTypeIds.MinMidMax;
      }
      case RangeDistributionTypeIds.Quartile: {
        const isValidQuartile = this.isAscending([
          this.chartData.Min,
          this.chartData.QuartileFirst,
          this.chartData.Mid,
          this.chartData.QuartileSecond,
          this.chartData.Max
        ]);
        return isValidQuartile ? RangeDistributionTypeIds.Quartile : RangeDistributionTypeIds.MinMidMax;
      }
      case RangeDistributionTypeIds.Quintile: {
        const isValidQuintile = this.isAscending([
          this.chartData.Min,
          this.chartData.QuintileFirst,
          this.chartData.QuintileSecond,
          this.chartData.QuintileThird,
          this.chartData.QuintileFourth,
          this.chartData.Max
        ]);
        return isValidQuintile ? RangeDistributionTypeIds.Quintile : RangeDistributionTypeIds.MinMidMax;
      }
      default: {
        return RangeDistributionTypeIds.MinMidMax;
      }
    }
  }

  private isAscending(values: number[]): boolean {
    return values
      .slice(1)
      .every((num, i) => num !== null && values[i] !== null && num >= values[i]);
  }

}
