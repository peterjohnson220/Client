import { Component, OnInit, OnDestroy, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';

import { GenericKeyValue } from 'libs/models/common';
import { isNullOrUndefined } from 'libs/core/functions/';

@Component({
    selector: 'pf-exchange-selector',
    templateUrl: './exchange-selector.component.html',
})
export class ExchangeSelectorComponent implements OnInit, OnDestroy {
    @Input() exchanges$: Observable<GenericKeyValue<number, string>[]>;
    @Input() isDisabled: boolean;
    @Output() onExchangeSelected = new EventEmitter<number>();

    @ViewChild('exchangeList') exchangeList: ComboBoxComponent;

    exchangeOptionsFiltered: GenericKeyValue<number, string>[];
    exchangeForm: FormGroup;
    allData: GenericKeyValue<number, string>[];

    exchangesSubscription: Subscription;

    constructor() {
      this.isDisabled = false;
    }

    onFilterChanged(value: string) {
        this.exchangeOptionsFiltered = this.allData.filter(co =>
            co.Value.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
    }

    onSelectionChanged(value: GenericKeyValue<number, string>) {
        if (!isNullOrUndefined(value)) {
            this.onExchangeSelected.emit(value.Key);
        } else {
            // if we don't actually select anything reset our options
            this.onExchangeSelected.emit(null);
            this.exchangeOptionsFiltered = this.allData;
        }
    }

    ngOnInit(): void {
        this.exchangeForm = new FormGroup({
            exchangeSelection: new FormControl({}, Validators.required)
        });

        this.exchangesSubscription = this.exchanges$.subscribe(data => {
            this.exchangeOptionsFiltered = data;
            this.allData = data;
            if (!!data && data.length === 1 && !isNullOrUndefined(data[0])) {
              this.exchangeForm.get('exchangeSelection').setValue(data[0]);
              this.onExchangeSelected.emit(data[0].Key);
            }
        });
    }

    ngOnDestroy(): void {
      this.exchangesSubscription.unsubscribe();
    }
}

