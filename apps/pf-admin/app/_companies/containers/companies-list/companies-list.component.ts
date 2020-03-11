import {Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';

import * as fromCompaniesGridActions from '../../actions/companies-grid.actions';
import * as fromCompaniesGridReducer from '../../reducers';
import { CompanyGridItem } from '../../models';
import { CompaniesListViews } from '../../constants/companies-list-constants';
import { CompanyNotesModalComponent } from '../company-notes-modal';

@Component({
    selector: 'pf-companies-list',
    templateUrl: './companies-list.component.html',
    styleUrls: ['./companies-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CompaniesListComponent implements OnChanges {
    @Input() selectedRowRouterLink: string;
    @Input() companiesList: CompanyGridItem[];
    @Input() loading: boolean;
    @Input() filter: string;
    @Input() handleCompaniesReload;
    @Input() view = CompaniesListViews.DEFAULT;
    @ViewChild(CompanyNotesModalComponent, { static: true }) companyNotesModal: CompanyNotesModalComponent;

    gridSkipAmount$: Observable<number>;
    gridTakeAmount$: Observable<number>;
    gridState$: Observable<State>;

    readonly pageSize: number = 15;

    public state: State;
    public gridView: GridDataResult;

    constructor(private router: Router, private store: Store<fromCompaniesGridReducer.CompanyManagementState>) {
        this.gridSkipAmount$ = this.store.select(fromCompaniesGridReducer.getGridSkipAmount);
        this.gridTakeAmount$ = this.store.select(fromCompaniesGridReducer.getGridTakeAmount);
        this.gridState$ = this.store.select(fromCompaniesGridReducer.selectCompaniesGridState);
        this.gridState$.subscribe( gs => this.state = gs);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.filter && (changes.filter.previousValue !== changes.filter.currentValue)) {
            this.store.dispatch(new fromCompaniesGridActions.GetGridSkipAmount(0));
            this.store.dispatch(new fromCompaniesGridActions.GetGridTakeAmount(this.pageSize));
        }
        if (changes.companiesList || changes.filter) {
            this.loadItems();
        }
    }

    public gridSelectionChange(selection) {
        if (selection.selectedRows && selection.selectedRows.length) {
            const item = selection.selectedRows[0].dataItem;
            this.router.navigate([this.selectedRowRouterLink, item.CompanyId]);
        }
    }

    public pageChange(event: PageChangeEvent): void {
        this.store.dispatch(new fromCompaniesGridActions.GetGridSkipAmount(event.skip));
        this.loadItems();
    }

    public openNotesModal($event: any, dataItem: any) {
        $event.stopPropagation();
        this.companyNotesModal.open(dataItem);
    }

    private loadItems(): void {
        this.gridView = process(this.companiesList, this.state);
    }
}
