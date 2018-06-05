import { message } from './message.interface';
import { user } from './user.interface';

export interface command {
  action: string;
  user: user;
  roomName: string;
  message?: message;
  meta?: any;
  timestamp?: Date;
}
