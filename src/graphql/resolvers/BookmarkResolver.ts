import {Query, Resolver} from '@nestjs/graphql';
import {UseGuards} from '@nestjs/common';
import AuthGuard from '../../enhancers/guards/AuthGuard';
import CurrentSession from '../../enhancers/decorators/CurrentSession';
import Session from '../../entities/Session';

import {mapBookmarksToGQL} from '../entities/Mappers';
import IBookmarkManager from '../../managers/bookmark/IBookmarkManager';
import Bookmark from '../entities/bookmark/Bookmark';

@Resolver()
@UseGuards(AuthGuard)
export class BookmarkResolver {
  constructor(private readonly bookmarksManager: IBookmarkManager) {}

  @Query(() => [Bookmark])
  async bookmarks(@CurrentSession() {userId}: Session) {
    return mapBookmarksToGQL(await this.bookmarksManager.getBookmarks(userId));
  }
}
