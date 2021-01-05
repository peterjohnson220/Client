import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning';

interface IUserFilterPopoverConfig {
  popoverClass?: string;
  container?: string;
  placement?: PlacementArray;
  popoverTitle?: string;
  autoClose?: boolean | 'inside' | 'outside';
}

export abstract class UserFilterPopoverConfig implements IUserFilterPopoverConfig {
  popoverClass?: string;
  container?: string;
  placement?: PlacementArray;
  popoverTitle?: string;
  autoClose?: boolean | 'inside' | 'outside';
}
