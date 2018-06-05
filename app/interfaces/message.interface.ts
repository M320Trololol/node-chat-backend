import { room } from './room.interface';
import { user } from './user.interface';

export interface message {
  user: user;
  roomName: string;
  text: string;
  timestamp: Date;
  meta?: any;
}
