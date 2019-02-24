import IDocument from "./IDocument";
import IExtWebSocket from "./IExtWebSocket";
import IUser from "./IUser";

export default interface ICursorWebSocket extends IExtWebSocket {
  document: IDocument;
  color: string;
  user: IUser;
}
