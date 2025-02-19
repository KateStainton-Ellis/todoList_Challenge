/*
- Interactive To-Do List
- User can add, delete or edit tasks.
- Event listeners are used to capture user actions (clicking the "Add", "Delete" and "Edit" buttons or hitting the "Enter" key after 
- editing a task item).
- The tasks are stored in an array and the array's contents are rendered into the DOM after every operation (add, delete, or edit).
*/

// Initialise the array to store the tasks to be rendered.
const task_list = [];

/*
  Render the task list.
*/
function renderTasks() {
  const taskTableBodyElement = document.getElementById("task_table_body");
  taskTableBodyElement.innerHTML = "";  // Reset the table body before rendering it.

  // For each task in the list, create a new table row with td elements for the task string, delete button and edit button.      
  for (i=0; i<task_list.length; i++) {
    // Create the td text element.
    const newTdEl1 = document.createElement("td");
    newTdEl1.classList.add(".editable");
    newTdEl1.classList.add("todoListItem");
    newTdEl1.setAttribute("todoListItem_index", i);
    newTdEl1.innerText = task_list[i];

    // Create the td buttons
    const newTdEl2 = document.createElement("td");
    const deleteButtonEl = document.createElement("button");
    const deleteButtonText = document.createTextNode("Delete");
    // Add index i to deleteButtonEl to use as reference for row deletion.
    deleteButtonEl.setAttribute("delete_index", i);
    // Add a class to distinguish the button type.
    deleteButtonEl.classList.add("delete_button"); 
    deleteButtonEl.appendChild(deleteButtonText);
    newTdEl2.appendChild(deleteButtonEl);
  
    const newTdEl3 = document.createElement("td");
    const editButtonEl = document.createElement("button");
    const editButtonText = document.createTextNode("Edit");
    // Add index i to editButtonEl to use as reference for row edit.
    editButtonEl.setAttribute("edit_index", i);
    // Add a class to distinguish the button type.
    editButtonEl.classList.add("edit_button");
    editButtonEl.appendChild(editButtonText);
    newTdEl3.appendChild(editButtonEl);
    
    // Create a new table row and add the new tds to it
    const newTrEl = document.createElement("tr");
    newTrEl.appendChild(newTdEl1);
    newTrEl.appendChild(newTdEl2);
    newTrEl.appendChild(newTdEl3);
    
    // Add the new row to the table body
    taskTableBodyElement.appendChild(newTrEl);
  }
}

// Create event listeners for Add Button, Delete Button, Edit Button, Enter Key

/*
  Add Button event listener.
*/
const addTaskButton = document.getElementById("new_task_button");
addTaskButton.addEventListener("click", function () {
  const userInput = document.getElementById('user_input');
  const taskToAdd = userInput.value.trim(); // Remove spaces, newline, etc.
  // If valid input, add the task to the array.
  if (validInput(taskToAdd)) {
    addTask(taskToAdd);
    userInput.value = ''; // Reset the input field.
  }
  else {
    userInput.value = ''; //Reset the input field.
  }
});

/*
  Add task. 
  Add a new task to the array and update the DOM.
*/
function addTask(taskToAdd) {
    task_list.push(taskToAdd);
    renderTasks();  // Update the DOM with the new task list.*/
}

/*
  Do some basic validation on the input string.
  Check for empty string or duplicate.
  TODO could add more to this e.g. minimum string length, spell-check.
*/
function validInput(taskString) {
  if (taskString === "" || taskString === null) {
    alert("Task name must not be empty!");
    return false;
  }
  else if (duplicateTask(taskString)) {
    alert(`The task "${taskString}" already exists!`);
    return false;
  }
  return true;
}

/*
  Check if task is already in list (converts case first for case-insensitive comparison).
*/
function duplicateTask(taskName) {
  const existingTasks = document.getElementsByClassName("todoListItem");
  for (i=0; i<existingTasks.length; i++) {
    if (taskName.toLowerCase() === existingTasks[i].innerHTML.toLowerCase()) {
      return true;
    }
  }
  return false;
}

/* 
  Add an event listener to the table body element for the delete and edit buttons.
  The table body is the parent of the delete and edit buttons. The buttons are given a class on creation to determine button type (i.e.
  "delete" or "edit"). The buttons are also given a unique id on creation which is used to identify which button (row) has been clicked.
*/
const tableBody = document.getElementById("task_table_body");

tableBody.addEventListener("click", function(event) {
  const target = event.target;
  if (target.getAttribute("delete_index")){
    const index = event.target.getAttribute("delete_index");
    if (index != null) {
      deleteTask(index);
    }
  }
  else if (target.getAttribute("edit_index")){
    const index = event.target.getAttribute("edit_index");
    if (index != null) {
      editTask(index);
    }
  }
});

/*
  Listen on table body for keyup and check it's the "Enter" key on an editable task item from the table.
  If so, validate the edited string and call replaceTaskString to update the task_list and render the DOM.
*/
tableBody.addEventListener("keyup", function (event) {
  if (event.key === 'Enter') {
    const index = event.target.getAttribute("todoListItem_index");
    const editedRow = document.getElementsByTagName("tbody")[0].children[index];
    const editedTask = editedRow.children[0].innerText.trim(); // First td element - now edited.
    editedTask.replace(/^\n+/, ""); // Remove any newlines from the beginning of the string too.

    // Validate editedString and if valid:
    if (validInput(editedTask)) {
      replaceTaskString(index, editedTask);
    }
    else {
      editedRow.children[0].innerText = "";
      editedRow.children[0].focus(); /* Set focus on the editable task field */
    }
  }
});

/*
  Delete task. 
  Remove the selected task from the array and update the DOM.
*/
function deleteTask(index) {
  task_list.splice(index, 1);  // Remove the task from the array.
  renderTasks();  // Update the DOM.
}

/*
  Edit task.
  This starts the edit by enabling editing on the row's task name field (first td element, identified by index).
  The edit finishes when the 'Enter' key is released, captured by event listener on row's task name field.
*/
function editTask(index) {
  const rowToEdit = document.getElementsByTagName("tbody")[0].children[index];
  rowToEdit.children[0].contentEditable = true; /* Make the row's task td content editable */
  rowToEdit.children[0].focus(); /* Set focus on the editable task field */
}

/* 
  Update the task list array with the edited string and update the DOM.
*/
function replaceTaskString(index, editedString) {
  task_list[index] = editedString;
  renderTasks();
}
