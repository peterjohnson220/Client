import { Injectable } from '@angular/core';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { EnumSurveyDelete } from 'apps/admin/app/_survey-library/constants/survey-delete-enum';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { SaveCustomCompanySurveyTitleRequestModel } from '../../../models/payfactors-api/survey-library/request';
import { SurveyTitlesFilter } from '../../../../apps/admin/app/_survey-library/models';
import { UdfSettingsRequestModel } from '../../../models/payfactors-api/survey/request/udf-settings-request.model';
import { SurveyNote } from 'libs/models/payfactors-api/survey-library/survey-note-model';

@Injectable()
export class SurveyLibraryApiService {
  private endpoint = 'SurveyLibrary';
  private headers = new HttpHeaders({ 'Content-type': 'application/json' });

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getFirstSurveyByYearId(surveyYearId: number): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/GetFirstSurveyByYearId/${surveyYearId}`);
  }

  getSurveyList(surveyYearId: number, searchText: string): Observable<any> {
    return this.payfactorsApiService.postWithHeader(`${this.endpoint}/GetSurveyList/${surveyYearId}`,
      JSON.stringify(searchText), this.headers);
  }

  getAddSurveyPopup(surveyYearId: number): any {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/GetAddSurveyPopup/${surveyYearId}`);
  }

  saveSurvey(surveyYearId: number, agingFactor: number, companyId: number, surveyCost: number) {
    return this.payfactorsApiService.post(`${this.endpoint}/SaveNewSurvey/${surveyYearId}`,
      {
        SurveyYearId: surveyYearId,
        AgingFactor: agingFactor,
        CompanyId: companyId,
        SurveyCost: surveyCost
      }
    );
  }

  getSurveyTitlesByPublisherId(publisherId: number, filter: SurveyTitlesFilter): Observable<any> {
    let params = new HttpParams();
    params = params.append('searchTerm', filter.SearchTerm);
    params = params.append('companyId', filter.CompanyId ? filter.CompanyId.toString() : '');
    return this.payfactorsApiService.get<any>(`${this.endpoint}/GetSurveyTitlesByPublisherId/${publisherId}`, { params: params });
  }

  getSurveyTitleCompanies(surveyTitleId: number): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/GetSurveyTitleCompanies/${surveyTitleId}`);
  }

  saveSurveyTitle(request: any) {
    return this.payfactorsApiService.post(`${this.endpoint}/SaveSurveyTitle`, request);
  }

  deleteSurveyAndChildren(surveyId: number, step: EnumSurveyDelete) {
    return this.payfactorsApiService.postWithHeader(`${this.endpoint}/DeleteSurveyAndChildren/${surveyId}`
      , JSON.stringify(step), this.headers);
  }

  copySurvey(surveyId: number, companyId: number) {
    return this.payfactorsApiService.postWithHeader(`${this.endpoint}/CopySurvey/${surveyId}`,
      JSON.stringify(companyId), this.headers);
  }

  saveCustomCompanySurveyTitle(surveyTitleId: number, request: SaveCustomCompanySurveyTitleRequestModel) {
    return this.payfactorsApiService.post(`${this.endpoint}/SaveCustomCompanySurveyTitle/${surveyTitleId}`, request);
  }

  getMapCompaniesModalData(surveyId: number, searchText: string) {
    return this.payfactorsApiService.post(`${this.endpoint}/GetMapCompaniesModalData/${surveyId}`,
      {
        SearchText: searchText
      }
    );
  }

  getSurveyNotes(surveyId: number): Observable<SurveyNote[]> {
    return this.payfactorsApiService.get<SurveyNote[]>(`${this.endpoint}/GetSurveyNotes`,
      { params: {surveyId: surveyId} });
  }

  saveSurveyNote(note: SurveyNote, action: string) {
    return this.payfactorsApiService.post(`${this.endpoint}/SaveSurveyNote`,
      { User: note.CreateUser, Action: action, SurveyNoteId: note.Id, SurveyId: note.SurveyId, Note: note.Note, Date: note.CreateDate });
  }

  insertCompanySurvey(surveyId: number, companyId: number) {
    return this.payfactorsApiService.postWithHeader(`${this.endpoint}/InsertCompanySurvey/${surveyId}`,
      JSON.stringify(companyId), this.headers);
  }

  removeCompanySurvey(surveyId: number, companyId: number) {
    return this.payfactorsApiService.postWithHeader(`${this.endpoint}/RemoveCompanySurvey/${surveyId}`,
      JSON.stringify(companyId), this.headers);
  }

  updateCompanySurvey(surveyId: number, companyId: number, agingFactor: number, SurveyCost: number) {
    return this.payfactorsApiService.post(`${this.endpoint}/UpdateCompanySurvey/${surveyId}`, {
      CompanyId: companyId, AgingFactor: agingFactor, SurveyCost: SurveyCost
    });
  }

  saveUdfSettings(companyId: number, udfSettings: UdfSettingsRequestModel[]) {
    return this.payfactorsApiService.post(
      `${this.endpoint}/SaveUdfSettings?companyId=${companyId}`, udfSettings
    );
  }
}
