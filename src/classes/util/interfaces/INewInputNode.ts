import NewNodeParams from './NewNodeParams';

export default interface INewInputNode<T = keyof HTMLElementTagNameMap> extends NewNodeParams<T> {
  type?: string;
  placeholder?: string;
  name?: string;
  for?: string;
}
