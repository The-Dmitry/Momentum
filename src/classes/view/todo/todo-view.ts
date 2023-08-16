/* eslint-disable @typescript-eslint/comma-dangle */
import './todo.scss';
import INewNode from 'classes/util/interfaces/NewNodeParams';
import { TodoInfoForLS } from '../../util/types/TodoInfoForLS';
import InputNodeCreator from '../../util/input-creator';
import NodeCreator from '../../util/node-creator';
import View from '../view';
import EventEmitter from '../emitter/event-emitter';
// import todoNodesInfo from './todo-nodes-info';
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
    const mainInput = new InputNodeCreator({
      tag: 'input',
      type: 'text',
      cssClasses: ['todo__main-button'],
      placeholder: 'Type something...',
    });
    const buttonContainer = new NodeCreator({
      tag: 'div',
      cssClasses: ['todo__nav'],
    });
    const buttonAll = new InputNodeCreator({
      tag: 'input',
      type: 'radio',
      name: 'todo_nav',
      cssClasses: ['todo__button', 'todo__button_all'],
      id: 'all',
    });
    buttonAll.getNode().checked = true;
    buttonAll.setCallback(() => {
      this.callbackForUpdate = null;
      this.updateTodoList();
    });
    const buttonAllLabel = new InputNodeCreator({
      tag: 'label',
      cssClasses: ['todo__label', 'todo__label_all'],
      textContent: 'all',
      for: 'all',
    });
    const buttonPending = new InputNodeCreator({
      tag: 'input',
      type: 'radio',
      name: 'todo_nav',
      cssClasses: ['todo__button', 'todo__button_pending'],
      id: 'pending',
    });
    buttonPending.setCallback(() => {
      this.callbackForUpdate = (x) => !x.isPending();
      this.updateTodoList();
    });
    const buttonPendingLabel = new InputNodeCreator({
      tag: 'label',
      cssClasses: ['todo__label', 'todo__label_pending'],
      textContent: 'pending',
      for: 'pending',
    });
    const buttonCompleted = new InputNodeCreator({
      tag: 'input',
      type: 'radio',
      name: 'todo_nav',
      cssClasses: ['todo__button', 'todo__button_completed'],
      id: 'completed',
    });
    buttonCompleted.setCallback(() => {
      this.callbackForUpdate = (x) => x.isPending();
      this.updateTodoList();
    });
    const buttonCompletedLabel = new InputNodeCreator({
      tag: 'label',
      cssClasses: ['todo__label', 'todo__label_completed'],
      textContent: 'completed',
      for: 'completed',
    });
    const todoList = new NodeCreator({
      tag: 'ul',
      cssClasses: ['todo__list'],
    });
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
