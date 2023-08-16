import { ListenerCallback } from '../types/ListenerCallbackType';

export default interface NewNodeParams<K = keyof HTMLElementTagNameMap> {
  tag: K;
  cssClasses?: string[];
  textContent?: string;
  callback?: ListenerCallback;
  id?: string;
}

// const kek: NewNodeParams = {
//   tag: 'a',
// };
