import './player.scss';
import INewNode from 'classes/util/interfaces/INewNode';
import IStation from 'classes/util/interfaces/IStation';
import IStationList from 'classes/util/interfaces/IStationList';
import NodeCreator from '../../util/node-creator';
import View from '../view';
import EventEmitter from '../emitter/event-emitter';

const music = require('./music.json');

export default class Player extends View {
  private song: HTMLAudioElement;

  private isPlaying: Boolean;

  private emitter: EventEmitter;

  private playListNode: null | HTMLElement;

  private songId: number;

  constructor() {
    const params: INewNode = {
      tag: 'section',
      cssClasses: ['player'],
      textContent: null,
      callback: null,
    };
    super(params);
    this.configureView();
    this.songId = 0;
    this.song = new Audio();
    this.song.src = music.stations[this.songId].stream_320;
    this.isPlaying = false;
    this.emitter = EventEmitter.getInstance();
    this.playListNode = null;
  }

  private configureView() {
    [
      {
        tag: 'button',
        cssClasses: ['prev-song'],
        textContent: 'prev',
        callback: this.switchSong.bind(this, -1),
      },
      {
        tag: 'button',
        cssClasses: ['play'],
        textContent: 'play',
        callback: this.playOrPause.bind(this),
      },
      {
        tag: 'button',
        cssClasses: ['next-song'],
        textContent: 'next',
        callback: this.switchSong.bind(this, 1),
      },
      {
        tag: 'button',
        cssClasses: ['player-list'],
        textContent: 'list',
        callback: this.generatePlaylistNode.bind(this),
      },
    ].forEach((node) => {
      this.viewNode.addInnerNode(new NodeCreator(node));
    });
  }

  private async generatePlaylistNode() {
    if (this.playListNode) {
      this.viewNode.addInnerNode(this.playListNode);
      return;
    }
    const cross: INewNode = {
      tag: 'div',
      textContent: null,
      cssClasses: ['close'],
      callback: () => this.emitter.dispatch('closePlayer'),
    };
    const parent: INewNode = {
      tag: 'div',
      cssClasses: ['playlist'],
      textContent: null,
      callback: this.emitter.subscribe('closePlayer', () => this.playListNode?.remove()),
    };
    const playlistTitle: INewNode = {
      tag: 'h2',
      textContent: 'Radio Record',
      cssClasses: ['playlist__title'],
      callback: null,
    };
    const list: INewNode = {
      tag: 'ul',
      cssClasses: ['playlist__list'],
      textContent: null,
      callback: null,
    };
    const parentNode = new NodeCreator(parent);
    const nodeList = new NodeCreator(list);
    const title = new NodeCreator(playlistTitle);
    const closeBtn = new NodeCreator(cross);
    this.appendNodesArray([title, closeBtn, nodeList], parentNode);
    this.generatePlaylist(nodeList, music);
    this.playListNode = parentNode.getNode();
  }

  private generatePlaylist(parentList: NodeCreator, array: IStationList) {
    array.stations.forEach((station: IStation, index: number) => {
      parentList.addInnerNode(this.generatePlaylistItem(station, index));
    });
  }

  private generatePlaylistItem(station: IStation, index: number): NodeCreator {
    const container: INewNode = {
      tag: 'li',
      cssClasses: ['playlist-item'],
      textContent: null,
      callback: () => {
        if (this.songId === index) {
          if (this.isPlaying) {
            this.pauseSong();
          } else {
            this.playSong();
          }
          return;
        }
        this.songId = index;
        this.playSong();
        this.emitter.dispatch('song', `${this.songId}`);
      },
    };
    const title: INewNode = {
      tag: 'p',
      cssClasses: ['playlist-item__title'],
      textContent: `${station.title}`,
      callback: null,
    };
    const result = new NodeCreator(container);
    result.getNode().style.backgroundImage = `url(${station.icon_gray})`;
    result.addInnerNode(new NodeCreator(title));
    this.emitter.subscribe('song', (name) => {
      if (name === `${index}`) {
        result.setClassNames(['playlist-item', 'playing']);
        return;
      }
      result.setClassNames(['playlist-item']);
    });
    return result;
  }

  private playSong() {
    this.song.src = music.stations[this.songId].stream_320;
    this.song.pause();
    this.song.play();
    this.isPlaying = true;
    this.emitter.dispatch('song', `${this.songId}`);
  }

  private pauseSong() {
    this.song.pause();
    this.isPlaying = false;
    this.emitter.dispatch('song', `${999}`);
  }

  private playOrPause() {
    this.song.src = music.stations[this.songId].stream_320;
    if (this.isPlaying) {
      this.pauseSong();
    } else {
      this.playSong();
    }
  }

  private switchSong(num: number) {
    const arrayLength = music.stations.length - 1;
    const index = this.songId + num;
    if (index > arrayLength) {
      this.songId = 0;
    } else if (index < 0) {
      this.songId = arrayLength;
    } else {
      this.songId = index;
    }
    this.playSong();
    this.emitter.dispatch('song', `${this.songId}`);
  }
}
