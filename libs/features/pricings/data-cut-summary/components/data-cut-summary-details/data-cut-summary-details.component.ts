import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DataCutSummaryTypes } from '../../constants';

@Component({
  selector: 'pf-data-cut-summary-details',
  templateUrl: './data-cut-summary-details.component.html',
  styleUrls: ['./data-cut-summary-details.component.scss']
})
export class DataCutSummaryDetailsComponent implements OnInit, OnChanges {
  @Input() dataCutSummary: any;
  @Input() dataCutSummaryType: string;
  dataCutSummaryTypes = DataCutSummaryTypes;
  source: string;
  scope: string;
  constructor() {
    this.dataCutSummaryTypes = DataCutSummaryTypes;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataCutSummaryType'] && changes['dataCutSummaryType'].currentValue) {
      switch (this.dataCutSummaryType) {
        case DataCutSummaryTypes.MD_JOB:
          const industry = `${this.dataCutSummary.IndustryValue} ${this.dataCutSummary.IndustryValue === 'All' ? 'Industries' : ''}`;
          const size = `${this.dataCutSummary.SizeValue} ${this.dataCutSummary.SizeValue === 'All' ? 'Sizes' : '(' + this.dataCutSummary.SizeLabel + ')'}`;
          const location = `${this.dataCutSummary.GeoValue} ${this.dataCutSummary.GeoValue === 'All' ? 'Locations' : ''}`;
          const scopeDescription = `${this.dataCutSummary.IndustryValue ? industry + '/ ' : ''}
            ${this.dataCutSummary.SizeValue ? size + '/ ' : ''}
            ${this.dataCutSummary.GeoValue ? location : ''}`.trim();
          this.scope = `${this.dataCutSummary.Name ? this.dataCutSummary.Name : ''}${scopeDescription ? ' - ' + scopeDescription : ''}`;

          this.source = this.dataCutSummary.EffectiveDate ? `Payfactors effective` : null;
          break;
        case DataCutSummaryTypes.SURVEY:
          this.source = `${this.dataCutSummary.Publisher} ${this.dataCutSummary.SurveyName} effective`;
          this.scope = `${this.dataCutSummary.Scope}`;
          break;
        default:
          break;
      }
    }
  }
}
