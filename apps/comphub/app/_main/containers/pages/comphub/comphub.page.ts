import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { AccordionCards, AccordionCard, ComphubPages } from '../../../data';
import { PricingPaymarket, JobData } from '../../../models';

@Component({
  selector: 'pf-comphub-page',
  templateUrl: './comphub.page.html',
  styleUrls: ['./comphub.page.scss']
})
export class ComphubPageComponent implements OnInit, OnDestroy {
  accordionCards: AccordionCard[] = AccordionCards;
  comphubPages = ComphubPages;
  cardContentContainerWidth: number;

  selectedPageIndex$: Observable<number>;
  selectedJob$: Observable<string>;
  selectedPaymarket$: Observable<PricingPaymarket>;
  selectedJobData$: Observable<JobData>;

  private selectedJobSubscription: Subscription;
  private selectedPaymarketSubscription: Subscription;
  private selectedJobDataSubscription: Subscription;

  private readonly cardHeaderWidth = 60;
  private readonly cardHeaderMargin = 8;
  private readonly numberOfCards = 4;

  constructor(private store: Store<fromComphubMainReducer.State>) {
    this.selectedPageIndex$ = this.store.select(fromComphubMainReducer.getSelectedPageIndex);
    this.selectedJob$ = this.store.select(fromComphubMainReducer.getSelectedJob);
    this.selectedPaymarket$ = this.store.select(fromComphubMainReducer.getSelectedPaymarket);
    this.selectedJobData$ = this.store.select(fromComphubMainReducer.getSelectedJobData);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    window.setTimeout(() => {
      this.updateCardContentContainerWidth();
    }, 100);
  }

  ngOnInit() {
    this.updateCardContentContainerWidth();
    this.selectedJobSubscription = this.selectedJob$.subscribe((selectedJob: string) =>
      this.updateCardSubtitle(ComphubPages.Jobs, selectedJob));
    this.selectedPaymarketSubscription = this.selectedPaymarket$.subscribe((selectedPaymarket: PricingPaymarket) => {
      if (!!selectedPaymarket) {
        this.updateCardSubtitle(ComphubPages.Markets, selectedPaymarket.PayMarketName);
      }
    });
    this.selectedJobDataSubscription = this.selectedJobData$.subscribe((jobData: JobData) => {
      if (!!jobData) {
        this.updateCardSubtitle(ComphubPages.Data, `Payfactors ${jobData.JobTitle}`);
      }
    });
  }

  ngOnDestroy() {
    this.selectedJobSubscription.unsubscribe();
    this.selectedPaymarketSubscription.unsubscribe();
    this.selectedJobDataSubscription.unsubscribe();
  }

  handleCardChange(cardId: string) {
    this.store.dispatch(new fromComphubPageActions.NavigateToCard({ cardId: cardId }));
  }

  private updateCardContentContainerWidth() {
    const wrapperElement = document.getElementsByClassName('wrapper');
    if (wrapperElement === undefined || wrapperElement[0] === undefined) {
      return;
    }
    this.cardContentContainerWidth = wrapperElement[0].clientWidth -
      (this.cardHeaderWidth * this.numberOfCards) - this.cardHeaderMargin;
  }

  private updateCardSubtitle(cardId: string, subtitle: string) {
    const card = this.accordionCards.find(c => c.Id === cardId);
    if (!!card) {
      card.Subtitle = subtitle;
    }
  }
}
