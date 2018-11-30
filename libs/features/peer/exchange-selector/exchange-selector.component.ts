import { Component, OnInit, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormsModule, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

import { GenericKeyValue } from 'libs/models/common';

@Component({
    selector: 'pf-exchange-selector',
    templateUrl: './exchange-selector.component.html',
})
export class ExchangeSelectorComponent implements OnInit {
    @Input() set data(data: GenericKeyValue<number, string>[]) {
        this.exchangeOptionsFiltered = data;
        this.allData = data;
    }
    get data() { return this.allData; }

    @Input() isDisabled: boolean;
    @Output() onExchangeSelected = new EventEmitter<number>();

    @ViewChild('exchangeList') exchangeList: ComboBoxComponent;

    exchangeOptionsFiltered: GenericKeyValue<number, string>[];
    exchangeForm: FormGroup;
    allData: GenericKeyValue<number, string>[];

    constructor() { }

    onFilterChanged(value: string) {
        this.exchangeOptionsFiltered = this.data.filter(co =>
            co.Value.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );

        const shouldToggle = (this.exchangeOptionsFiltered.length < 1);
        this.exchangeList.toggle(shouldToggle);
    }

    onSelectionChanged(value: GenericKeyValue<number, string>) {
        let emitValue = null;
        if (value) { emitValue = value.Key; }
        this.onExchangeSelected.emit(emitValue);
    }

    ngOnInit(): void {
        this.exchangeForm = new FormGroup({
            exchangeSelection: new FormControl({}, Validators.required)
        });
    }
}

