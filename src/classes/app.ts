import './_normalize.scss';
import './font.scss';
import ClockView from './view/clock/clock-view';
import Player from './view/player/player-view';
import Todo from './view/todo/todo-view';
import Wrapper from './view/wrapper/wrapper-view';

export default class App {
  constructor() {
    this.createView();
  }

  // eslint-disable-next-line class-methods-use-this
  private createView() {
    const wrapper = new Wrapper();
    const clock = new ClockView();
    const player = new Player();
    const todo = new Todo();

    document.body.append(wrapper.getElement());
    wrapper.addInnerElement(clock, player, todo);
  }
}
