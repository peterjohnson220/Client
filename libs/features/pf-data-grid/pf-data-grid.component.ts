import { Component, OnInit, Input, TemplateRef, EventEmitter, SimpleChanges, OnChanges, OnDestroy } from '@angular/core';
import { DataService } from './services/data.service';
import { ConfigService } from './services/config.service';
import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PfDataGridConfig } from './interfaces/pf-data-grid-config';

@Component({
  selector: 'pf-data-grid',
  templateUrl: './pf-data-grid.component.html',
  styleUrls: ['./pf-data-grid.component.scss'],
  providers: [DataService, ConfigService]
})
export class PfDataGridComponent implements OnChanges, OnInit, OnDestroy {

  @Input() entity: string;
  @Input() columnTemplates: any;
  @Input() splitViewTemplate: TemplateRef<any>;

  selection = [];

  public gridData$: Observable<GridDataResult>;
  public gridConfig$: Observable<PfDataGridConfig>;

  splitViewEmitter = new EventEmitter<string>();

  constructor(private dataService: DataService, private configService: ConfigService) {
    this.gridData$ = dataService;
    this.gridConfig$ = configService;
  }

  test: GridDataResult;

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
    if (changes['entity']) {
      this.configService.query(changes['entity'].currentValue);
      this.dataService.query(changes['entity'].currentValue);
    }
  }

  getValue(row: any, colName: string[]): string[] {
    const values = colName.map(val => row[val]);
    return values;
  }

  isSplitView(): boolean {
    return this.splitViewTemplate && this.selection.length > 0;
  }

}
