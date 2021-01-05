import { ShareUserResponse } from '../../../../models/payfactors-api/user/response';
import { AutoShareUser } from '../../../../models/user-settings';

export class PayfactorsApiModelMapper {
  static mapShareUserResponseToAutoShareUser(data: ShareUserResponse[]): AutoShareUser[] {
    return data.map((user) => {
      return {
        UserId: user.UserId,
        FirstName: user.FirstName,
        LastName: user.LastName,
        FullName: `${user.FirstName} ${user.LastName}`,
        UserPicture: user.UserPicture,
        Title: user.Title,
        IsSelected: false
      };
    });
  }
}
