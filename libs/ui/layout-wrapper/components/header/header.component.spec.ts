// import { TestBed, ComponentFixture } from '@angular/core/testing';
// import { UserListComponent } from './header.component';
// import { generateMockUser } from '../models/user';
//
//
// describe('User List Component', () => {
//   let fixture: ComponentFixture<UserListComponent>;
//   let instance: UserListComponent;
//
//   const user1 = generateMockUser();
//   const user2 = { ...user1, id: 2 };
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [UserListComponent]
//     });
//
//     fixture = TestBed.createComponent(UserListComponent);
//     instance = fixture.componentInstance;
//   });
//
//   it('should compile', () => {
//     fixture.detectChanges();
//
//     expect(fixture).toMatchSnapshot();
//   });
//
//   it('should display a table of users when provided', () => {
//     instance.users = [user1, user2];
//
//     fixture.detectChanges();
//
//     expect(fixture).toMatchSnapshot();
//   });
//
//   it('should display a "No Users" message" when no users are provided', () => {
//     instance.users = [];
//
//     fixture.detectChanges();
//
//     expect(fixture).toMatchSnapshot();
//   });
// });
