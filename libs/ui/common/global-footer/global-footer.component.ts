import { Component } from '@angular/core';

@Component({
  selector: 'pf-global-footer',
  templateUrl: './global-footer.component.html',
  styleUrls: ['./global-footer.component.scss']
})
export class GlobalFooterComponent {
  currentYear = new Date().getFullYear();
}
