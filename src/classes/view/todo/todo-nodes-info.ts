const todoNodesInfo = {
  todoMainButton: {
    tag: 'button',
    type: 'text',
    cssClasses: ['todo__main-button'],
    textContent: 'ToDo',
  },
  mainInput: {
    tag: 'input',
    type: 'text',
    cssClasses: ['todo__main-input'],
    placeholder: '...Type something',
  },
  buttonContainer: {
    tag: 'div',
    cssClasses: ['todo__nav'],
  },
  buttonAll: {
    tag: 'input',
    type: 'radio',
    name: 'todo_nav',
    cssClasses: ['todo__button', 'todo__button_all'],
    id: 'all',
  },
  buttonAllLabel: {
    tag: 'label',
    cssClasses: ['todo__label', 'todo__label_all'],
    textContent: 'all',
    for: 'all',
  },
  buttonPending: {
    tag: 'input',
    type: 'radio',
    name: 'todo_nav',
    cssClasses: ['todo__button', 'todo__button_pending'],
    id: 'pending',
  },
  buttonPendingLabel: {
    tag: 'label',
    cssClasses: ['todo__label', 'todo__label_pending'],
    textContent: 'pending',
    for: 'pending',
  },
  buttonCompleted: {
    tag: 'input',
    type: 'radio',
    name: 'todo_nav',
    cssClasses: ['todo__button', 'todo__button_completed'],
    id: 'completed',
  },
  buttonCompletedLabel: {
    tag: 'label',
    cssClasses: ['todo__label', 'todo__label_completed'],
    textContent: 'completed',
    for: 'completed',
  },
  todoList: {
    tag: 'ul',
    cssClasses: ['todo__list'],
  },
};

export default todoNodesInfo;
