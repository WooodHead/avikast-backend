import IRoomManager from './IRoomManager';
import IMediasoupService from '../../services/mediasoup/IMediasoupService';
import {Injectable} from '@nestjs/common';
import IRoomStore from 'database/stores/room/IRoomStore';
import {RoomType} from 'entities/Room';
import {mapParticipantsFromDB, mapRoomFromDB} from 'database/entities/Mappers';
import {ParticipantMedia, ParticipantRole} from 'entities/Participant';
import {
  mapMessagesFromDB,
  mapParticipantsFromDB,
  mapRoomFromDB,
} from 'database/entities/Mappers';
import {ParticipantRole} from 'entities/Participant';
import {generate as generatePassword} from 'generate-password';
import IMessageStore from '../../database/stores/message/IMessageStore';

@Injectable()
export default class RoomManager extends IRoomManager {
  constructor(
    private readonly roomStore: IRoomStore,
    private readonly mediasoupService: IMediasoupService,
    private readonly messageStore: IMessageStore,
  ) {
    super();
  }

  async createRoom(
    userId: string,
    name: string,
    type: RoomType,
    passwordProtected: boolean,
    password: string | undefined,
  ) {
    const code = RoomManager.generateCode();
    const room = mapRoomFromDB(
      await this.roomStore.createRoom({
        name,
        user: {id: userId},
        type,
        passwordProtected,
        password,
        code,
      }),
    );
    await this.roomStore.createParticipant({
      room,
      user: {id: userId},
      role: ParticipantRole.Owner,
      media: {
        audio: {
          enabled: false,
          options: undefined,
          mediaKind: undefined,
          mediaType: undefined,
        },
        video: {
          enabled: false,
          options: undefined,
          mediaKind: undefined,
          mediaType: undefined,
        },
        screen: {
          enabled: false,
          options: undefined,
          mediaKind: undefined,
          mediaType: undefined,
        },
      },
    });
    await this.mediasoupService.createRouter(room.id);
    return room;
  }

  async joinRoom(userId: string, code: string, password: string | undefined) {
    const dbRoom = await this.roomStore.findRoomByCode(code);
    if (!dbRoom) throw new Error('Code is not valid');
    if (dbRoom.user.id === userId) throw new Error('Room creator cannot join his room');
    if (dbRoom.passwordProtected && dbRoom.password !== password)
      throw new Error('Password is not valid');

    const room = mapRoomFromDB(dbRoom);
    const participant = await this.roomStore.findParticipant(room.id, userId);
    if (!participant) {
      await this.roomStore.createParticipant({
        user: {id: userId},
        room,
        role: ParticipantRole.User,
        media: {
          audio: {
            enabled: false,
            options: undefined,
            mediaKind: undefined,
            mediaType: undefined,
          },
          video: {
            enabled: false,
            options: undefined,
            mediaKind: undefined,
            mediaType: undefined,
          },
          screen: {
            enabled: false,
            options: undefined,
            mediaKind: undefined,
            mediaType: undefined,
          },
        },
      });
    }

    return room;
  }

  async getRoomById(userId: string, roomId: string) {
    const room = await this.roomStore.findRoomByUser(roomId);
    if (!room) throw new Error('Room is not found');
    return mapRoomFromDB(room);
  }

  private static generateCode() {
    return generatePassword({
      length: 10,
      numbers: true,
      lowercase: true,
      uppercase: false,
    });
  }

  async getParticipants(userId: string, roomId: string) {
    if (!(await this.roomStore.findParticipant(roomId, userId)))
      throw new Error("You don't belong to this room");
    return mapParticipantsFromDB(await this.roomStore.getParticipants(roomId));
  }

  async getParticipantsTracks(userId: string, roomId: string) {
    if (!(await this.roomStore.findParticipant(roomId, userId)))
      throw new Error("You don't belong to this room");
    const participants = mapParticipantsFromDB(
      await this.roomStore.getParticipants(roomId),
    );
    const tracks: ParticipantMedia[] = [];
    participants.forEach((participant) => {
      const track = participant.media;
      tracks.push(track);
    });
    return tracks;
  }

  async getMessagesByRoom(roomId: string) {
    if (!(await this.messageStore.getMessagesByRoom(roomId)))
      throw new Error("Message's array is empty");
    return mapMessagesFromDB(await this.messageStore.getMessagesByRoom(roomId));
  }

  async createTestMessage() {
    await this.messageStore.createTestMessage();
    return true;
  }
}
