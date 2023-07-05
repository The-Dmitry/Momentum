import INewNode from './interfaces/INewNode';

export default class NodeCreator {
  private node: HTMLElement;

  constructor(params: INewNode) {
    this.node = this.createNode(params);
  }

  public getNode(): HTMLElement {
    return this.node;
  }

  private createNode(params: INewNode): HTMLElement {
    this.node = document.createElement(params.tag);
    this.setClassNames(params.cssClasses);
    this.setTextContent(params.textContent);
    this.setCallback(params.callback);
    return this.node;
  }

  public setClassNames(cssList: string[] | null) {
    if (cssList) {
      this.node.classList.add(...cssList);
    }
  }

  public setTextContent(text: string | null) {
    this.node.textContent = text;
  }

  public setCallback(callback: null | ((flag?: boolean) => void) | void) {
    if (callback) {
      this.node.addEventListener('click', () => {
        callback();
      });
    }
  }

  public addInnerNode(node: NodeCreator | HTMLElement) {
    if (node instanceof NodeCreator) {
      this.node.append(node.getNode());
    } else {
      this.node.append(node);
    }
  }
}
