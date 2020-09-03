import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { StatementModeEnum, StatementForPrint, TotalRewardsControlEnum, ImageControl } from '../../../shared/models';

import * as fromReducers from '../reducers';
import * as fromPageActions from '../actions/statement-print.page.actions';

@Component({
  selector: 'pf-total-rewards-template-print-page',
  templateUrl: './statement-print.page.html',
  styleUrls: ['./statement-print.page.scss']
})
export class StatementPrintPageComponent implements OnDestroy, OnInit {
  printMode = StatementModeEnum.Print;
  statement$: Observable<StatementForPrint>;

  urlParamSubscription = new Subscription();

  loadedImageControlIds = [];
  imageControlsToLoad = 0;
  areAllImagesLoaded = false;

  constructor(private store: Store<fromReducers.State>, private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.urlParamSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.urlParamSubscription = this.route.params.subscribe(params => {
      const pdfId = params['pdfId'];
      this.store.dispatch(new fromPageActions.LoadStatement(pdfId));
    });
    this.statement$ = this.store.pipe(select(fromReducers.selectStatement));

    setTimeout(() => {
      this.statement$.subscribe((statement: StatementForPrint) => {
        if (!statement || !statement.EmployeeRewardsData) { return; }

        // loop through the statement's controls and count how many image controls we have that have an image uploaded
        statement.Pages.forEach(p => p.Sections.forEach(s => s.Columns.forEach(c => c.Controls.forEach(control => {
          if (control.ControlType === TotalRewardsControlEnum.Image && (control as ImageControl).FileUrl) {
            this.imageControlsToLoad++;
          }
        }))));

        // figure out how many total img's we need to wait for, eg 1 img control with 10 employees needs to wait for 10 img's to load
        this.imageControlsToLoad *= statement.EmployeeRewardsData.length;
        if (this.imageControlsToLoad === 0) {
          this.areAllImagesLoaded = true;
        }
      });
    }, 0);
  }

  handleImageLoaded(imageControlId: string): void {
    this.loadedImageControlIds.push(imageControlId);
    if (this.loadedImageControlIds.length >= this.imageControlsToLoad) {
      this.areAllImagesLoaded = true;
    }
  }
}
