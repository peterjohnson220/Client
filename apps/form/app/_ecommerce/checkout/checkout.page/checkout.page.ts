import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ECommerceService } from 'libs/features/ecommerce/services';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'pf-checkout-page',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss']
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  public errorMessage$: Observable<string>;

  private checkoutSessionId: string;
  private eCommerceInitedSub: Subscription;

  constructor(private eCommerceService: ECommerceService, route: ActivatedRoute) {
    this.checkoutSessionId = route.snapshot.params.checkoutSessionId;
  }

  ngOnDestroy(): void {
    this.eCommerceInitedSub.unsubscribe();
  }

  ngOnInit() {
    this.eCommerceInitedSub = this.eCommerceService.isInitialized$.subscribe(inited => {
      if (inited) {
        this.errorMessage$ = this.eCommerceService.redirectToCheckout(this.checkoutSessionId);
      }
    });
  }

}
