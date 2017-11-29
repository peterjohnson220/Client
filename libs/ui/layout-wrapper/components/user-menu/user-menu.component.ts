import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pf-layout-wrapper-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css']
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

  avatarUrl = 'https://f7021091349f6caaffd2-5b56effc7aa76a3323ddc3429496d092.ssl.cf5.rackcdn.com/avatars/default_user.png';

  constructor() { }

  ngOnInit() {
  }

}
