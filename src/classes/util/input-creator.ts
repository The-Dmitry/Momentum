import INewInputNode from './interfaces/INewInputNode';
// import INewNode from './interfaces/INewNode';
import NodeCreator from './node-creator';

export default class InputNodeCreator extends NodeCreator {
  protected node: HTMLInputElement;

  constructor(params: INewInputNode) {
    super(params);
    this.node = this.createNode(params);
  }

  protected createNode(params: INewInputNode): HTMLInputElement {
    this.node = document.createElement(params.tag) as HTMLInputElement;
    this.node.type = params.type;
    this.setClassNames(params.cssClasses);
    this.setTextContent(params.textContent);
    this.setCallback(params.callback);
    this.setId(params.id);
    this.setPlaceholder(params.placeholder);
    this.setName(params.name);
    return this.node;
  }

  protected setPlaceholder(placeholder: string | undefined) {
    if (placeholder) {
      this.node.setAttribute('placeholder', placeholder);
    }
  }

  public addInnerNode(node: NodeCreator | HTMLElement | InputNodeCreator) {
    if (node instanceof NodeCreator) {
      this.node.append(node.getNode());
    } else {
      this.node.append(node);
    }
  }

  protected setName(name: string | undefined) {
    if (name) {
      this.node.name = name;
    }
  }

  public getNode() {
    return this.node;
  }
}
