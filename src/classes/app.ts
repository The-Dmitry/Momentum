import './_normalize.scss';
import ClockView from './view/clock/clock-view';
import Player from './view/player/player-view';
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

    document.body.append(wrapper.getElement());
    wrapper.addInnerElement([clock, player]);
  }
}
