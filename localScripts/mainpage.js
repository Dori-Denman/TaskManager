const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");

// getting new date, current year and month
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();
const DBM = new DatabaseManager();
const channelMain = new BroadcastChannel("tasksLoaded");

// storing full name of all months in array
const months = ["January", "February", "March", "April", "May", "June", "July",
"August", "September", "October", "November", "December"];

window.onload = getTasks;

channelMain.addEventListener("message", (event) => {
    console.log("Event happened")
    if (DBM.tasks){
        loadTasks(DBM.tasks);
    } else {
        console.log("Error. Tasks not yet loaded.");
    }
});

function loadTasks(tasks){
    tasks.forEach(el => {
        var taskItem = document.createElement("li");

        // Create checkbox for completion
        var checkbox = document.createElement("input");
        if (el.DateCompleted != "null"){
            checkbox.setAttribute("checked", true);
        }
        checkbox.type = "checkbox";
        checkbox.className = "completedCheckbox";
        checkbox.setAttribute("onchange", "changeTaskCompletion(this)");
        // Setting the id of the modified task
        checkbox.setAttribute("taskID", el.ID);
        taskItem.appendChild(checkbox);

        // Calculate due days
        var today = new Date();

        var dueDateTime = new Date(el.DateDue);
        var timeDiff = dueDateTime.getTime() - today.getTime();
        var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        // Create the message
        var message = el.Title;
        if (el.DateCompleted == "null"){
            if (daysDiff === 0) {
                message += " - due today";
            } else if (daysDiff === 1) {
                message += " - due tomorrow";
            } else if (daysDiff > 1) {
                message += " - due in " + daysDiff + " days";
            } else {
                message += " - is overdue";
            }
        }

        var priority = "";
        for (let i = 0; i < el.Priority + 1; i++){
            priority += "!";
        }

        // Create paragraph for task message
        var messageParagraph = document.createElement("span");
        messageParagraph.textContent = message;
        messageParagraph.className = "taskName";
        taskItem.appendChild(messageParagraph);

        // Create priority tag with exclamation marks representation
        var priorityTag = document.createElement("span");
        priorityTag.className = "priority-tag";
        priorityTag.textContent = priority;
        taskItem.appendChild(priorityTag);


        // Create a span for task description
        var descriptionSpan = document.createElement("span");
        descriptionSpan.textContent = el.Description;
        descriptionSpan.className = "taskDescription";
        taskItem.appendChild(descriptionSpan);

        // Apply style for completed tasks
        if (el.DateCompleted != "null") {
            var timeSinceCompletion =  new Date() - new Date(el.DateCompleted);
            timeSinceCompletion = Math.ceil(timeSinceCompletion / (1000 * 3600 * 24));

            if (timeSinceCompletion < 4){
                taskItem.classList.add("completed-task");
                // Append completed task to the completed task list
                document.getElementById("completedTaskList").appendChild(taskItem);
            }
        } else {
            // Append due task to the due task list
            document.getElementById("dueTaskList").appendChild(taskItem);
        }
    });
}

function changeTaskCompletion(checkbox){
    parentElement = checkbox.parentElement;
    if (checkbox.checked){
        moveToCompleted(parentElement);
        DBM.markTaskAsComplete(checkbox.getAttribute("taskID"));
    } else {
        moveToIncomplete(parentElement);
        DBM.markTaskAsIncomplete(checkbox.getAttribute("taskID"));
    }
}

function moveToCompleted(element){
    console.log("Moving element to complete");
}

function moveToIncomplete(element){
    console.log("Moving element to incomplete");
}

const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                    && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
    daysTag.innerHTML = liTag;
}
renderCalendar();

prevNextIcon.forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("openModalBtn");

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// Function to add a task
function addTask() {
    var taskInput = document.getElementById("taskInput");
    var description = document.getElementById("descriptionInput").value;
    
    // Get input values
    var taskName = document.getElementById("taskInput").value;
    var dueDate = document.getElementById("dueDate").value;

    // Get selected priority and convert it to exclamation marks representation
    var priority;
    var radios = document.getElementsByName("priority");
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            // Check the ID of the checked radio button
            if (radios[i].id === "highPriority") {
                priority = Priority.High;
            } else if (radios[i].id === "mediumPriority" && priority !== "!!!") {
                priority = Priority.Medium;
            } else if (radios[i].id === "lowPriority" && priority !== "!!") {
                priority = Priority.Low;
            }
            break;
        }
    }

    // Clear the input field

    today = new Date();
    var task = new Task(taskName,
        description,
        today.toString(),
        dueDate.toString(),
        null,
        priority
    );
    DBM.addTask(task);

    taskInput.value = "";
    document.getElementById("descriptionInput").value = ""; // Clear description input value
    closeModal();
}

// Function to close modal
function closeModal() {
    modal.style.display = "none";
    document.getElementById("taskInput").value = "";
    document.getElementById("descriptionInput").value = "";
    document.getElementById("highPriority").value = "";
    document.getElementById("dueDate").value = "";
    
    var radioButtons = document.querySelectorAll('.radio');
    radioButtons.forEach(function(radioButton) {
        radioButton.checked = false;
    });
}


function addDefaultTask(){
    DBM.addDefaultTask();
}

function getTasks(){
    DBM.getTasks();
}

//calender clickable code
document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to each day element
    document.querySelectorAll('.days li').forEach(day => {
        day.addEventListener('click', function() {
            // Open the popup with the clicked date
            const date = this.textContent;
            openTaskPopup(date);
        });
    });
});

function openTaskPopup(date) {
    // Open the modal
    document.getElementById('myModal').style.display = 'block';

    // Set the date in the modal
    let monthToAdd = currMonth + 1;
    if (monthToAdd < 10){
        monthToAdd = "0" + monthToAdd;
    }
    let dayToAdd = date;
    if (date < 10){
        dayToAdd = "0" + date;
    }

    currDate = currYear + "-" + monthToAdd + "-" + dayToAdd
    document.getElementById('dueDate').value = currDate;
}
document.addEventListener('DOMContentLoaded', function () {
    // Add event listener to each day element
    document.querySelectorAll('.days li').forEach(day => {
        day.addEventListener('click', function() {
            // Open your popup here
            const date = this.textContent;
            openTaskPopup(date);
        });
    });
    
    // Example task data with due dates
    const tasks = [
        { dueDate: '2024-04-10', name: 'Task 1' },
        { dueDate: '2024-04-12', name: 'Task 2' },
        // Add more tasks with due dates
    ];

    // Function to update dots on the calendar based on due dates
    function updateDots() {
        const today = new Date();
        const days = document.querySelectorAll('.days li');
        
        tasks.forEach(task => {
            const dueDate = new Date(task.dueDate);
            const daysDiff = Math.ceil((dueDate - today) / (1000 * 3600 * 24));

            if (daysDiff >= 0 && daysDiff < days.length) {
                const dot = days[daysDiff].querySelector('.dot');
                if (dot){
                    dot.classList.add('dot-active');

                // Add more conditions to change dot colors based on task properties
                if (task.priority === "high") {
                    dot.classList.add('dot-red');
                } else if (task.priority === "medium") {
                    dot.classList.add('dot-yellow');
                } else if (task.priority === "low") {
                    dot.classList.add('dot-green');
                }
                }
            }
        });
    }

    // Call updateDots function to initially update dots
    updateDots();
});

function addGoal() {
    var goalInput = document.getElementById("goalInput").value;
    
    if (goalInput.trim() !== "") {
        var goalsList = document.getElementById("goalsList");
        var newGoalItem = document.createElement("li");
        newGoalItem.textContent = goalInput;
        goalsList.appendChild(newGoalItem);
        
        // Clear the input field after adding goal
        document.getElementById("goalInput").value = "";
    } else {
        alert("Please enter a goal.");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Retrieves username from local storage
    var username = localStorage.getItem("username");
    
    // Displays the username on the home page
    var usernameElement = document.getElementById('username');
    if (usernameElement) {
        usernameElement.textContent = username ? 'Welcome ' + username : ''; 
    }
});
