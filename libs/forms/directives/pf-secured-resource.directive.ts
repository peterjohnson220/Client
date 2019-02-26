import { ContentChild, Directive, DoCheck, ElementRef, Input, Renderer2 } from '@angular/core';
import { FormControlName } from '@angular/forms';
import {PermissionService} from '../../core/services';
import {PermissionCheckEnum} from '../../constants';

@Directive({
  selector: '[pfSecuredResource]'
})
export class PfSecuredResourceDirective implements DoCheck {
  private permissionsToAuthorize: string | string[];
  private _PermissionsService: PermissionService;
  @ContentChild(FormControlName) control: FormControlName;

  @Input() set pfSecuredResource(permissionToAuthorize: string | string[]) {
    this.permissionsToAuthorize = permissionToAuthorize;
  }

  constructor(private permissionService: PermissionService, private _el: ElementRef, private _renderer: Renderer2) {
    this._PermissionsService = permissionService;
  }

  ngDoCheck(): void {
    let isAuthorized = false;

    if (typeof this.permissionsToAuthorize === 'string') {
      isAuthorized = this.doAuthorize(this.permissionsToAuthorize);
    } else {
      isAuthorized = this.doAuthorizeAny(this.permissionsToAuthorize);
    }

    this.removeElement(isAuthorized);
  }

  doAuthorize(permissionToAuthorize: string): boolean {
    const permissionArray: string[] = [permissionToAuthorize];
    return this._PermissionsService.CheckPermission(permissionArray, PermissionCheckEnum.Single);
  }

  doAuthorizeAny(permissionsToAuthorize: string[]): boolean {
    return this._PermissionsService.CheckPermission(permissionsToAuthorize, PermissionCheckEnum.Any);
  }

  removeElement(isAuthorized: boolean): void {
    if (!isAuthorized) {
      this._renderer.removeChild(this._el.nativeElement.parentNode, this._el.nativeElement);
    }
  }
}
