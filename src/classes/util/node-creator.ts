import NewNodeParams from './interfaces/NewNodeParams';

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
    if (params.attribute) this.setAttribute(params.attribute);
    return this.node;
  }

  public setClassNames(cssList: NewNodeParams['cssClasses']) {
    if (cssList) {
      this.node.className = '';
      this.node.classList.add(...cssList);
    }
  }

  public setTextContent(text: NewNodeParams['textContent']) {
    if (text) this.node.textContent = text;
  }

  public setCallback(callback: (e: Event) => void, handler: keyof GlobalEventHandlersEventMap = 'click') {
    this.node.addEventListener(handler, (e) => {
      callback(e);
    });
  }

  protected setId(id: NewNodeParams['id']) {
    if (id) this.node.id = id;
  }

  public setAttribute(name: NewNodeParams['attribute'], type: string = 'for') {
    if (name) {
      this.node.setAttribute(type, name);
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

// const test = new NodeCreator({
//   tag: 'div',
//   cssClasses: ['lel'],
// });

// test.getNode()
// test.setCallback((e) => {
//   if(e instanceof KeyboardEvent)
// }, 'mousedown')
