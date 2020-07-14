import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription } from 'rxjs';

import { IntlService } from '@progress/kendo-angular-intl';
import { SortDescriptor } from '@progress/kendo-data-query';

import { Permissions } from 'libs/constants';
import { ActionBarConfig, ColumnChooserType, getDefaultActionBarConfig, PfDataGridFilter } from 'libs/features/pf-data-grid/models';

import { EmployeeHistoryPageViewId } from '../models';

@Component({
  selector: 'pf-employee-history-page',
  templateUrl: './employee-history.page.html',
  styleUrls: ['./employee-history.page.scss']
})
export class EmployeeHistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('gridGlobalActions', { static: true }) public gridGlobalActionsTemplate: ElementRef;
  @ViewChild('salaryColumn', { static: false }) salaryColumn: ElementRef;
  @ViewChild('rateBasedSalaryColumn', { static: false }) rateBasedSalaryColumn: ElementRef;
  permissions = Permissions;

  pageViewId = EmployeeHistoryPageViewId;
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'vw_EmployeeHistory_Employee_ID'
  }];
  filterTemplates = {};
  colTemplates = {};
  actionBarConfig: ActionBarConfig;
  loadDateFilter: PfDataGridFilter[] = [];
  fieldsExcludedFromExport = ['CompanyEmployeeHistory_ID', 'HiddenRate'];
  showEmployeeHistoryModal = new BehaviorSubject<boolean>(false);
  showEmployeeHistoryModal$ = this.showEmployeeHistoryModal.asObservable();
  routeSubscription: Subscription;
  historyDate: Date;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private intlService: IntlService
  ) {
    this.actionBarConfig = {
      ...getDefaultActionBarConfig(),
      ShowColumnChooser: true,
      ShowFilterChooser: true,
      AllowExport: true,
      AllowSaveFilter: true,
      ExportSourceName: 'Employee History',
      ColumnChooserType: ColumnChooserType.ColumnGroup
    };
    this.setHistoryDate(this.route.snapshot.params.date);
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      const date = this.intlService.parseDate(params['date']);
      if (date !== this.historyDate) {
        // load new history
        this.setHistoryDate(params['date']);
      }
    });
  }

  ngAfterViewInit(): void {
    this.actionBarConfig = {
      ...this.actionBarConfig,
      GlobalActionsTemplate: this.gridGlobalActionsTemplate
    };
    this.colTemplates = {
      'salary': { Template: this.salaryColumn },
      'rateBasedSalary': { Template: this.rateBasedSalaryColumn }
    };
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  handleEmployeeHistoryDateChange(date: string): void {
    this.showEmployeeHistoryModal.next(false);
    this.router.navigate([`history/${date}`]).then(() => {
    });
  }

  private setHistoryDate(date: string) {
    this.historyDate = this.intlService.parseDate(date);
    if (this.historyDate != null) {
      this.loadDateFilter = [{
        SourceName: 'Load_Date',
        Operator: '=',
        Value: this.intlService.formatDate(this.historyDate, 'yyyy-MM-dd')
      }];
    }
  }
}

