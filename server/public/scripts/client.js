console.log('js');

$(document).ready(function () {
  console.log('JQ');
  // Establish Click Listeners
  //click listener for add button
  setupClickListeners();
  // load existing koalas on page load
  getTasks();
}); // end doc ready

function setupClickListeners() {

  $('#viewTasks').on('click', '.transferBtn', readyForTransfer)
  $('#viewTasks').on('click', '.deleteBtn', handleDelete)

  $('#addButton').on('click', function () {
    console.log('in addButton on click');
    // get user input and put in an object
    // NOT WORKING YET :(
    // using a test object
    let taskToSend = {
      task: $('#taskIn').val(),
    };

    // call saveTask with the new object
    saveTask(taskToSend);
  });
}

function getTask() {
  console.log('in getTask');
  // ajax call to server to get todo
  $.ajax({ method: `GET`, url: `/todo` })
    .then(function (todo) {
      // we have retrieved the tasks from the database
      renderToDOM(todo);
    })
    .catch(function (error) {
      console.log(
        `There was an error retrieving the todo from the server:`,
        error);
    });
} // end getTask

function saveTask(newTask) {
  console.log('in saveTask', newTask);
  // ajax call to server to get todo
  $.ajax({ method: `POST`, url: `/todo`, data: newTodo })
    .then(function (response) {
      console.log(`The task was successfully added to the database.`);
      getTask(); // this will also call renderToDOM();
    })
    .catch(function (error) {
      console.log(`There was an error adding new koalas to the server:`, error);
    });
}

function renderToDOM(task) {
  $(`#viewTasks`).empty();

  for (let todo of todos) {
    if (todo.complete === true) {
      $(`#viewTask`).append(`
    <tr data-id="${todo.id}">
      <th>${todo.task}</th>
      <th><button class="transferBtn">Transferred</button></th>
      <th><button class="deleteBtn">Delete</button></th>
    </tr>
    `)
    } if (koala.complete === false){
      $(`#viewKoalas`).append(`
      <tr data-id="${todo.id}">
        <th>${todo.task}</th>
        <th><button class="transferBtn">Ready for Transfer</button></th>
        <th><button class="deleteBtn">Delete</button></th>
      </tr>
      `)
    } //end if conditional
  } //end loop
} //end renderToDOM

function handleDelete() {
  console.log('In delete button');
  let idToDelete = $(this).closest('tr').data('id');
  $.ajax({
    method: 'DELETE',
    url: `/todo/${idToDelete}`,
  })
    .then(function (response) {
      console.log('Response from delete ', response);
      getTask();
    })
    .catch(function (error) {
      console.log('Delete failed ', error);
    });
}


function readyForTransfer() {
  console.log('In ready for Transfer');
  let idToTransfer = $(this).closest('tr').data('id');
  let text = $(this).text();
  let readyForTransfer;
  if (text === 'Complete') {
    readyForTransfer = true;
  } else if (text === 'Delete') {
    readyForTransfer = false;
  }
console.log(readyForTransfer);
console.log(text);


  $.ajax({
    method: 'PUT',
    url: `/todo/${idToTransfer}`,
    data: {
      complete: complete,
    },
  })
    .then(function (response) {
      console.log('Response from id to Transfer', response);
      getTask();
    })
    .catch(function (error) {
      console.log('Ready to transfer failed', error);
    });
}