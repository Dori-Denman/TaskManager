
const DBM = new DatabaseManager();
const channelStats = new BroadcastChannel("tasksLoaded");
const MILLI_PER_DAY = 8.64e+7;
const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ctx = document.getElementById('taskGraph').getContext('2d');

// Function to fetch statistics data
function fetchStatistics() {
    // Retrieve completed tasks count from localStorage
    const completedTasksCount = localStorage.getItem('completedTasksCount') || 0;
    DBM.getTasks();

    // Display the completed tasks count on the stats page
    document.getElementById('completedTasks').textContent = completedTasksCount;
}

// Call the function when the page loads
window.onload = fetchStatistics;
// Dummy data for the chart
var data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
        label: 'Completed Tasks',
        data: [10, 20, 30, 40, 50, 60, 70],
        borderColor: 'purple',
        backgroundColor: 'purple',
        fill: true
    }]
};

channelStats.addEventListener("message", (event) => {
    console.log("Event happened")
    if (DBM.tasks){
        setGraphData(DBM.tasks);
        loadTasks(DBM.tasks);
        ctx.reset();
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
        checkbox.setAttribute("disabled", true);
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
        var message;
        if (daysDiff === 0) {
            message = el.Title + " - due today";
        } else if (daysDiff === 1) {
            message = el.Title + " - due tomorrow";
        } else if (daysDiff > 1) {
            message = el.Title + " - due in " + daysDiff + " days";
        } else {
            message = el.Title + " - is overdue";
        }

         // Append completion information to the message
        if (daysDiff >= 0 && daysDiff <= 3) {
            message += " (completed " + daysDiff + " days ago)";
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

        document.getElementById("TaskHistoryList").appendChild(taskItem);
    });
}

function setGraphData(taskList){
    // Getting the days of the week
    dates = new Array(7);
    day = (new Date()).getDay();
    for(let i = 0; i < 7; i++){
        dates[i] = daysOfTheWeek[(day + i + 1) % 7];
    }
    data.labels = dates;

    newGraphData = getCumulativeTasksCompleted(taskList);
    data.datasets[0].data = newGraphData;

    // Create the chart
    const chart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

function getCumulativeTasksCompleted(taskList){
    const today = new Date();
    tasksPerDay = (new Array(7)).fill(0);
    var completedCount = 0;
    
    taskList.forEach(element => {
        console.log(element);
        if(element.DateCompleted != "null"){
            completedCount += 1;
            var daysDiff = Math.ceil((new Date(element.DateCompleted) - today) / (1000 * 3600 * 24));
            console.log(daysDiff);
            // If the date is between 6 days ago and today
            if(daysDiff < 1 && daysDiff > -7){
                // reverse order for graphing purposes
                tasksPerDay[6 + daysDiff] += 1;
            }
        }
    })

    // Update Completed Display
    document.getElementById('completedTasks').textContent = completedCount;
    return tasksPerDay;
}

// Configuration options for the chart
const options = {
    scales: {
        y: {
            beginAtZero: true
        }
    }
};