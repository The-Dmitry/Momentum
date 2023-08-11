import INewNode from 'classes/util/interfaces/INewNode';
import ITodoItem from 'classes/util/interfaces/ITodoItem';
import { TodoInfoForLS } from '../../util/types/TodoInfoForLS';
import InputNodeCreator from '../../util/input-creator';
import NodeCreator from '../../util/node-creator';
import View from '../view';
import EventEmitter from '../emitter/event-emitter';

export default class TodoViewItem extends View {
  private text: string;

  private isCompleted: boolean;

  private emitter: EventEmitter;

  constructor(todo: ITodoItem) {
    const params: INewNode = {
      tag: 'li',
      cssClasses: todo.isCompleted ? ['todo-item', 'todo-item_completed'] : ['todo-item'],
      textContent: null,
      callback: null,
    };
    super(params);
    this.text = todo.text;
    this.isCompleted = todo.isCompleted;
    this.emitter = EventEmitter.getInstance();
    this.configureView();
  }

  private configureView() {
    const checkbox = new InputNodeCreator({
      tag: 'input',
      type: 'checkbox',
      cssClasses: ['todo-item__checkbox'],
      textContent: this.text,
      callback: () => {
        if (checkbox.getNode().checked) {
          this.isCompleted = true;
          this.viewNode.setClassNames(['todo-item', 'todo-item_completed']);
        } else {
          this.isCompleted = false;
          this.viewNode.setClassNames(['todo-item']);
        }
        this.emitter.dispatch('update-todo');
      },
    });
    if (this.isCompleted) {
      checkbox.getNode().checked = true;
    }

    const item = new NodeCreator({
      tag: 'p',
      cssClasses: ['todo-item__text'],
      textContent: this.text,
      callback: null,
    });

    const optionContainer = new NodeCreator({
      tag: 'ul',
      cssClasses: ['todo-options'],
      textContent: null,
      callback: null,
    });

    const todoInput = new InputNodeCreator({
      tag: 'input',
      type: 'text',
      textContent: null,
      cssClasses: ['todo-options__input'],
      callback: null,
    });
    todoInput.getNode().value = this.text;

    todoInput.setCallback((e) => {
      const event = e as KeyboardEvent;
      if (event.code === 'Enter') {
        this.text = todoInput.getNode().value;
        item.setTextContent(this.text);
        this.viewNode.addInnerNode(item);
        todoInput.getNode().remove();
      }
    }, 'keydown');

    const optionEdit = new NodeCreator({
      tag: 'li',
      cssClasses: ['todo-options__edit'],
      textContent: 'edit',
      callback: () => {
        item.getNode().remove();
        this.viewNode.addInnerNode(todoInput);
        todoInput.getNode().focus();
      },
    });
    const optionDelete = new NodeCreator({
      tag: 'li',
      cssClasses: ['todo-options__delete'],
      textContent: 'delete',
      callback: () => {
        this.deleteTodo();
      },
    });
    this.emitter.subscribe('close-todo-options', () => {
      optionContainer.getNode().remove();
    });
    this.emitter.subscribe('close-todo-input', () => {
      todoInput.getNode().remove();
      this.viewNode.addInnerNode(item);
    });
    optionContainer.addInnerNode(optionEdit, optionDelete);

    const optionBtn = new NodeCreator({
      tag: 'div',
      cssClasses: ['todo-item__button'],
      textContent: '...',
      callback: () => {
        this.emitter.dispatch('close-todo-options');
        optionBtn.addInnerNode(optionContainer);
      },
    });

    this.viewNode.addInnerNode(checkbox, item, optionBtn);
  }

  private deleteTodo() {
    this.text = '';
    this.emitter.dispatch('update-todo');
  }

  public get todoInfo(): TodoInfoForLS {
    return {
      text: this.text,
      isCompleted: this.isCompleted,
    };
  }

  public isPending() {
    return this.isCompleted;
  }

  public isDeleted() {
    return this.text;
  }
}
