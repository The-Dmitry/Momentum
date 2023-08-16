import './player.scss';
import INewNode from 'classes/util/interfaces/NewNodeParams';
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

  private isListOpened: boolean = false;

  constructor() {
    const params: INewNode = {
      tag: 'section',
      cssClasses: ['player'],
      callback: null,
    };
    super(params);
    this.emitter = EventEmitter.getInstance();
    this.configureView();
    this.songId = 0;
    this.song = new Audio();
    this.song.src = music.stations[this.songId].stream_320;
    this.isPlaying = false;
    this.playListNode = null;
  }

  private configureView() {
    const prev = new NodeCreator({
      tag: 'button',
      cssClasses: ['prev-song'],
      textContent: 'prev',
      callback: this.switchSong.bind(this, -1),
    });
    const play = new NodeCreator({
      tag: 'button',
      cssClasses: ['play'],
      textContent: 'play',
      callback: this.playOrPause.bind(this),
    });
    const next = new NodeCreator({
      tag: 'button',
      cssClasses: ['next-song'],
      textContent: 'next',
      callback: this.switchSong.bind(this, 1),
    });
    const list = new NodeCreator({
      tag: 'button',
      cssClasses: ['player-list'],
      textContent: 'list',
      callback: this.generatePlaylistNode.bind(this),
    });
    this.appendNodesArray([prev, next, play, list]);
    this.emitter.subscribe('song-name', (songName) => {
      const songNameArea = new NodeCreator({
        tag: 'div',
        cssClasses: ['song-name'],
        textContent: songName || '',
        callback: null,
      });
      this.appendNodesArray([songNameArea]);
      this.emitter.subscribe('delete-song-name', () => {
        songNameArea.getNode().remove();
      });
    });
    this.emitter.subscribe('is-play', (str) => {
      if (str) {
        play.getNode().classList.add('active');
        return;
      }
      play.getNode().classList.remove('active');
    });
  }

  private async generatePlaylistNode() {
    if (this.playListNode) {
      if (this.isListOpened) return;
      this.viewNode.addInnerNode(this.playListNode);
      this.isListOpened = true;
      return;
    }
    const cross: INewNode = {
      tag: 'div',
      cssClasses: ['close'],
      callback: () => {
        this.emitter.dispatch('closePlayer');
        this.isListOpened = false;
      },
    };
    const parent: INewNode = {
      tag: 'div',
      cssClasses: ['playlist'],
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
      callback: null,
    };
    this.isListOpened = true;
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
    let css = [];
    if (this.isPlaying) {
      css = this.songId === index ? ['playlist-item', 'playing'] : ['playlist-item'];
    } else {
      css = ['playlist-item'];
    }
    const container: INewNode = {
      tag: 'li',
      cssClasses: css,
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
    this.emitter.dispatch('delete-song-name');
    this.emitter.dispatch('song', `${this.songId}`);
    this.emitter.dispatch('song-name', `${music.stations[this.songId].title} - ${music.stations[this.songId].tooltip}`);
    this.emitter.dispatch('is-play', '123');
  }

  private pauseSong() {
    this.song.pause();
    this.isPlaying = false;
    this.emitter.dispatch('delete-song-name');
    this.emitter.dispatch('song', `${999}`);
    this.emitter.dispatch('is-play', '');
  }

  private playOrPause() {
    this.emitter.dispatch('song-name', '');
    if (this.isPlaying) {
      this.pauseSong();
    } else {
      this.song.src = music.stations[this.songId].stream_320;
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
