import './clock.scss';
import INewNode from 'classes/util/interfaces/INewNode';
import NodeCreator from '../../util/node-creator';
import View from '../view';

export default class ClockView extends View {
  constructor() {
    const params: INewNode = {
      tag: 'section',
      cssClasses: ['clock'],
      textContent: null,
      callback: null,
    };
    super(params);
    this.configureView();
  }

  private configureView(): void {
    const timeParams: INewNode = {
      tag: 'div',
      cssClasses: ['time'],
      textContent: null,
      callback: null,
    };
    const time = new NodeCreator(timeParams);
    this.viewNode.addInnerNode(time);

    const dateParams: INewNode = {
      tag: 'div',
      cssClasses: ['date'],
      textContent: null,
      callback: null,
    };
    const date = new NodeCreator(dateParams);
    this.viewNode.addInnerNode(date);
    this.updateClock(time, date);
    // this.test();
  }

  private updateClock(timeNode: NodeCreator, dateNode: NodeCreator) {
    const dateObj = new Date();
    timeNode.setTextContent(dateObj.toLocaleTimeString());
    dateNode.setTextContent(dateObj.toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' }));
    setTimeout(() => {
      this.updateClock(timeNode, dateNode);
    }, 1000);
  }
}
