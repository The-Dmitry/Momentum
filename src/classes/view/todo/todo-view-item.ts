import INewNode from 'classes/util/interfaces/INewNode';
import ITodoItem from 'classes/util/interfaces/ITodoItem';
import InputNodeCreator from '../../util/input-creator';
import NodeCreator from '../../util/node-creator';
import View from '../view';

export default class TodoViewItem extends View {
  private text: string;

  private isCompleted: boolean;

  constructor(todo: ITodoItem) {
    const params: INewNode = {
      tag: 'li',
      cssClasses: todo.isCompleted ? ['todo-item_completed'] : ['todo-item'],
      textContent: null,
      callback: null,
    };
    super(params);
    this.text = todo.text;
    this.isCompleted = todo.isCompleted;
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
    this.viewNode.addInnerNode(checkbox, item);
  }
}
