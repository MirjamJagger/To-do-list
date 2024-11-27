// Selecting DOM elements
const input = document.querySelector('#input-field');
const addBtn = document.querySelector('#addBtn');
const errorMsg = document.querySelector('.error');
const taskList = document.querySelector('#taskList');

// Global variables
let todos = [];
const URL = 'https://js1-todo-api.vercel.app/api/todos?apikey=60cab22a-fafd-4ad7-8289-b20000808625';

// Event listener for adding new to do
addBtn.addEventListener('click', e => {
  e.preventDefault() // Prevent form submission to avoid page reload on click

  // Check if the input is empty, and show an error message if true
  if(input.value.trim() === '') {
    errorMsg.style.display = 'block'; 
  }

  else {
    addToDo() // Proceed to add to do if input is valid
  }
});

// Event listener to hide error message when input is focused
input.addEventListener('focus', () => {
  errorMsg.style.display = 'none';
})

// Fetches all to dos from the API and renders them
const fetchToDos = async ()  => {
  try {
    const resp = await fetch(URL);
    todos = await resp.json();

    todos.forEach(renderToDos); // Render each to do item from the response

  } catch (error) {
    console.error('Error fetching todos:', error);
  }
}

fetchToDos() // Cal the function to fetch and render to dos

// Updates the UI by rendering a single to do item
const renderToDos = async (t) => {
  const taskList = document.querySelector('#taskList');

  const todo = document.createElement('li');
  todo.id = `todo-${t._id}`; // Set unique ID for each to do
  todo.classList.add('todo', 'd-flex', 'align-items-center', 'justify-content-between');

  // Adding the 'checked' class for styling if to do is completed
  if (t.completed) {
    todo.classList.add('checked');
  }
 
  const todoContent = document.createElement('div', 'd-flex');
  todoContent.classList.add('todo-content');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('todo-checkbox');
  checkbox.checked = t.completed;

  const text = document.createElement('p');
  text.innerText = t.title;
  text.classList.add('todo-title'); 

  todoContent.appendChild(checkbox);
  todoContent.appendChild(text);

  const actions = document.createElement('div');
  actions.classList.add('actions', 'd-flex',);

  const deleteBtn = document.createElement('a');
  deleteBtn.href = '#',
  deleteBtn.classList.add('deleteBtn');
  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('fa-regular', 'fa-trash-can')

  deleteBtn.addEventListener('click', () => {
    deleteToDo(t._id); // Trigger deletion when the delete button is clicked
  });
  

  actions.appendChild(deleteBtn);
  todo.appendChild(todoContent);
  todo.appendChild(actions);
  deleteBtn.appendChild(deleteIcon);

  taskList.appendChild(todo); // Append the to do item to the task list
}

// Sends a new task to the API with a POST request and reloads the page, task title is taken from the input field
const addToDo = async () => {
  try {
    const newTask = input.value;

    const resp = await fetch('https://js1-todo-api.vercel.app/api/todos?apikey=60cab22a-fafd-4ad7-8289-b20000808625', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newTask 
      })
    });

    location.reload(); // Reload the page to reflect the new to do item

  } catch (error) {
    console.error('Error posting todo:', error)
  }
}


// Checks if to do is completed before allowing deletion, the modal will show if the to do is not completed
const showModal = (toDoName, modal) => {
  if(!toDoName.classList.contains('checked')) {
    console.log('You have to complete the to do first');
    modal.show();
    return true;
  } else
  return false;
}


// Deletes a to do item from the API with a DELETE request and removes it from the UI, the to do can only be deleted if it is completed
const deleteToDo = async (id) => {

  try {
    const toDoName = document.querySelector(`#todo-${id}`); // Find the to do item by ID
    const modal = new bootstrap.Modal(document.getElementById('myModal'));
  
    if (showModal(toDoName, modal)) return; // Check if to do can be deleted

    const resp = await fetch(`https://js1-todo-api.vercel.app/api/todos/${id}?apikey=60cab22a-fafd-4ad7-8289-b20000808625`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });


    if (resp.ok) {
      const deleteID = await resp.text(); // Get the ID of the deleted to do from the response
      console.log(`Todo with ID ${deleteID} deleted`);
      console.log('Response from API:', deleteID);

      if (toDoName) {
        toDoName.remove(); // Remove to do item from the UI if deletion is successful
      }

    } else {
      console.error('Failed to delete todo')
    }
   
  } catch (error) {
    console.error('Could not delete todo', error);
  }
}

// Marks a to do item as completed or uncompleted with a PUT request to the API
const completeToDo = async (id, completed) => {
  try {
    const resp = await fetch(`https://js1-todo-api.vercel.app/api/todos/${id}?apikey=60cab22a-fafd-4ad7-8289-b20000808625`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        completed, // Updated completion status
      })
      });

      if (!resp.ok) {
        console.log('Failed to complete todo')
        return
      }       

      const changeStatus = await resp.json(); // Parse the API response

      if (completed) {
      console.log('Todo checked', changeStatus);
    } else {
      console.log('Todo unchecked', changeStatus);
    }
   
  } catch (error) {
    console.error('Error completing todo')
  }
}

// Event listener that handles clicking on the checkbox, updates the UI and calls the API
taskList.addEventListener('click', (e) => {
  const checkbox = e.target.closest('.todo-checkbox'); 

  if (checkbox) {
    const toDoItem = e.target.closest('.todo'); 
    const notCompleted = toDoItem.id.replace('todo-', ''); // Extract the ID of the to do item
    const isCompleted = checkbox.checked; // Check if the checkbox is checked

    toDoItem.classList.toggle('checked', isCompleted); // Toggles the 'checked' class and updates UI

    completeToDo(notCompleted, isCompleted); // Calls the function to update the API
  }
});

