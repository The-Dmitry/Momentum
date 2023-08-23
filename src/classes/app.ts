import './_normalize.scss';
import './font.scss';
import ClockView from './view/clock/clock-view';
import Player from './view/player/player-view';
import Todo from './view/todo/todo-view';
import Weather from './view/weather/weather-view';
import Wrapper from './view/wrapper/wrapper-view';
import Settings from './view/settings/settings-view';

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
    const weather = new Weather();
    const settings = new Settings();

    document.body.append(wrapper.getElement());
    wrapper.addInnerElement(clock, player, todo, weather, settings);
  }
}
