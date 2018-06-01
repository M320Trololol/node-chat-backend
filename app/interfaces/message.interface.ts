export interface message {
  user: string;
  room: string;
  text: string;
  timestamp: Date;
  meta?: any;
}
