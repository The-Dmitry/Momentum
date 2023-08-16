import INewInputNode from './interfaces/INewInputNode';
// import INewNode from './interfaces/INewNode';
import NodeCreator from './node-creator';

export default class InputNodeCreator<T extends keyof HTMLElementTagNameMap> extends NodeCreator<T> {
  // protected node: HTMLInputElement;

  constructor(params: INewInputNode<T>) {
    super(params);
    this.node = this.createNode(params);
  }

  protected createNode(params: INewInputNode<T>) {
    super.createNode(params);
    this.setType(params.type);
    this.setName(params.name);
    this.setId(params.id);
    this.setPlaceholder(params.placeholder);
    return this.node;
  }

  protected setPlaceholder(placeholder: string | undefined) {
    if (placeholder) {
      this.node.setAttribute('placeholder', placeholder);
    }
  }

  public addInnerNode(node: NodeCreator | HTMLElement) {
    if (node instanceof NodeCreator) {
      this.node.append(node.getNode());
    } else {
      this.node.append(node);
    }
  }

  protected setName(name: string | undefined) {
    if (this.node instanceof HTMLInputElement && name) {
      this.node.name = name;
    }
  }

  protected setType(type: string | undefined) {
    if (this.node instanceof HTMLInputElement && type) {
      this.node.type = type;
    }
  }

  public getNode() {
    return this.node;
  }
}
