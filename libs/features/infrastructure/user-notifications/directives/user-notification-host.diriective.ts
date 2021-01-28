import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[pfNotificationHost]'
})

export class UserNotificationHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
