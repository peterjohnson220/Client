import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as fromJobsPeerMatchesReducer from '../../../reducers';
import * as fromJobPeerMatchesActions from '../../../actions';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs/Subscription';
@Component({
  selector: 'pf-peer-exchange-matches',
  templateUrl: './peer-exchange-matches.component.html',
  styleUrls: ['./peer-exchange-matches.component.scss']
})
export class PeerExchangeMatchesComponent implements OnInit, OnChanges, OnDestroy
{

  @Input() jobId: number;
  @Input() offset: any;
  loading: boolean;
  peerMatchesLoaded$: Observable<boolean>;
  peerMatches: any;
  peerMatchesSubscription: Subscription;
  constructor(private store: Store<fromJobsPeerMatchesReducer.State>) {
    this.peerMatchesLoaded$ = this.store.select(fromJobsPeerMatchesReducer.getPeerMatchesLoaded);
  }

  ngOnInit() {
     this.peerMatchesSubscription = this.store.select(fromJobsPeerMatchesReducer.getPeerMatches).subscribe(v => {
       if (v) {
         const documentHeight = document.documentElement.clientHeight;
         const divHeight = v.length * 12 + 200;
         if (divHeight + this.offset.top > documentHeight) {
           this.offset.top = documentHeight - divHeight;
         }
         this.peerMatches = v;
       }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['jobId']) {
       this.store.dispatch( new fromJobPeerMatchesActions.LoadJobPeerMatches(changes['jobId'].currentValue));
    }
  }

  ngOnDestroy() {
    this.peerMatchesSubscription.unsubscribe();
  }
}
