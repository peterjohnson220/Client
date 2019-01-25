import { Component, OnInit, HostListener } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromComphubPageActions from '../../actions/comphub-page.actions';
import * as fromComphubMainReducer from '../../reducers';
import { AccordionCards, AccordionCard, ComphubPages } from '../../data';

@Component({
  selector: 'pf-comphub-page',
  templateUrl: './comphub.page.html',
  styleUrls: ['./comphub.page.scss']
})
export class ComphubPageComponent implements OnInit {
  accordionCards: AccordionCard[] = AccordionCards;
  comphubPages = ComphubPages;
  cardContentContainerWidth: number;

  selectedPageId$: Observable<string>;

  private readonly cardHeaderWidth = 60;
  private readonly cardHeaderMargin = 8;
  private readonly numberOfCards = 4;

  constructor(private store: Store<fromComphubMainReducer.State>) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    window.setTimeout(() => {
      this.updateCardContentContainerWidth();
    }, 100);
  }

  ngOnInit() {
    this.selectedPageId$ = this.store.select(fromComphubMainReducer.getSelectedPageId);
    this.updateCardContentContainerWidth();
  }

  handleCardChange(cardId: string) {
    this.store.dispatch(new fromComphubPageActions.AccordionCardChange({ cardId: cardId }));
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
