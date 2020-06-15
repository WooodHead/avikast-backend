import {Args, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import IRoomManager from '../../managers/room/IRoomManager';
import CurrentSession from 'enhancers/decorators/CurrentSession';
import Session from 'entities/Session';
import {RoomType} from 'entities/Room';
import Room from 'graphql/entities/room/Room';
import {
  mapMessagesToGQL,
  mapMessageToGQL,mapParticipantsToGQL,
  mapParticipantsTracksToGQL,
  mapRoomToGQL,
} from 'graphql/entities/Mappers';
import Participant from 'graphql/entities/room/Participant';
import Message from '../entities/message/Message';
import ParticipantMedia from 'graphql/entities/room/ParticipantMedia';
import {PubSub} from 'graphql-subscriptions';

@Resolver()
export default class RoomResolver {
  constructor(private readonly roomManager: IRoomManager) {}

  @Mutation(() => Room)
  async createRoom(
    @CurrentSession() session: Session,
    @Args('name') name: string,
    @Args({name: 'type', type: () => RoomType}) type: RoomType,
    @Args({name: 'passwordProtected', type: () => Boolean}) passwordProtected: boolean,
    @Args({name: 'password', type: () => String, nullable: true})
    password: string | undefined,
  ): Promise<Room> {
    return mapRoomToGQL(
      await this.roomManager.createRoom(
        session.userId,
        name,
        type,
        passwordProtected,
        password,
      ),
    );
  }

  @Mutation(() => Room)
  async joinRoom(
    @CurrentSession() session: Session,
    @Args('code') code: string,
    @Args({name: 'password', type: () => String, nullable: true}) password: string,
  ) {
    return mapRoomToGQL(await this.roomManager.joinRoom(session.userId, code, password));
  }

  @Query(() => Room)
  async roomById(@CurrentSession() session: Session, @Args('roomId') roomId: string) {
    return mapRoomToGQL(await this.roomManager.getRoomById(session.userId, roomId));
  }

  @Query(() => [Participant])
  async participants(@CurrentSession() session: Session, @Args('roomId') roomId: string) {
    return mapParticipantsToGQL(
      await this.roomManager.getParticipants(session.userId, roomId),
    );
  }

  @Query(() => [ParticipantMedia])
  async participantsTracks(
    @CurrentSession() session: Session,
    @Args('roomId') roomId: string,
  ) {
    const pubSub = new PubSub();
    const tracks = await this.roomManager.getParticipantsTracks(session.userId, roomId);
    const mapTracks = mapParticipantsTracksToGQL(tracks);
    // eslint-disable-next-line no-console
    console.log('participant tracks', mapTracks, 'participantTracks');
    await pubSub.publish('participantTrackChanged', {mapTracks});
    return mapTracks;
  }

  @Subscription(() => [ParticipantMedia], {
    name: 'participantTrackChanged',
  })
  returnTracks() {
    const pubSub = new PubSub();
    pubSub.asyncIterator('participantTrackChanged');
    // eslint-disable-next-line no-console

    // eslint-disable-next-line no-console
    console.log('subscribtion TRIGGERED');
    return this.participantsTracks;
  }

  // @ResolveField()
  // async me(@Parent() room: Room) {
  //   console.log(room, 'ResolverField');
  // }

  @Query(() => [Message])
  async messagesByRoom(@Args({name: 'roomId', type: () => String}) roomId: string) {
    return mapMessagesToGQL(await this.roomManager.getMessagesByRoom(roomId));
  }

  @Mutation(() => Message)
  async createTestMessage() {
    return mapMessageToGQL(await this.roomManager.createTestMessage());
  }

  @Mutation(() => Message)
  async createMessage(
    @CurrentSession() session: Session,
    @Args({name: 'roomId', type: () => String}) roomId: string,
    @Args({name: 'messageBody', type: () => String}) messageBody: string,
    @Args({name: 'receiverId', type: () => String}) receiverId: string,
  ) {
    return this.roomManager.createMessage(
      session.userId,
      roomId,
      messageBody,
      receiverId,
    );
  }

  @Query(() => [ParticipantMedia])
  async participantsTracks(
    @CurrentSession() session: Session,
    @Args('roomId') roomId: string,
  ) {
    const pubSub = new PubSub();
    const tracks = await this.roomManager.getParticipantsTracks(session.userId, roomId);
    const mapTracks = mapParticipantsTracksToGQL(tracks);
    // eslint-disable-next-line no-console
    console.log('participant tracks', mapTracks, 'participantTracks');
    await pubSub.publish('participantTrackChanged', {mapTracks});
    return mapTracks;
  }

  @Subscription(() => [ParticipantMedia], {
    name: 'participantTrackChanged',
  })
  returnTracks() {
    const pubSub = new PubSub();
    pubSub.asyncIterator('participantTrackChanged');
    // eslint-disable-next-line no-console

    // eslint-disable-next-line no-console
    console.log('subscribtion TRIGGERED');
    return this.participantsTracks;
  }

  // @ResolveField()
  // async me(@Parent() room: Room) {
  //   console.log(room, 'ResolverField');
  // }
}
