console.log('js');

$(document).ready(function () {
    console.log('JQ');
    // Establish Click Listeners
    setupClickListeners();
    getTask();
}); // end doc ready

function setupClickListeners() {

    $('#viewTasks').on('click', '.completeBtn', complete)
    $('#viewTasks').on('click', '.deleteBtn', handleDelete)

    $('#addBtn').on('click', function () {
        console.log('in addButton on click');
        // get user input and put in an object
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
    $.ajax({ method: `POST`, url: `/todo`, data: newTask })
        .then(function (response) {
            console.log(`The task was successfully added to the database.`);
            getTask(); // this will also call renderToDOM();
            $(`#taskIn`).val(``);
        })
        .catch(function (error) {
            console.log(`There was an error adding new task to the server:`, error);
        });
}

function renderToDOM(listOfTasks) {
    $(`#viewTasks`).empty();

    for (let todo of listOfTasks) {
        if (todo.complete === false || todo.complete === null) {
            $(`#viewTasks`).append(`
    <tr data-id="${todo.id}">
      <th>${todo.task}</th>
      <th><button class="completeBtn">Complete</button></th>
      <th><button class="deleteBtn">Delete</button></th>
    </tr>
    `)
        } if (todo.complete === true) {
            $(`#viewTasks`).append(`
      <tr style="background-color:#7F96FF;color:#ffffff;" data-id="${todo.id}">
        <th>${todo.task}</th>
        <th><p>You Did It!"</p></th>
        <th><button class="deleteBtn">Delete</button></th>
      </tr>
      `);
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

function complete() {
    console.log('In complete');
    let idToTransfer = $(this).closest('tr').data('id');
    let text = $(this).text();
    let complete;
    if (text === 'Complete') {
        complete = true;
    } else if (text === 'Delete') {
        complete = false;
    }
    console.log(complete);
    console.log(text);

    $.ajax({
        method: 'PUT',
        url: `/todo/${idToTransfer}`,
        data: {
            complete: complete,
        },
    })
        .then(function (response) {
            console.log('Response from id to complete', response);
            getTask();
            changeColor();
        })
        .catch(function (error) {
            console.log('Ready to transfer failed', error);
        });
}


