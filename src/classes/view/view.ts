import NewNodeParams from 'classes/util/interfaces/NewNodeParams';
// import InputNodeCreator from 'classes/util/input-creator';
import NodeCreator from '../util/node-creator';

export default class View<
  T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap
> {
  protected viewNode: NodeCreator;

  constructor(params: NewNodeParams<T>) {
    this.viewNode = new NodeCreator(params);
    // this.createView(params);
  }

  // private createView(params: NewNodeParams<T>) {
  //   // const elementParams: NewNodeParams<T> = {
  //   //   tag: params.tag,
  //   //   cssClasses: params.cssClasses,
  //   //   textContent: '',
  //   //   callback: null,
  //   // };
  //   return this.viewNode;
  // }

  public getElement() {
    return this.viewNode.getNode();
  }

  public addInnerElement(...classInstance: View<T>[]) {
    classInstance.forEach((inst) =>
      this.viewNode.addInnerNode(inst.getElement())
    );
  }

  protected appendNodesArray(list: NodeCreator<T>[], parent?: NodeCreator<T>) {
    list.forEach((node) => {
      if (parent) {
        parent.addInnerNode(node);
        return;
      }
      this.viewNode.addInnerNode(node);
    });
    if (parent) {
      this.viewNode.addInnerNode(parent);
    }
  }
}

// const params: NewNodeParams = {
//   tag: ,
//   cssClasses: ['clock'],
// };

// const test = new View(params);
// test.getElement();
