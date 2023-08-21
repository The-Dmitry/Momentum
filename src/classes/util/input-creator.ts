import INewInputNode from './interfaces/INewInputNode';
import NodeCreator from './node-creator';

export default class InputNodeCreator<T extends keyof HTMLElementTagNameMap> extends NodeCreator<T> {
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

  protected setPlaceholder(placeholder: INewInputNode['placeholder']) {
    if (placeholder) {
      this.node.setAttribute('placeholder', placeholder);
    }
  }

  protected setName(name: INewInputNode['name']) {
    if (this.node instanceof HTMLInputElement && name) {
      this.node.name = name;
    }
  }

  protected setType(type: INewInputNode['type']) {
    if (this.node instanceof HTMLInputElement && type) {
      this.node.type = type;
    }
  }

  public getNode() {
    return this.node;
  }
}
