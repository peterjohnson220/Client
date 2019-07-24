import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models/state';
import { CompanyStructure } from 'libs/models/structures/company-structure.model';

@Component({
  selector: 'pf-job-based-range-structures-page',
  templateUrl: './job-based-range-structures.page.html',
  styleUrls: ['./job-based-range-structures.page.scss']
})
export class JobBasedRangeStructuresPageComponent implements OnInit, OnDestroy {
  public jobBasedRangeStructureFavorites$: Observable<AsyncStateObj<CompanyStructure[]>>;

  constructor(public route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  trackByFn(sr: CompanyStructure) {
    return sr.CompanyStructuresID;
  }

  handleSearchClicked() {
  }

  ngOnDestroy(): void {
  }
}
