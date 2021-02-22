import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncStateObj } from 'libs/models';
import { SurveySheetModel} from '../../models';



@Component({
  selector: 'pf-survey-loader-tab',
  templateUrl: './survey-loader-tab.component.html',
  styleUrls: ['./survey-loader-tab.component.scss']
})
export class SurveyLoaderTabComponent {
  @Input() worksheetNames$: Observable<AsyncStateObj<string[]>>;
  @Input() surveySheet: SurveySheetModel;
  @Output() updateSurveySheetNameEvent: EventEmitter<any> = new EventEmitter();
  @Output() removeAdditionalDropdownEvent: EventEmitter<any> = new EventEmitter();
  worksheetNamePlaceholder = 'Upload file to map tabs';

  onChange(value: string): void {
    this.updateSurveySheetNameEvent.emit(value);
  }

  onClick(): void {
    this.removeAdditionalDropdownEvent.emit();
  }
}
