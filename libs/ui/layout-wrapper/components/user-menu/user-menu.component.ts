import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
  selector: 'pf-layout-wrapper-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  appUser = {
    firstName: 'John',
    lastName: 'Doe'
  };

  navigationLinks = [
    { Name: 'Unimpersonate', Url: '#' },
    { Name: 'User Settings', Url: '#' },
    { Name: 'Company Admin', Url: '#' },
    { Name: 'Site Admin', Url: '#' }];

  avatarUrl = environment.avatarSource;

  constructor() { }

  ngOnInit() {
  }

}
