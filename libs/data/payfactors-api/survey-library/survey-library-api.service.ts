import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { PayfactorsApiService } from '../payfactors-api.service';
import { Observable } from 'rxjs';

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

  saveSurvey(surveyYearId: number, companyPrefix: string, agingFactor: number, companyId: number, surveyCost: number) {
    return this.payfactorsApiService.post(`${this.endpoint}/SaveNewSurvey/${surveyYearId}`,
      {
        SurveyYearId: surveyYearId,
        CompanyPrefix: companyPrefix,
        AgingFactor: agingFactor,
        CompanyId: companyId,
        SurveyCost: surveyCost
      }
    );
  }

  getSurveyTitlesByPublisherId(publisherId: number, filter: string): Observable<any> {
    const params = new HttpParams().set('filter', filter);
    return this.payfactorsApiService.get<any>(`${this.endpoint}/GetSurveyTitlesByPublisherId/${publisherId}`, {params: params});
  }

  saveSurveyTitle(request: any) {
    return this.payfactorsApiService.post(`${this.endpoint}/SaveSurveyTitle`, request);
  }
}
