import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SortDescriptor} from '@progress/kendo-data-query';
import {PfDataGridColType} from 'libs/features/pf-data-grid/enums';
import {PfDataGridFilter} from 'libs/features/pf-data-grid/models';

@Component({
  selector: 'pf-structure-grid',
  templateUrl: './structure-grid.component.html',
  styleUrls: ['./structure-grid.component.scss']
})
export class StructureGridComponent implements OnChanges, AfterViewInit {
  pageViewId = '36FE36BF-A348-49DE-8511-B0DE46F52BDB';
  @Input() filters: PfDataGridFilter[];

  @ViewChild('nameColumn', { static: false }) nameColumn: ElementRef;
  @ViewChild('currencyColumn', { static: false }) currencyColumn: ElementRef;
  colTemplates = {};
  defaultSort: SortDescriptor[] = [{
    dir: 'asc',
    field: 'CompanyJobs_Structures_Structure_Name'
  }];
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      const newFilter = [...this.filters];
      const jobFilter = newFilter.find(f => f.SourceName === 'CompanyJob_ID');
      if (jobFilter) {
        newFilter.splice(this.filters.indexOf(jobFilter), 1);
        newFilter.push({...jobFilter, SourceName: 'CompanyJobId'});
        this.filters = newFilter;
      }
    }
  }
  ngAfterViewInit() {
    this.colTemplates = {
      'Structure_Name': this.nameColumn,
      [PfDataGridColType.currency]: this.currencyColumn
    };
  }

}
