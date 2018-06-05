import { message } from './message.interface';
import { user } from './user.interface';

export interface room {
    roomName: string,
    created: Date,
    owners: user[],
    users: user[],
    messages?: message[],
    password?: string
}