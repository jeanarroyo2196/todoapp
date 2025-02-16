import html from './app.html?raw';
import todoStore, { Filters } from '../store/todo.store';
import { renderTodos, renderPending } from './use-cases';

const ElementId = {
  ClearCompleted: '.clear-completed',
  NewTodoInput: '#new-todo-input',
  PendingCountLabel: '#pending-count',
  TodoFilters: '.filtro',
  TodoList: '.todo-list',
};

export const App = (elementId) => {
  const displayTodos = () => {
    const todos = todoStore.getTodos(todoStore.getCurrentFilter());
    renderTodos(ElementId.TodoList, todos);
    updatePendingCount();
  };

  const updatePendingCount = () => {
    renderPending(ElementId.PendingCountLabel);
  }

  // when the app() function is called
  (() => {
    const app = document.createElement('div');
    app.innerHTML = html;
    document.querySelector(elementId).append(app);
    displayTodos();
  })();

  // HTML references
  const clearCompletedButton = document.querySelector(ElementId.ClearCompleted);
  const newDescriptionInput = document.querySelector(ElementId.NewTodoInput);
  const todoListUL = document.querySelector(ElementId.TodoList);
  const filterUL = document.querySelectorAll(ElementId.TodoFilters);

  // listeners

  // add a todo into list
  newDescriptionInput.addEventListener('keyup', (event) => {
    if (event.keyCode !== 13) {
      return;
    }

    if (event.target.value.trim().length === 0) {
      return;
    }

    todoStore.addTodo(event.target.value);
    displayTodos();
    event.target.value = '';
  });

  // mark todo as completed
  todoListUL.addEventListener('click', (event) => {
    const element = event.target.closest('[data-id]');
    todoStore.toggleTodo(element.getAttribute('data-id'));
    displayTodos();
  });

  // to delete a todo
  todoListUL.addEventListener('click', (event) => {
    const isDestroy = event.target.className === 'destroy';
    const element = event.target.closest('[data-id]');

    if (!element || !isDestroy) {
      return;
    }

    todoStore.deleteTodo(element.getAttribute('data-id'));
    displayTodos();
  });

  // to delete completed todos
  clearCompletedButton.addEventListener('click', () => {
    todoStore.deleteCompleted();
    displayTodos();
  });

  // for filters
    filterUL.forEach((element) => {
      element.addEventListener('click', (element) => {
        filterUL.forEach((elem) => {
          elem.classList.remove('selected');
        });
        element.target.classList.add('selected');

        switch (element.target.text) {
          case 'Todos':
            todoStore.setFilter(Filters.All);
          break;

          case 'Pendientes':
            todoStore.setFilter(Filters.Pending);
          break;

          case 'Completados':
            todoStore.setFilter(Filters.Completed);
          break;
        }

        displayTodos();
      });
    });
};
