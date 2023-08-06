/* eslint-disable @typescript-eslint/comma-dangle */
import './todo.scss';
import INewNode from 'classes/util/interfaces/INewNode';
import InputNodeCreator from '../../util/input-creator';
import NodeCreator from '../../util/node-creator';
import View from '../view';
import EventEmitter from '../emitter/event-emitter';
import todoNodesInfo from './todo-nodes-info';
import TodoViewItem from './todo-view-item';

export default class Todo extends View {
  private emitter: EventEmitter;

  private kek: TodoViewItem[] = [];

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
  }

  private configureView() {
    const mainInput = new InputNodeCreator(todoNodesInfo.mainInput);
    const buttonContainer = new NodeCreator(todoNodesInfo.buttonContainer);
    const buttonAll = new InputNodeCreator(todoNodesInfo.buttonAll);
    const buttonAllLabel = new NodeCreator(todoNodesInfo.buttonAllLabel);
    const buttonPending = new InputNodeCreator(todoNodesInfo.buttonPending);
    const buttonPendingLabel = new NodeCreator(todoNodesInfo.buttonPendingLabel);
    const buttonCompleted = new InputNodeCreator(todoNodesInfo.buttonCompleted);
    const buttonCompletedLabel = new NodeCreator(todoNodesInfo.buttonCompletedLabel);
    const todoList = new NodeCreator(todoNodesInfo.todoList);
    mainInput.setCallback((e) => {
      const { code } = e as KeyboardEvent;
      if (!(code === 'Enter')) {
        return;
      }
      const inputValue = mainInput.getNode().value;
      if (inputValue.length) {
        const todoItem = new TodoViewItem({
          text: inputValue,
          isCompleted: false,
        });
        this.kek.push(todoItem);
        todoList.addInnerNode(todoItem.getElement());
      }
    }, 'keypress');
    buttonContainer.addInnerNode(
      buttonAll,
      buttonAllLabel,
      buttonPending,
      buttonPendingLabel,
      buttonCompleted,
      buttonCompletedLabel
    );
    this.appendNodesArray([mainInput, buttonContainer, todoList]);
  }
}
