import { ListenerCallback } from '../types/ListenerCallbackType';

export default interface INewNode {
  tag: string;
  cssClasses: string[] | null;
  textContent: string | null;
  callback: ListenerCallback;
  id?: string;
  for?: string;
}
