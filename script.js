// Model
/* If localStorage has a todos array, then use it 
otherwise use the default array.*/
let todos;

// Retrieve localStorage
const savedTodos = JSON.parse(localStorage.getItem('todos'));
// Check if it's an array
if(Array.isArray(savedTodos)) {
  todos = savedTodos;
} else {
  todos = [{
    title: 'Get groceries',
    dueDate: '2023-3-25',
    id: 'id1'
  }, {
    title: 'Wash car',
    dueDate: '2023-3-21',
    id: 'id2'
  }, {
    title: 'Make dinner',
    dueDate: '2023-3-23',
    id: 'id3'
  }];
}
// Creates a todo
const createTodo = (title, dueDate) => {
  const id = '' +  new Date().getTime();
  
  todos.push({
    title: title,
    dueDate: dueDate,
    id: id
  });

  saveTodos();
}
// Deletes a todo
const removeTodo = idToDelete => {
  todos = todos.filter(todo => {
    /* If the id of this todo matches idToDelete, return false
    for everything else, return true. */
    if (todo.id === idToDelete) {
      return false;
    } else {
      return true;
    }
  });
  saveTodos();
}

// Edits a todo
const setEditing = todoId => {
  todos.forEach(todo => {
    if (todo.id === todoId) {
      todo.isEditing = true;
    }
  });
  saveTodos();
}

// Updates a todo
const updateTodo = (todoId, newTitle, newDate) => {
  todos.forEach(todo => {
    if (todo.id === todoId) {
      todo.title = newTitle;
      todo.dueDate = newDate;
      todo.isEditing = false;
    }
  });
  saveTodos();
}

const saveTodos = () => {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Controller
const addTodo = () => {
  const textbox = document.getElementById('todo-title');
  const title = textbox.value;

  const datePicker = document.getElementById('date-picker');
  const dueDate = datePicker.value;
  
  createTodo(title, dueDate);
  render();
}

const onDelete = todoToDelete => {
  return () => {
    removeTodo(todoToDelete.id);
    render();
  };
};

const onEdit = (event) => {
  const editButton = event.target;
  const todoId = editButton.dataset.todoId;

  setEditing(todoId);
  render();
}

const onUpdate = (event) => {
  const updateButton = event.target;
  const todoId = updateButton.dataset.todoId;

  const textbox = document.getElementById('edit-title-' + todoId);
  const newTitle = textbox.value;

  const datePicker = document.getElementById('edit-date-' + todoId);
  const newDate = datePicker.value;

  updateTodo(todoId, newTitle, newDate);
  render();
}

// View
const render = () => {
  // reset our list
  document.getElementById('todo-list').innerHTML = '';

  todos.forEach(todo => {
    const element = document.createElement('div');

    /* If todo is being edited, render a textbox, date picked
    and a button for saving edits */
    if (todo.isEditing === true) {
      const textbox = document.createElement('input');
      textbox.type = 'text';
      textbox.id = 'edit-title-' + todo.id;
      element.appendChild(textbox);

      const datePicker = document.createElement('input');
      datePicker.type = 'date';
      datePicker.id = 'edit-date-' + todo.id;
      element.appendChild(datePicker);

      const updateButton = document.createElement('button');
      updateButton.innerText = 'Update';
      updateButton.dataset.todoId = todo.id;
      updateButton.onclick = onUpdate;
      element.appendChild(updateButton);
      
      /* If this todo is not being edited, render what we had before
      and add an "Edit" button.*/
    } else {
      element.innerText = todo.title + ' ' + todo.dueDate;

      const editButton = document.createElement('button');
      editButton.innerText = 'Edit';
      editButton.style = 'margin-left: 12 px';
      editButton.onclick = onEdit;
      editButton.dataset.todoId = todo.id;
      element.appendChild(editButton);

      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete';
      deleteButton.style = 'margin-left: 12px';
      deleteButton.onclick = onDelete(todo);
      deleteButton.id = todo.id;
      element.appendChild(deleteButton);
      
    }

    const todoList = document.getElementById('todo-list');
    todoList.appendChild(element);
  });
}
render();
