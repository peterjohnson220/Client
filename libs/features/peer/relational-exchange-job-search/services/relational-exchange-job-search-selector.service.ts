import { Injectable } from '@angular/core';

import cloneDeep from 'lodash/cloneDeep';

import { RelationalExchangeJobResult } from 'libs/models/peer';

@Injectable()
export class RelationalExchangeJobSearchSelectorService {

  static applyExchangeJobSelections(
    exchangeJobSearchResults: RelationalExchangeJobResult[],
    selectedExchangeJobs: RelationalExchangeJobResult[]
  ): RelationalExchangeJobResult[] {
    const relationalExchangeJobResultsCopy = cloneDeep(exchangeJobSearchResults);
    const selectedExchangeJobsCopy = cloneDeep(selectedExchangeJobs);
    const selectedExchangeJobIds = selectedExchangeJobsCopy.map(ej => ej.ExchangeJobId);
    relationalExchangeJobResultsCopy.forEach(e => {
      if (selectedExchangeJobIds.indexOf(e.ExchangeJobId) !== -1) {
        e.IsSelected = true;
      }
    });

    return relationalExchangeJobResultsCopy;
  }

  static toggleExchangeJobSelection(
    exchangeJob: RelationalExchangeJobResult,
    exchangeJobResults: RelationalExchangeJobResult[],
    currentlySelectedExchangeJobs: RelationalExchangeJobResult[]
  ): { ExchangeJobResults: RelationalExchangeJobResult[], ExchangeJobSelections: RelationalExchangeJobResult[] } {
    const exchangeJobResultsCopy = cloneDeep(exchangeJobResults);
    let selectedExchangeJobsCopy = cloneDeep(currentlySelectedExchangeJobs);

    const exchangeJobMatch = exchangeJobResultsCopy.find(e => e.ExchangeJobId === exchangeJob.ExchangeJobId);
    exchangeJobMatch.IsSelected = !exchangeJobMatch.IsSelected;

    const matchingValue = selectedExchangeJobsCopy.find(selectedEJ => selectedEJ.ExchangeJobId === exchangeJob.ExchangeJobId);
    if (!!matchingValue) {
      selectedExchangeJobsCopy = selectedExchangeJobsCopy.filter(selectedEJ => selectedEJ.ExchangeJobId !== matchingValue.ExchangeJobId);
    } else {
      selectedExchangeJobsCopy.push(exchangeJob);
    }

    return {
      ExchangeJobResults: exchangeJobResultsCopy,
      ExchangeJobSelections: selectedExchangeJobsCopy
    };
  }

  static clearSelectedExchangeJobResults(exchangeJobSearchResults: RelationalExchangeJobResult[]): RelationalExchangeJobResult[] {
    return cloneDeep(exchangeJobSearchResults).map(e => {
      e.IsSelected = false;
      return e;
    });
  }

  static get defaultAssignedEmployeesGridState(): { skip: number, take: number, filter: any, sort: any[] } {
    return {
      skip: 0,
      take: 20,
      filter: {
        filters: [],
        logic: 'and'
      },
      sort: []
    };
  }
}
