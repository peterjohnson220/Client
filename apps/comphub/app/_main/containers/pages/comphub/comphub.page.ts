import { Component, OnInit, HostListener } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromComphubPageActions from '../../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../../reducers';
import { AccordionCards, AccordionCard, ComphubPages } from '../../../data';

@Component({
  selector: 'pf-comphub-page',
  templateUrl: './comphub.page.html',
  styleUrls: ['./comphub.page.scss']
})
export class ComphubPageComponent implements OnInit {
  accordionCards: AccordionCard[] = AccordionCards;
  comphubPages = ComphubPages;
  cardContentContainerWidth: number;

  selectedPageIndex$: Observable<number>;

  private readonly cardHeaderWidth = 60;
  private readonly cardHeaderMargin = 8;
  private readonly numberOfCards = 4;

  constructor(private store: Store<fromComphubMainReducer.State>) {
    this.selectedPageIndex$ = this.store.select(fromComphubMainReducer.getSelectedPageIndex);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    window.setTimeout(() => {
      this.updateCardContentContainerWidth();
    }, 100);
  }

  ngOnInit() {
    this.updateCardContentContainerWidth();
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
}
