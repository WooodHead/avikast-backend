import Room, {RoomType} from 'entities/Room';
import Participant, {ParticipantMedia} from 'entities/Participant';

export default abstract class IRoomManager {
  abstract createRoom(
    userId: string,
    name: string,
    type: RoomType,
    passwordProtected: boolean,
    password: string | undefined,
  ): Promise<Room>;

  abstract joinRoom(
    userId: string,
    code: string,
    password: string | undefined,
  ): Promise<Room>;

  abstract getRoomById(userId: string, roomId: string): Promise<Room>;

  abstract getParticipants(userId: string, roomId: string): Promise<Participant[]>;

  abstract getParticipantsTracks(
    userId: string,
    roomId: string,
  ): Promise<ParticipantMedia[]>;
}
