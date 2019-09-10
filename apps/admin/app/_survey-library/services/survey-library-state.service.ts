import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SurveyLibraryStateService {

  // properties
  private addSurveyTitleModalOpen: BehaviorSubject<boolean>;

  constructor() {
    // default values
    this.addSurveyTitleModalOpen = new BehaviorSubject<boolean>(false);
  }

  // getters
  public addSurveyTitleModalOpen$(): Observable<boolean> {
    return this.addSurveyTitleModalOpen.asObservable();
  }

  // methods
  public setAddSurveyTitleModalOpen(newValue: boolean): void {
    this.addSurveyTitleModalOpen.next(newValue);
  }
}
