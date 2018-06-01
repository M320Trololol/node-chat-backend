import { message } from './message.interface';

export interface command {
  action: string;
  user: string;
  roomId: string | '';
  message?: message;
  meta?: any;
  timestamp?: Date;
}
