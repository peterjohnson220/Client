import { Component, Input, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SurveyLibraryApiService } from 'libs/data/payfactors-api';

import * as fromSurveysReducer from '../../reducers';
import * as fromSurveyActions from '../../actions/survey-actions';
import { EnumSurveyDelete } from '../../constants/survey-delete-enum';

@Component({
    selector: 'pf-delete-confirmation-modal',
    templateUrl: './delete-confirmation-modal.component.html'
})
export class DeleteConfirmationModalComponent {

    @Input() publishedMatchCount: number;
    @Input() surveyId: number;

    isModalOpen$: Observable<boolean>;
    textConfirm = '';
    textConfirmFull = 'I am about to delete client pricings';
    submitting = false;
    deleteFailed = false;
    isDeleting = false;

    constructor(
        private store: Store<fromSurveysReducer.State>,
        private surveyApi: SurveyLibraryApiService
    ) {
        this.isModalOpen$ = this.store.select(fromSurveysReducer.isDeleteConfirmationModalOpen);
    }

    acceptWarning() {
        this.isDeleting = true;
        this.surveyApi.deleteSurveyAndChildren(this.surveyId, EnumSurveyDelete.PUBLISHED_MATCHES).subscribe(f => {
            this.store.dispatch(new fromSurveyActions.ShouldRefreshGrid(true));
            this.isDeleting = false;
            this.closeModal();
        }, () => { this.deleteFailed = true; }
        );
    }

    closeModal() {
        this.textConfirm = '';
        this.store.dispatch(new fromSurveyActions.SetDeleteConfirmationModalOpen(false));
    }
}
