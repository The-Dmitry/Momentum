import './todo.scss';
import NewNodeParams from 'classes/util/interfaces/NewNodeParams';
import { TodoInfoForLS } from '../../util/types/TodoInfoForLS';
import InputNodeCreator from '../../util/input-creator';
import NodeCreator from '../../util/node-creator';
import View from '../view';
import EventEmitter from '../emitter/event-emitter';
import TodoViewItem from './todo-view-item';

export default class Todo extends View {
  private emitter: EventEmitter;

  private listNode: NodeCreator;

  private todoList: TodoViewItem[] = [];

  private todoContainer: null | NodeCreator = null;

  private isTodoOpened: boolean = false;

  private emptyState: HTMLElement;

  private callbackForUpdate: ((x: TodoViewItem) => boolean) | null;

  constructor() {
    const params: NewNodeParams = {
      tag: 'section',
      cssClasses: ['todo-container'],
      callback: (e) => {
        const { target } = e;
        if (!(target instanceof HTMLElement)) return;
        if (!(target.matches('.todo-options') || target.matches('.todo-item__button'))) {
          this.emitter.dispatch('close-todo-options');
        }
      },
    };
    super(params);
    this.emitter = EventEmitter.getInstance();
    this.configureView();
    this.emitter.subscribe('update-todo', () => this.updateTodoList());
  }

  private configureView() {
    const todoMainButton = new NodeCreator({
      tag: 'button',
      cssClasses: ['todo-main-button'],
      textContent: 'ToDo',
      callback: () => this.generateToDoNode(),
    });
    this.getTodoListFromLS();
    this.emitter.subscribe('update-todo-button', () => {
      todoMainButton.setAttribute(`${this.updateToDoCountForButton()}`, 'todo-count');
    });
    this.emitter.dispatch('update-todo-button');
    this.appendNodesArray([todoMainButton]);
  }

  private generateToDoNode() {
    if (this.todoContainer) {
      this.appendNodesArray([this.todoContainer]);
      return;
    }
    const todo = new NodeCreator({
      tag: 'div',
      cssClasses: ['todo'],
    });
    const closeToDo = new NodeCreator({
      tag: 'div',
      cssClasses: ['close'],
      callback: () => todo.getNode().remove(),
    });
    const mainInput = new InputNodeCreator({
      tag: 'input',
      type: 'text',
      cssClasses: ['todo__main-input'],
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
      attribute: 'all',
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
      attribute: 'pending',
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
      attribute: 'completed',
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
      this.callbackForUpdate = null;
      this.updateTodoList();
      this.emitter.dispatch('update-todo-button');
    }, 'keypress');
    buttonContainer.addInnerNode(
      buttonAll,
      buttonAllLabel,
      buttonPending,
      buttonPendingLabel,
      buttonCompleted,
      buttonCompletedLabel
    );
    todo.addInnerNode(mainInput, buttonContainer, todoList, closeToDo);
    this.todoContainer = todo;
    this.updateTodoList();
    this.isTodoOpened = true;
    this.appendNodesArray([todo]);
  }

  private updateTodoList() {
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
    window.addEventListener('beforeunload', () => {
      this.saveTodoListToLS();
    });
  }

  private updateToDoCountForButton() {
    const count = this.todoList.filter((item) => !item.isPending()).length;
    return count === 0 ? ' ' : ` ${count}`;
  }

  private showEmptyList() {
    const emptyNotification = new NodeCreator({
      tag: 'li',
      cssClasses: ['todo-item', 'todo-item_empty'],
      textContent: 'List is empty',
    });
    this.emptyState = emptyNotification.getNode();
    this.listNode.addInnerNode(emptyNotification);
  }
}
