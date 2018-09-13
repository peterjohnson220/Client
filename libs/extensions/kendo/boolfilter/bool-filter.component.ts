import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { CompositeFilterDescriptor, distinct, filterBy, FilterDescriptor } from '@progress/kendo-data-query';
import { FilterService } from '@progress/kendo-angular-grid';

@Component({
    selector: 'pf-bool-filter',
    templateUrl: './bool-filter.component.html',
})
export class BoolFilterComponent implements AfterViewInit {
    @Input() public isPrimitive: boolean;
    @Input() public currentFilter: CompositeFilterDescriptor;
    @Input() public data;
    @Input() public textField;
    @Input() public valueField;
    @Input() public fieldToSearch: string;
    @Input() public filterService: FilterService;
    @Output() public valueChange = new EventEmitter<number[]>();

    public currentData: any;
    private selectedValues: any[] = [];

    protected textAccessor = (dataItem: any) => this.isPrimitive ? dataItem : dataItem[this.textField];
    protected valueAccessor = (dataItem: any) => this.isPrimitive ? dataItem : dataItem[this.valueField];

    public ngAfterViewInit() {
        this.currentData = this.data;
        this.selectedValues = this.currentFilter.filters.map((f: FilterDescriptor) => f.value);
    }

    public isItemSelected(item) {
        return this.selectedValues.some(x => x === this.valueAccessor(item));
    }

    public onSelectionChange(item) {

        // we currently only support one filter per field, so we need to reset the array -DKG
        this.selectedValues = [];
        this.selectedValues.push(item);

        this.filterService.filter({
            filters: this.selectedValues.map(value => ({
                field: this.fieldToSearch,
                operator: 'eq',
                value
            })),
            logic: 'or'
        });
    }

    public onInput(e: any) {

        this.currentData = distinct([
            ...this.currentData.filter(dataItem => this.selectedValues.some(val => val === this.valueAccessor(dataItem))),
            ...filterBy(this.data, {
                operator: 'eq',
                field: this.fieldToSearch,
                value: e.target.value
            })],
            this.fieldToSearch
        );
    }
}
