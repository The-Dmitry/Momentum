import './wrapper.scss';
import INewNode from 'classes/util/interfaces/NewNodeParams';
import NodeCreator from '../../util/node-creator';
import View from '../view';
import EventEmitter from '../emitter/event-emitter';
import ClockView from '../clock/clock-view';

export default class Wrapper extends View {
  private bgNumber: number;

  private dayPart: string;

  private emitter: EventEmitter;

  private isAllowedToSwitchBg: boolean = true;

  constructor() {
    const params: INewNode = {
      tag: 'div',
      cssClasses: ['wrapper'],
      callback: null,
    };
    super(params);
    this.bgNumber = 1;
    this.dayPart = ClockView.getPartOfDay();
    this.emitter = EventEmitter.getInstance();
    this.configureView();
    this.emitter.subscribe('part-of-day', () => {
      this.updateBackground();
    });
  }

  private configureView() {
    const prevParams: INewNode = {
      tag: 'button',
      cssClasses: ['prev-img'],
      textContent: 'prev',
      callback: this.prevImage.bind(this),
    };
    const prev = new NodeCreator(prevParams);

    const nextParams: INewNode = {
      tag: 'button',
      cssClasses: ['next-img'],
      textContent: 'next',
      callback: this.nextImage.bind(this),
    };
    const next = new NodeCreator(nextParams);
    this.viewNode.addInnerNode(prev);
    this.viewNode.addInnerNode(next);
    this.setBackground();
  }

  private setBackground() {
    if (this.isAllowedToSwitchBg) {
      this.isAllowedToSwitchBg = false;
      this.validateBgNumber();
      const img = new Image();
      const url = `https://raw.githubusercontent.com/The-Dmitry/ForMomentum/main/${
        this.dayPart
      }/${`${this.bgNumber}`.padStart(2, '0')}.jpg`;
      img.src = url;
      img.onload = () => {
        this.getElement().style.backgroundImage = `url(${url})`;
        setTimeout(() => {
          this.isAllowedToSwitchBg = true;
        }, 1500);
      };
      setTimeout(() => {
        this.nextImage();
      }, 180000);
    }
  }

  private updateBackground() {
    this.dayPart = ClockView.getPartOfDay();
    this.setBackground();
  }

  private nextImage() {
    this.bgNumber += 1;
    this.setBackground();
  }

  private prevImage() {
    this.bgNumber -= 1;
    this.setBackground();
  }

  private validateBgNumber() {
    if (this.bgNumber < 1) {
      this.bgNumber = 20;
      return;
    }
    if (this.bgNumber > 20) {
      this.bgNumber = 1;
    }
  }
}
