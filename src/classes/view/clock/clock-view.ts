import './clock.scss';
import NewNodeParams from 'classes/util/interfaces/NewNodeParams';
import NodeCreator from '../../util/node-creator';
import View from '../view';
import EventEmitter from '../emitter/event-emitter';

export default class ClockView extends View {
  private emitter: EventEmitter;

  constructor() {
    const params: NewNodeParams = {
      tag: 'section',
      cssClasses: ['clock'],
    };
    super(params);

    this.emitter = EventEmitter.getInstance();
    this.configureView();
  }

  private configureView(): void {
    const time = new NodeCreator({
      tag: 'div',
      cssClasses: ['time'],
    });
    this.viewNode.addInnerNode(time);

    const date = new NodeCreator({
      tag: 'div',
      cssClasses: ['date'],
    });
    this.viewNode.addInnerNode(date);
    this.updateClock(time, date);
  }

  private updateClock(timeNode: NodeCreator, dateNode: NodeCreator) {
    const dateObj = new Date();
    if (dateObj.toLocaleTimeString().endsWith('00:00')) {
      this.emitter.dispatch('part-of-day');
    }
    timeNode.setTextContent(dateObj.toLocaleTimeString());
    dateNode.setTextContent(
      dateObj.toLocaleDateString('en-GB', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    );
    setTimeout(() => {
      this.updateClock(timeNode, dateNode);
    }, 1000);
  }

  public static getPartOfDay() {
    let result = '';
    const partOfDay = new Date().getHours();
    if (partOfDay >= 6 && partOfDay < 12) result = 'morning';
    if (partOfDay >= 12 && partOfDay < 18) result = 'afternoon';
    if (partOfDay >= 18 && partOfDay <= 24) result = 'evening';
    if (partOfDay >= 0 && partOfDay <= 5) result = 'night';
    return result;
  }
}
