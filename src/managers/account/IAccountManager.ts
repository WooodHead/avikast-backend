import Account from '../../entities/Account';
import {ID} from 'entities/Common';
import User from 'entities/User';
import Resume from 'entities/Resume';

export default abstract class IAccountManager {
  abstract getMyAccount(myUserId: string): Promise<Account>;

  abstract updateAccount(
    myUserId: ID,
    data: {
      name: string | undefined;
      country: string | undefined;
      city: string | undefined;
      dateOfBirth: Date | undefined;
      tags: string[] | undefined;
      skills: string[] | undefined;
      referralCode: string | undefined;
    },
  ): Promise<Account>;

  abstract updateUserImage(myUserId: string, fileId: string): Promise<boolean>;

  abstract updateUserLogoImage(myUserId: string, fileId: string): Promise<boolean>;

  abstract updateUserBackgroundImage(myUserId: string, fileId: string): Promise<boolean>;

  abstract getUsers(): Promise<User[]>;

  abstract deleteUsers(userIds: string[]): Promise<void>;

  abstract banUsersTemporary(userIds: string[], untilDate: string): Promise<void>;

  abstract banUsersPermanently(userIds: string[]): Promise<void>;

  abstract restoreUsers(userIds: string[]): Promise<void>;

  abstract referrersByUserId(userId: string): Promise<User[]>;

  abstract saveResume(userId: string, resume: Resume): Promise<void>;

  abstract getResume(userId: string): Promise<Resume | undefined>;
}
