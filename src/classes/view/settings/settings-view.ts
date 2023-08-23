import './settings.scss';
import NewNodeParams from 'classes/util/interfaces/NewNodeParams';
import InputNodeCreator from '../../util/input-creator';
import NodeCreator from '../../util/node-creator';
import View from '../view';
import EventEmitter from '../emitter/event-emitter';

export default class Settings extends View {
  private emitter: EventEmitter;

  private CreatedSettingsNode: NodeCreator;

  private isSettingsNodeOpened: boolean = false;

  constructor() {
    const params: NewNodeParams = {
      tag: 'section',
      cssClasses: ['settings'],
      callback: () => {},
    };
    super(params);
    this.emitter = EventEmitter.getInstance();
    this.configureView();
  }

  private configureView() {
    const settingsContainer = new NodeCreator({
      tag: 'div',
      cssClasses: ['settings-container'],
    });
    const settingsList = new NodeCreator({
      tag: 'ul',
      cssClasses: ['settings-list'],
    });
    const closeSettings = new NodeCreator({
      tag: 'div',
      cssClasses: ['close'],
      callback: () => {
        settingsContainer.getNode().remove();
        this.isSettingsNodeOpened = false;
      },
    });
    this.createSettingsList(settingsList);
    settingsContainer.addInnerNode(settingsList, closeSettings);
    this.CreatedSettingsNode = settingsContainer;
    const settingsButton = new NodeCreator({
      tag: 'button',
      cssClasses: ['settings-button'],
      textContent: '',
      callback: () => {
        if (this.isSettingsNodeOpened) {
          return;
        }
        this.isSettingsNodeOpened = true;
        this.viewNode.addInnerNode(this.CreatedSettingsNode);
      },
    });

    this.viewNode.addInnerNode(settingsButton);
  }

  private createSettingsList(parent: NodeCreator) {
    const LsState = localStorage.getItem('settings-params');
    let state: Record<string, boolean>;
    if (LsState) {
      state = JSON.parse(LsState) as Record<string, boolean>;
    } else {
      state = {
        player: true,
        time: true,
        date: true,
        todo: true,
        weather: true,
      };
    }

    const settingsListData = ['player', 'time', 'date', 'todo', 'weather'];
    const nodeLIst = settingsListData.reduce((acc: NodeCreator[], item: string) => {
      const listItem = new NodeCreator({
        tag: 'li',
        cssClasses: ['settings-list_item'],
      });
      const text = new NodeCreator({
        tag: 'label',
        cssClasses: ['settings-list_text'],
        textContent: item,
        attribute: `${item}-settings`,
      });
      const checkbox = new InputNodeCreator({
        tag: 'input',
        cssClasses: ['settings-list_checkbox'],
        type: 'checkbox',
        id: `${item}-settings`,
        callback: () => {
          state[item as keyof typeof state] = !state[item as keyof typeof state];
          this.emitter.dispatch(`switch-${item}-visibility`, state[item as keyof typeof state]);
        },
      });
      if (!state[item as keyof typeof state]) {
        this.emitter.dispatch(`switch-${item}-visibility`, state[item as keyof typeof state]);
      }
      checkbox.getNode().checked = state[item as keyof typeof state];
      listItem.addInnerNode(text, checkbox);
      acc.push(listItem);
      return acc;
    }, [] as NodeCreator[]);
    parent.addInnerNode(...nodeLIst);

    window.addEventListener('beforeunload', () => {
      localStorage.setItem('settings-params', JSON.stringify(state));
    });
  }
}
