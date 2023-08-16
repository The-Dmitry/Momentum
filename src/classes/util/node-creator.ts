import NewNodeParams from './interfaces/NewNodeParams';
import { ListenerCallback } from './types/ListenerCallbackType';

export default class NodeCreator<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> {
  protected node: HTMLElementTagNameMap[T];

  constructor(params: NewNodeParams<T>) {
    this.node = this.createNode(params);
  }

  public getNode() {
    return this.node;
  }

  protected createNode(params: NewNodeParams<T>) {
    this.node = document.createElement<T>(params.tag);
    if (params.cssClasses) this.setClassNames(params.cssClasses);
    if (params.textContent) this.setTextContent(params.textContent);
    if (params.callback) this.setCallback(params.callback);
    if (params.id) this.setId(params.id);
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

  public addInnerNode(...list: (NodeCreator | HTMLElement)[]) {
    list.forEach((node) => {
      if (node instanceof NodeCreator) {
        this.node.append(node.getNode());
      } else {
        this.node.append(node);
      }
    });
  }

  public prependInnerNode(...list: (NodeCreator<T> | HTMLElement)[]) {
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
