// import { ListenerCallback } from '../types/ListenerCallbackType';

export default interface NewNodeParams<K = keyof HTMLElementTagNameMap> {
  tag: K;
  cssClasses?: string[];
  textContent?: string;
  callback?: (e: Event) => void;
  attribute?: string;
  id?: string;
}

// const kek: NewNodeParams = {
//   tag: 'a',
// };
