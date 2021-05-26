import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj } from 'libs/models/state';
import { InputDebounceComponent } from 'libs/forms/components/input-debounce';

import * as fromSurveysPageReducer from '../../reducers';
import * as fromSurveysPageActions from '../../actions/surveys-page.actions';

@Component({
  selector: 'pf-view-participants-list',
  templateUrl: './view-participants-list.component.html',
  styleUrls: ['./view-participants-list.component.scss'],
})
export class ViewParticipantsListComponent implements OnInit, OnDestroy {
  @ViewChild(InputDebounceComponent, { static: true }) public inputDebounceComponent: InputDebounceComponent;
  @Input() surveyTitle: string;

  surveyParticipants$: Observable<AsyncStateObj<string[]>>;
  participantsModalOpen$: Observable<boolean>;

  surveyParticipantsSubscription: Subscription;

  surveyParticipants: string[];
  filteredParticipants: string[];
  searchValue: string;

  constructor(
    private store: Store<fromSurveysPageReducer.State>,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.surveyParticipants$ = this.store.select(fromSurveysPageReducer.getSurveyParticipants);
    this.participantsModalOpen$ = this.store.select(fromSurveysPageReducer.getParticipantsModalOpen);
  }

  ngOnInit(): void {
    this.surveyParticipantsSubscription = this.surveyParticipants$.subscribe(sp => {
      if (sp.obj.length) {
        this.searchValue = '';
        this.surveyParticipants = cloneDeep(sp.obj);
        this.filteredParticipants = cloneDeep(sp.obj);
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    this.surveyParticipantsSubscription.unsubscribe();
  }

  handleSearchValueChanged(value: string): void {
    this.searchValue = value.toLowerCase();
    this.applySearchFilterList();
  }

  closeParticipantModal(): void {
    this.searchValue = '';
    this.inputDebounceComponent.clearValue();
    this.store.dispatch(new fromSurveysPageActions.CloseParticipantsModal());
  }

  private applySearchFilterList(): void {
    if (!!this.searchValue && !!this.searchValue.length) {
      this.filteredParticipants = this.surveyParticipants.filter(sp => sp.toLowerCase().includes(this.searchValue));
    } else {
      this.filteredParticipants = this.surveyParticipants;
    }
  }

}
