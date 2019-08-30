import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SurveyLibraryStateService {

  // properties
  private addSurveyModalOpen: BehaviorSubject<boolean>;
  private addSurveyTitleModalOpen: BehaviorSubject<boolean>;

  constructor() {
    // default values
    this.addSurveyModalOpen = new BehaviorSubject<boolean>(false);
    this.addSurveyTitleModalOpen = new BehaviorSubject<boolean>(false);
  }

  // getters
  public addSurveyModalOpen$(): Observable<boolean> {
    return this.addSurveyModalOpen.asObservable();
  }
  public addSurveyTitleModalOpen$(): Observable<boolean> {
    return this.addSurveyTitleModalOpen.asObservable();
  }

  // setters
  public setAddSurveyModalOpen(newValue: boolean): void {
    this.addSurveyModalOpen.next(newValue);
  }
  public setAddSurveyTitleModalOpen(newValue: boolean): void {
    this.addSurveyTitleModalOpen.next(newValue);
  }

}
