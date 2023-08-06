import INewNode from './INewNode';

export default interface INewInputNode extends INewNode {
  type: string;
  placeholder?: string;
  name?: string;
}
