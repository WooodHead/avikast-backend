import Message from 'database/entities/Message';

export default abstract class IMessageStore {
  abstract createMessage(message: {
    sender: string;
    roomId: string;
    body: string;
    date: string;
    receiverId?: string | undefined;
  }): Promise<Boolean>;

  abstract getMessagesByRoom(roomId: string): Promise<Message[]>;
}
