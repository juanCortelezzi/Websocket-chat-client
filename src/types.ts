export interface User {
  id: string;
  name: string;
  room: string;
}

export interface RoomMessage {
  message: string;
  from: string;
}
