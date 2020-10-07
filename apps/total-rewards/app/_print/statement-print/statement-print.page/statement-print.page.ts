import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { StatementModeEnum, StatementForPrint, TotalRewardsControlEnum, ImageControl } from 'libs/features/total-rewards/total-rewards-statement/models';
import { TrsConstants } from 'libs/features/total-rewards/total-rewards-statement/constants/trs-constants';

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
  statementSubscription = new Subscription();

  loadedImageControlIds = [];
  imageControlsToLoad = 0;
  areAllImagesLoaded = false;

  renderedChartControlIds = [];
  chartControlsToRender = 0;
  areAllChartsRendered = false;

  readyForPdfGenerationSelector = TrsConstants.READY_FOR_PDF_GENERATION_SELECTOR;

  constructor(private store: Store<fromReducers.State>, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.urlParamSubscription = this.route.params.subscribe(params => {
      const pdfId = params['pdfId'];
      this.store.dispatch(new fromPageActions.LoadStatement(pdfId));
    });
    this.statement$ = this.store.pipe(select(fromReducers.selectStatement));

    this.statementSubscription = this.statement$.subscribe((statement: StatementForPrint) => { this.handleStatementChange(statement); });
  }

  ngOnDestroy(): void {
    this.urlParamSubscription.unsubscribe();
    this.statementSubscription.unsubscribe();
  }

  handleImageLoaded(imageControlId: string): void {
    this.loadedImageControlIds.push(imageControlId);
    if (this.loadedImageControlIds.length >= this.imageControlsToLoad) {
      this.areAllImagesLoaded = true;
    }
  }

  handleChartRender(chartControlId: string): void {
    this.renderedChartControlIds.push(chartControlId);
    if (this.renderedChartControlIds.length >= this.chartControlsToRender) {
      this.areAllChartsRendered = true;
    }
  }

  handleStatementChange(statement: StatementForPrint) {
    if (!statement?.EmployeeRewardsData) { return; }

    // loop through the statement's controls and count how many image and chart controls we need to wait for a load event on
    statement.Pages.forEach(p => p.Sections.forEach(s => s.Columns.forEach(c => c.Controls.forEach(control => {
      if (control.ControlType === TotalRewardsControlEnum.Image && (control as ImageControl).FileUrl) {
        this.imageControlsToLoad++;
      } else if (control.ControlType === TotalRewardsControlEnum.Chart) {
        this.chartControlsToRender++;
      }
    }))));

    // figure out how many total images and charts we need to wait for, eg 1 image control with 10 employees needs to wait for 10 images
    this.imageControlsToLoad *= statement.EmployeeRewardsData.length;
    this.chartControlsToRender *= statement.EmployeeRewardsData.length;

    // if there are no images or charts to load then set the ready flag to true so puppeteer knows when to start generating the PDF
    this.areAllImagesLoaded = (this.imageControlsToLoad === 0);
    this.areAllChartsRendered = (this.chartControlsToRender === 0);
  }
}
