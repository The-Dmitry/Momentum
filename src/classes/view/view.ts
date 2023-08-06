import INewNode from 'classes/util/interfaces/INewNode';
import InputNodeCreator from 'classes/util/input-creator';
import NodeCreator from '../util/node-creator';

export default class View {
  protected viewNode: NodeCreator;

  constructor(params: INewNode) {
    this.viewNode = this.createView(params);
  }

  private createView(params: INewNode) {
    const elementParams: INewNode = {
      tag: params.tag,
      cssClasses: params.cssClasses,
      textContent: '',
      callback: null,
    };
    this.viewNode = new NodeCreator(elementParams);
    return this.viewNode;
  }

  public getElement() {
    return this.viewNode.getNode();
  }

  public addInnerElement(...classInstance: View[]) {
    classInstance.forEach((inst) => this.viewNode.addInnerNode(inst.getElement()));
  }

  protected appendNodesArray(list: NodeCreator[] | InputNodeCreator[], parent?: NodeCreator) {
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
