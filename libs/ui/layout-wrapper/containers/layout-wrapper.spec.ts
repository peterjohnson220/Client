// import { TestBed, ComponentFixture } from '@angular/core/testing';
//
// import { StoreModule, Store, combineReducers } from '@ngrx/store';
//
// import { UserListPageComponent } from './user-list-page.component';
// import * as userListActions from '../actions/user-list.actions';
// import * as fromFeature1 from '../reducers';
// import { UserListComponent } from '../components/user-list.component';
//
// describe('User List Page', () => {
//   let fixture: ComponentFixture<UserListPageComponent>;
//   let store: Store<fromFeature1.State>;
//   let instance: UserListPageComponent;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         StoreModule.forRoot({
//           feature1: combineReducers(fromFeature1.reducers)
//         })
//       ],
//       declarations: [UserListPageComponent, UserListComponent ]
//     });
//
//     fixture = TestBed.createComponent(UserListPageComponent);
//     instance = fixture.componentInstance;
//     store = TestBed.get(Store);
//
//     spyOn(store, 'dispatch').and.callThrough();
//
//     fixture.detectChanges();
//   });
//
//   it('should compile', () => {
//     expect(fixture).toMatchSnapshot();
//   });
//
//   it('should dispatch a load users action on init', () => {
//     expect(store.dispatch).toHaveBeenCalledWith(new userListActions.LoadUsers());
//   });
//
// });
