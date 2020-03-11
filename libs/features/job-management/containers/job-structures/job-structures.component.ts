import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { SimplePaymarket, SimpleGrade, CompanyStructure, CompanyStructurePaymarketGrade, CompanyStructureInfo } from 'libs/models';

import * as fromJobManagementActions from '../../actions';
import * as fromJobManagementReducer from '../../reducers';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'pf-job-structures',
  templateUrl: './job-structures.component.html',
  styleUrls: ['./job-structures.component.scss']
})
export class JobStructuresComponent implements OnInit, OnDestroy {

  structuresSubscription: Subscription;
  structuresListSubscription: Subscription;
  selectedStructureIdSubscription: Subscription;
  paymarketGradeListSubscription: Subscription;

  paymarketGradeList: CompanyStructurePaymarketGrade[];
  structuresList: CompanyStructure[];
  paymarketsList: SimplePaymarket[];
  gradesList: SimpleGrade[];
  structures: CompanyStructureInfo[];

  structureId: number;
  paymarketId: number;
  gradeId: number;

  errorMessage = '';

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains'
  };

  constructor(private store: Store<fromJobManagementReducer.State>) {
    this.structuresSubscription = this.store.select(fromJobManagementReducer.getStructures).subscribe(value => {
      this.structures = value;
      this.errorMessage = '';
    });

    this.structuresListSubscription = this.store.select(fromJobManagementReducer.getStructuresList).subscribe(value => {
      this.structuresList = value;
      this.errorMessage = '';
    });

    this.selectedStructureIdSubscription = this.store.select(fromJobManagementReducer.getSelectedStructureId).subscribe(value => {
      this.structureId = value;
      this.errorMessage = '';
    });

    this.paymarketGradeListSubscription = this.store.select(fromJobManagementReducer.getPaymarketGradeList).subscribe(value => {
      this.paymarketGradeList = value;
      this.updatePaymarketList();
      this.updateGrade();
      this.errorMessage = '';
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.paymarketGradeListSubscription.unsubscribe();
    this.selectedStructureIdSubscription.unsubscribe();
    this.paymarketGradeListSubscription.unsubscribe();
  }

  updatePaymarketList() {
    this.paymarketsList = Array.from(new Set(this.paymarketGradeList.map(a => a.CompanyPayMarketId)))
      .map(id => this.paymarketGradeList.find(a => a.CompanyPayMarketId === id))
      .map(o => ({
        CompanyPayMarketId: o.CompanyPayMarketId,
        PayMarket: o.PayMarket
      }));

    if (this.paymarketsList.length > 1) {
      this.paymarketsList = [{ CompanyPayMarketId: -1, PayMarket: '*ALL*' }].concat(this.paymarketsList);
    }

    this.paymarketId = this.paymarketsList && this.paymarketsList.length > 0 ? this.paymarketsList[0].CompanyPayMarketId : null;
  }

  updateGrade() {
    this.gradesList = Array.from(new Set(this.paymarketGradeList.map(a => a.CompanyStructuresGradesId)))
      .map(id => this.paymarketGradeList.find(a => a.CompanyStructuresGradesId === id))
      .map(o => ({
        CompanyStructuresGradesId: o.CompanyStructuresGradesId,
        GradeName: o.GradeName
      }));

    this.gradeId = this.gradesList && this.gradesList.length > 0 ? this.gradesList[0].CompanyStructuresGradesId : null;
  }

  structureChanged(value: any) {
    this.errorMessage = '';
    this.store.dispatch(new fromJobManagementActions.SetSelectedStructureId(value));
  }

  addStructureMapping() {
    this.errorMessage = '';
    const selectedStructure = this.structuresList.find(o => o.CompanyStructuresId === this.structureId);
    const selectedPayMarket = this.paymarketsList.find(o => o.CompanyPayMarketId === this.paymarketId);
    const selectedGrade = this.gradesList.find(o => o.CompanyStructuresGradesId === this.gradeId);

    if (this.paymarketId === -1) {
      this.paymarketsList.forEach(element => {
        if (element.CompanyPayMarketId !== -1) {
          this.addMapping(selectedStructure, element, selectedGrade);
        }
      });
    } else {
      this.addMapping(selectedStructure, selectedPayMarket, selectedGrade);
    }

  }

  deleteStructureMapping(id: number) {
    this.errorMessage = '';
    this.store.dispatch(new fromJobManagementActions.DeleteStructureMapping(id));
  }

  private addMapping(structure: CompanyStructure, paymarket: SimplePaymarket, grade: SimpleGrade) {

    if (this.structures.filter(o =>
      o.CompanyStructuresId === structure.CompanyStructuresId &&
      o.CompanyPayMarketId === paymarket.CompanyPayMarketId &&
      o.CompanyStructuresGradesId === grade.CompanyStructuresGradesId
    ).length > 0) {
      this.errorMessage = 'The structure mapping(s) you are trying to add already exists.';
      return;
    }

    // We need a temp negative unique ID in order to delete newly added structure mappings
    const id = - Math.floor((Math.random() * 100000000000) + 1);

    const newMapping = {
      StructureName: structure.StructureName,
      PayMarket: paymarket.PayMarket,
      GradeName: grade.GradeName,
      CompanyPayMarketId: paymarket.CompanyPayMarketId,
      CompanyStructuresId: structure.CompanyStructuresId,
      CompanyStructuresGradesId: grade.CompanyStructuresGradesId,
      CompanyStructuresRangeGroupId: id
    };

    this.store.dispatch(new fromJobManagementActions.AddStructureMapping(newMapping));
  }


}
