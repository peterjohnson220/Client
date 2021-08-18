import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import { ExchangeJobExchangeDetail } from '../models';
import { StatusEnum } from 'libs/models/common';

@Component({
  selector: 'pf-exchange-job-selector',
  templateUrl: './exchange-job-selector.component.html',
  styleUrls: ['./exchange-job-selector.component.scss'],
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ExchangeJobSelectorComponent {
  @ViewChild('p') popover: NgbPopover;

  @Input() exchangeJobSelectorItems: ExchangeJobExchangeDetail[];
  @Input() shouldDisplayJobTitleShort: boolean;
  @Input() selectedExchangeJobId: number;
  @Input() static = false;
  @Output() exchangeJobSelected = new EventEmitter();

  get selectorEnabled(): boolean {
    return !!this.exchangeJobSelectorItems && this.exchangeJobSelectorItems.length > 1;
  }

  get selection(): ExchangeJobExchangeDetail {
    const selection = this.exchangeJobSelectorItems.find(ej => ej.ExchangeJobId === this.selectedExchangeJobId);
    if (!!selection) {
      return selection;
    }

    if (!!this.exchangeJobSelectorItems && this.exchangeJobSelectorItems.length >= 1) {
      return this.exchangeJobSelectorItems[0];
    }
  }

  jobTitle(exchangeJobExchangeDetail: ExchangeJobExchangeDetail): string {
    if (!exchangeJobExchangeDetail) {
      return '';
    }

    if (!this.shouldDisplayJobTitleShort) {
      return exchangeJobExchangeDetail.ExchangeJobTitle;
    }

    const hasJobTitleShort = !!exchangeJobExchangeDetail.ExchangeJobTitleShort && exchangeJobExchangeDetail.ExchangeJobTitleShort.length;
    return hasJobTitleShort ? exchangeJobExchangeDetail.ExchangeJobTitleShort : exchangeJobExchangeDetail.ExchangeJobTitle;
  }

  getExchangeLabel(job: ExchangeJobExchangeDetail = null): string {
    if (!job) {
      return !!this.selection ? this.getExchangeLabel(this.selection) : '';
    }

    const statusText = this.getStatusText(job.ExchangeStatus);

    return job.ExchangeName + statusText;
  }

  isSelected(exchangeJobId: number): boolean {
    if (!this.selection) {
      return false;
    }

    return exchangeJobId === this.selection.ExchangeJobId;
  }

  getStatusText(exchangeStatus: StatusEnum): string {
    switch (exchangeStatus) {
      case StatusEnum.Inactive:
        return ' (Inactive)';
      case StatusEnum.Preliminary:
        return ' (Preliminary)';
      default: {
        return '';
      }
    }
  }

  handleExchangeJobClicked(buttonClickEvent: any, exchangeJobSelectorItem: ExchangeJobExchangeDetail) {
    this.popover.close();

    const payload = {
      exchangeJobId: exchangeJobSelectorItem.ExchangeJobId,
      similarExchangeJobIds: exchangeJobSelectorItem.SimilarExchangeJobIds
    };
    this.exchangeJobSelected.emit(payload);
  }
}
