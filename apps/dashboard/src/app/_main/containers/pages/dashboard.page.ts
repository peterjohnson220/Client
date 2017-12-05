import { Component } from '@angular/core';

@Component({
  selector: 'pf-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPageComponent {

  constructor() {
    document.body.style.backgroundImage = `url('./assets/images/Elegant_Background-8.jpg')`;
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundSize = 'auto';
  }
}
