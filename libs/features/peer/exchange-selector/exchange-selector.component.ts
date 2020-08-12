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
    @Input() activeExchange$: Observable<number>;
    @Input() isDisabled: boolean;
    @Output() onExchangeSelected = new EventEmitter<number>();

    @ViewChild('exchangeList', { static: true }) exchangeList: ComboBoxComponent;

    exchangeOptionsFiltered: GenericKeyValue<number, string>[];
    selectedExchangeId: number;
    defaultExchangeId: number;
    exchangeForm: FormGroup;
    allData: GenericKeyValue<number, string>[];

    exchangesSubscription: Subscription;
    activeExchangeSubscription: Subscription;

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
            if (!!data) {
              this.exchangeOptionsFiltered = data;
              this.allData = data;
              if (data.length === 1 && !isNullOrUndefined(data[0])) {
                this.exchangeForm.get('exchangeSelection').setValue(data[0].Key);
                this.onExchangeSelected.emit(data[0].Key);
              } else {
                this.applyDefaultExchange();
              }
            }
        });

        this.activeExchangeSubscription = this.activeExchange$.subscribe(exchangeId => {
            if (exchangeId) {
                this.defaultExchangeId = exchangeId;
                this.applyDefaultExchange();
            }
        });
    }

    applyDefaultExchange(): void {
      if (!this.selectedExchangeId && this.allData?.find(ex => ex.Key === this.defaultExchangeId)) {
        this.selectedExchangeId = this.defaultExchangeId;
        this.exchangeForm.get('exchangeSelection').setValue(this.selectedExchangeId);
        this.onExchangeSelected.emit(this.selectedExchangeId);
      }
    }

    ngOnDestroy(): void {
      this.exchangesSubscription.unsubscribe();
      this.activeExchangeSubscription.unsubscribe();
    }
}

