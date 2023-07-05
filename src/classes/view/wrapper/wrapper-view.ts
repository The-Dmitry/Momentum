import './wrapper.scss';
import INewNode from 'classes/util/interfaces/INewNode';
import NodeCreator from '../../util/node-creator';
import View from '../view';

export default class Wrapper extends View {
  private bgNumber: number;

  private dayPart: string;

  constructor() {
    const params: INewNode = {
      tag: 'section',
      cssClasses: ['wrapper'],
      textContent: null,
      callback: null,
    };
    super(params);
    this.bgNumber = 1;
    this.dayPart = 'night';
    this.configureView();
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
    this.validateBgNumber();
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/The-Dmitry/ForMomentum/main/${
      this.dayPart
    }/${`${this.bgNumber}`.padStart(2, '0')}.jpg`;
    img.onload = () => {
      this.getElement().style.backgroundImage = `url(https://raw.githubusercontent.com/The-Dmitry/ForMomentum/main/${
        this.dayPart
      }/${`${this.bgNumber}`.padStart(2, '0')}.jpg)`;
    };
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
