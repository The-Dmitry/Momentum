import './wrapper.scss';
import INewNode from 'classes/util/interfaces/NewNodeParams';
import NodeCreator from '../../util/node-creator';
import View from '../view';
import EventEmitter from '../emitter/event-emitter';
import ClockView from '../clock/clock-view';

export default class Wrapper extends View {
  private bgNumber: number = 1;

  private dayPart: string;

  private emitter: EventEmitter;

  private isAllowedToSwitchBg: boolean = true;

  private backgroundTag: string;

  private backgroundSource: 'github' | 'unsplash' | 'flickr' = 'github';

  constructor() {
    const params: INewNode = {
      tag: 'div',
      cssClasses: ['wrapper'],
    };
    super(params);
    this.bgNumber = 1;
    this.dayPart = ClockView.getPartOfDay();
    this.emitter = EventEmitter.getInstance();
    if (localStorage.getItem('backgroundTag')) {
      this.backgroundTag = localStorage.getItem('backgroundTag') as string;
    } else {
      this.backgroundTag = ClockView.getPartOfDay();
    }
    this.configureView();
    this.emitter.subscribe('part-of-day', () => {
      this.updateBackground();
    });
    console.log(this.backgroundTag);
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
    this.setBackground(0);
    // this.getUnsplashBg();
  }

  private setBackground(number: number) {
    if (this.backgroundTag === '') {
      this.backgroundTag = ClockView.getPartOfDay();
    }
    if (this.backgroundSource === 'github') {
      this.setGitHubBackground(number);
    }
    if (this.backgroundSource === 'flickr') {
      this.setFlickrBackground(number);
    }
    if (this.backgroundSource === 'unsplash') {
      this.setUnsplashBackground();
    }
  }

  private async setFlickrBackground(number: number) {
    if (this.isAllowedToSwitchBg) {
      this.isAllowedToSwitchBg = false;
      setTimeout(() => {
        this.isAllowedToSwitchBg = true;
      }, 1500);
      this.bgNumber = this.validateBgNumber(this.bgNumber + number, 99);
      const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=2dcf532d206a604fe42259fedbca0044&tags=${this.backgroundTag}&extras=url_k&format=json&nojsoncallback=1`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      const img = new Image();
      img.src = data.photos.photo[this.bgNumber].url_k;
      img.onload = () => {
        this.getElement().style.backgroundImage = `url(${data.photos.photo[this.bgNumber].url_k})`;
      };
    }
  }

  private async setUnsplashBackground() {
    try {
      if (this.isAllowedToSwitchBg) {
        this.isAllowedToSwitchBg = false;
        setTimeout(() => {
          this.isAllowedToSwitchBg = true;
        }, 1500);
        const url = `https://api.unsplash.com/photos/random?query=${this.backgroundTag}&orientation=landscape&client_id=qMcp0gVu5vldpMh0lROfHBxAhXZdMMsQHHY2xHZ7F00`;
        const response = await fetch(url);
        const data = await response.json();
        const img = new Image();
        img.src = data.urls.regular;
        img.onload = () => {
          this.getElement().style.backgroundImage = `url(${data.urls.regular})`;
        };
      }
    } catch (e) {
      this.backgroundSource = 'github';
      this.isAllowedToSwitchBg = true;
      this.setBackground(0);
    }
  }

  private setGitHubBackground(number: number) {
    if (this.isAllowedToSwitchBg) {
      this.isAllowedToSwitchBg = false;
      this.bgNumber = this.validateBgNumber(this.bgNumber + number, 19);
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
    }
  }

  private updateBackground() {
    this.dayPart = ClockView.getPartOfDay();
    this.setBackground(0);
  }

  private nextImage() {
    this.setBackground(+1);
  }

  private prevImage() {
    this.setBackground(-1);
  }

  // eslint-disable-next-line class-methods-use-this
  private validateBgNumber(number: number, max: number) {
    if (number < 1) {
      return max;
    }
    if (number > max) {
      return 1;
    }
    return number;
  }
}
