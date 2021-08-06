import { AfterViewChecked, Component, Input, OnInit, } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

import { Store } from '@ngrx/store';
import cloneDeep from 'lodash/cloneDeep';

import { CompensableFactorModel } from 'libs/models/comphub';

import { CompensableFactorTypes } from '../../constants';
import * as fromComphubCsdReducer from '../../reducers';
import * as fromCompensableFactorsActions from '../../actions/compensable-factors.actions';



@Component({
  selector: 'pf-compensable-factor-type',
  templateUrl: './compensable-factor-type.component.html',
  styleUrls: ['./compensable-factor-type.component.scss']
})
export class CompensableFactorTypeComponent implements OnInit, AfterViewChecked {
  @Input() compensableFactorName: string;
  @Input() selectedJobTitle: string;
  @Input() factorType: number;
  @Input() title: string;
  @Input() description: string;
  @Input() searchPlaceHolder: string;
  @Input() compensableFactors: CompensableFactorModel[];
  @Input() topFactorsHeading: string;

  topFactorsForm: FormGroup;
  factorTypes = CompensableFactorTypes;
  searchFactors: CompensableFactorModel[];
  topFactors: CompensableFactorModel[];
  selectedFactors: string[];
  _maxSelections: boolean;
  disabledCheckBox: number[];

  constructor(
    private formBuilder: FormBuilder,
    public store: Store<fromComphubCsdReducer.State>,
    private changeDetector: ChangeDetectorRef
  ) {
    this.topFactorsForm = this.formBuilder.group({
      checkList: new FormArray([])
    });
  }

  get topFactorsFormArray() {
    return this.topFactorsForm.controls.checkList as FormArray;
  }

  get maxSelections() {
    return this._maxSelections;
  }

  set maxSelections(value: boolean) {
    this._maxSelections = value;
  }

  disableCheckBoxes() {
    this.topFactorsForm.value.checkList
      .map((checked, i) => {
        if (!checked) {
          this.disabledCheckBox.push(i);
          this.topFactorsFormArray.controls[i].disable();
        }
      });
  }

  addCheckBoxes() {
    this.topFactors.forEach(() => this.topFactorsFormArray.push(new FormControl(false)));
  }

  topFactorChecked(factor: CompensableFactorModel) {
    if (this.selectedFactors.indexOf(factor.Name) === -1) {
      this.selectedFactors.push(factor.Name.toString());
      this.store.dispatch(new fromCompensableFactorsActions.AddSelectedCompensableFactors(
        {compensableFactor: this.compensableFactorName, selectedFactors: cloneDeep(this.selectedFactors)}));
    } else {
      this.selectedFactors = this.selectedFactors.filter(x => x !== factor.Name);
    }

    this.maxSelectionValidation();
  }

  maxSelectionValidation() {
    if (this.selectedFactors.length >= 5) {
      this.maxSelections = true;
      this.disableCheckBoxes();
    } else {
      this.maxSelections = false;
      if (this.disabledCheckBox.length) {
        this.disabledCheckBox.forEach(i => {
          this.topFactorsFormArray.controls[i].enable();
        });
        this.disabledCheckBox = [];
      }
    }
  }

  pillClicked(factorName: string) {
    const selectedTopFactor = this.topFactors.find(x => x.Name === factorName);
    if (!!selectedTopFactor) {
      const index = this.topFactors.indexOf(selectedTopFactor);
      this.topFactorsFormArray.controls[index].setValue(false);
    }
    this.selectedFactors = this.selectedFactors.filter(x => x !== factorName);
    this.store.dispatch(new fromCompensableFactorsActions.AddSelectedCompensableFactors(
      {compensableFactor: this.compensableFactorName, selectedFactors: cloneDeep(this.selectedFactors)}));
    this.maxSelectionValidation();
  }

  handleSearchValueSelected(factorName: string) {
    if (this.selectedFactors.indexOf(factorName) === -1 && factorName !== '') {
      this.selectedFactors.push(factorName);
      this.store.dispatch(new fromCompensableFactorsActions.AddSelectedCompensableFactors(
        {compensableFactor: this.compensableFactorName, selectedFactors: cloneDeep(this.selectedFactors)}));
    }

    this.maxSelectionValidation();
  }

  ngOnInit(): void {
    this.maxSelections = false;
    this.selectedFactors = [];
    this.disabledCheckBox = [];
    this.topFactors = this.compensableFactors.slice(0, 5);
    this.searchFactors = this.compensableFactors.slice(5);
    this.addCheckBoxes();

  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

}
