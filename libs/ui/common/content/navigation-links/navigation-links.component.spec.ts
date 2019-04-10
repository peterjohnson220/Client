import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';


import { NavigationLinksComponent } from './navigation-links.component';


import { generateNavigationLinkGroupLinks } from 'libs/models/navigation';

describe('Pf-Admin - Navigation - Navigation Links', () => {
    let instance: NavigationLinksComponent;
    let fixture: ComponentFixture<NavigationLinksComponent>;

    const mockNavigationGroupLinks = generateNavigationLinkGroupLinks();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
              ],
              declarations: [ NavigationLinksComponent ],
              schemas: [ NO_ERRORS_SCHEMA ]
        });

        fixture = TestBed.createComponent(NavigationLinksComponent);
        instance = fixture.componentInstance;
    });

    it('Should display navigation group items', () => {
        instance.navigationGroupLinks = mockNavigationGroupLinks;

        fixture.detectChanges();

        expect(fixture).toMatchSnapshot();
    });
});
