import INewNode from './interfaces/INewNode';
import { ListenerCallback } from './types/ListenerCallbackType';

export default class NodeCreator {
  protected node: HTMLElement;

  constructor(params: INewNode) {
    this.node = this.createNode(params);
  }

  public getNode() {
    return this.node;
  }

  protected createNode(params: INewNode): HTMLElement {
    this.node = document.createElement(params.tag);
    this.setClassNames(params.cssClasses);
    this.setTextContent(params.textContent);
    this.setCallback(params.callback);
    this.setId(params.id);
    this.setForAttr(params.for);
    return this.node;
  }

  public setClassNames(cssList: string[] | null) {
    if (cssList) {
      this.node.className = '';
      this.node.classList.add(...cssList);
    }
  }

  public setTextContent(text: string | null) {
    this.node.textContent = text;
  }

  public setCallback(callback: ListenerCallback, handler: string = 'click') {
    if (callback) {
      this.node.addEventListener(handler, (e) => {
        callback(e);
      });
    }
  }

  protected setId(id: string | undefined) {
    if (id) {
      this.node.id = id;
    }
  }

  protected setForAttr(name: string | undefined) {
    if (name) {
      this.node.setAttribute('for', name);
    }
  }

  public addInnerNode(...list: (NodeCreator | HTMLElement)[]) {
    list.forEach((node) => {
      if (node instanceof NodeCreator) {
        this.node.append(node.getNode());
      } else {
        this.node.append(node);
      }
    });
  }

  public prependInnerNode(...list: (NodeCreator | HTMLElement)[]) {
    list.forEach((node) => {
      if (node instanceof NodeCreator) {
        this.node.prepend(node.getNode());
      } else {
        this.node.prepend(node);
      }
    });
  }

  public removeAllChildren() {
    while (this.node.firstChild) {
      this.node.removeChild(this.node.firstChild);
    }
  }
}
