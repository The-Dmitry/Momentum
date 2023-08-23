import NewNodeParams from 'classes/util/interfaces/NewNodeParams';
import NodeCreator from '../util/node-creator';

export default class View<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> {
  protected viewNode: NodeCreator;

  constructor(params: NewNodeParams<T>) {
    this.viewNode = new NodeCreator(params);
  }

  public getElement() {
    return this.viewNode.getNode();
  }

  public addInnerElement(...classInstance: View<T>[]) {
    classInstance.forEach((inst) => this.viewNode.addInnerNode(inst.getElement()));
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

  // eslint-disable-next-line class-methods-use-this
  protected setNodeVisibility(node: NodeCreator, bool: boolean) {
    if (!bool) {
      node.getNode().classList.add('hidden');
      return;
    }
    node.getNode().classList.remove('hidden');
  }
}
