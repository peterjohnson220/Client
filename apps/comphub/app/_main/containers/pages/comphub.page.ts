import { Component, OnInit } from '@angular/core';

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

  selectedPageId$: Observable<string>;

  constructor(private store: Store<fromComphubMainReducer.State>) {
  }

  ngOnInit() {
    this.selectedPageId$ = this.store.select(fromComphubMainReducer.getSelectedPageId);
  }

  handleCardChange(cardId: string) {
    this.store.dispatch(new fromComphubPageActions.AccordionCardChange({ cardId: cardId }));
  }
}
