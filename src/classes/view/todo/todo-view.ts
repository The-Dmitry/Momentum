/* eslint-disable @typescript-eslint/comma-dangle */
import './todo.scss';
import INewNode from 'classes/util/interfaces/INewNode';
import { TodoInfoForLS } from '../../util/types/TodoInfoForLS';
import InputNodeCreator from '../../util/input-creator';
import NodeCreator from '../../util/node-creator';
import View from '../view';
import EventEmitter from '../emitter/event-emitter';
import todoNodesInfo from './todo-nodes-info';
import TodoViewItem from './todo-view-item';

export default class Todo extends View {
  private emitter: EventEmitter;

  private listNode: NodeCreator;

  private todoList: TodoViewItem[] = [];

  private emptyState: HTMLElement;

  private callbackForUpdate: ((x: TodoViewItem) => boolean) | null;

  constructor() {
    const params: INewNode = {
      tag: 'div',
      cssClasses: ['todo'],
      textContent: null,
      callback: null,
    };
    super(params);
    this.emitter = EventEmitter.getInstance();
    this.configureView();
    window.addEventListener('beforeunload', () => {
      this.saveTodoListToLS();
    });
    window.addEventListener('load', () => {
      this.getTodoListFromLS();
    });
    this.viewNode.setCallback((e) => {
      const event = e.target as HTMLElement;
      if (!(event.matches('.todo-options') || event.matches('.todo-item__button'))) {
        this.emitter.dispatch('close-todo-options');
      }
    });
    this.emitter.subscribe('update-todo', () => this.updateTodoList());
  }

  private configureView() {
    // const todoMainButton = new NodeCreator(todoNodesInfo.todoMainButton);
    const mainInput = new InputNodeCreator(todoNodesInfo.mainInput);
    const buttonContainer = new NodeCreator(todoNodesInfo.buttonContainer);
    const buttonAll = new InputNodeCreator(todoNodesInfo.buttonAll);
    buttonAll.getNode().checked = true;
    buttonAll.setCallback(() => {
      this.callbackForUpdate = null;
      this.updateTodoList();
    });
    const buttonAllLabel = new NodeCreator(todoNodesInfo.buttonAllLabel);
    const buttonPending = new InputNodeCreator(todoNodesInfo.buttonPending);
    buttonPending.setCallback(() => {
      this.callbackForUpdate = (x) => !x.isPending();
      this.updateTodoList();
    });
    const buttonPendingLabel = new NodeCreator(todoNodesInfo.buttonPendingLabel);
    const buttonCompleted = new InputNodeCreator(todoNodesInfo.buttonCompleted);
    buttonCompleted.setCallback(() => {
      this.callbackForUpdate = (x) => x.isPending();
      this.updateTodoList();
    });
    const buttonCompletedLabel = new NodeCreator(todoNodesInfo.buttonCompletedLabel);
    const todoList = new NodeCreator(todoNodesInfo.todoList);
    this.listNode = todoList;
    mainInput.setCallback((e) => {
      const { code } = e as KeyboardEvent;
      if (!(code === 'Enter')) {
        return;
      }
      if (this.emptyState) {
        this.emptyState.remove();
      }
      const inputValue = mainInput.getNode().value;
      if (inputValue.length) {
        this.createTodoItem({
          text: inputValue,
          isCompleted: false,
        });
        mainInput.getNode().value = '';
      }
      buttonPending.getNode().checked = false;
      buttonCompleted.getNode().checked = false;
      buttonAll.getNode().checked = true;
      this.updateTodoList();
    }, 'keypress');
    buttonContainer.addInnerNode(
      buttonAll,
      buttonAllLabel,
      buttonPending,
      buttonPendingLabel,
      buttonCompleted,
      buttonCompletedLabel
    );
    // todoMainButton
    this.appendNodesArray([mainInput, buttonContainer, todoList]);
  }

  private updateTodoList() {
    this.emitter.dispatch('close-todo-input');
    this.listNode.removeAllChildren();
    this.todoList = this.todoList.filter((item) => item.isDeleted());
    const result = [];
    if (!this.callbackForUpdate) {
      result.push(...this.todoList.map((item) => item.getElement()));
    } else {
      result.push(...this.todoList.filter(this.callbackForUpdate).map((item) => item.getElement()));
    }
    if (result.length) {
      this.listNode.addInnerNode(...result);
    } else {
      this.showEmptyList();
    }
  }

  private createTodoItem(params: TodoInfoForLS) {
    const result = new TodoViewItem({
      text: params.text,
      isCompleted: params.isCompleted,
    });
    this.todoList.unshift(result);
  }

  private saveTodoListToLS() {
    if (!this.todoList.length) {
      localStorage.removeItem('todoList');
      return;
    }
    const result: TodoInfoForLS[] = [];
    this.todoList.filter((el) => el.isDeleted()).forEach((item) => result.push(item.todoInfo));
    localStorage.setItem('todoList', JSON.stringify(result));
  }

  private getTodoListFromLS() {
    const list = localStorage.getItem('todoList');
    if (list) {
      this.todoList = JSON.parse(list).map((el: TodoInfoForLS) => new TodoViewItem(el));
    }
    this.updateTodoList();
  }

  private showEmptyList() {
    const emptyNotification = new NodeCreator({
      tag: 'li',
      cssClasses: ['todo-item', 'todo-item_empty'],
      callback: null,
      textContent: 'List is empty',
    });
    this.emptyState = emptyNotification.getNode();
    this.listNode.addInnerNode(emptyNotification);
  }
}
