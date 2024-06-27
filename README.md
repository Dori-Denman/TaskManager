# ProDuckTivity

Welcome to ProDuckTivity, your ultimate task management solution! This application is designed to help users enhance their productivity by efficiently managing tasks and tracking progress. It makes it easy to stay organized, focused, and motivated to achieve your goals.

## General Info

Our Task Manager application has the following features:

- **Add Tasks**: Users can easily add tasks to their checklist. Simply click on the "Create Task" button to open up a modal and input the title, description, priority, and desired completion date. From there, users can click "Add Task" to have the task displayed on the task list.

- **Task Management**: Users can strike or check tasks off their list once completed. Tasks that are no longer significant can also be removed.

- **Task Display**: Users can see the description, priority, and task name displayed, providing them with essential information at a glance.

- **Advanced Options**: We provide advanced options for task management, including the ability to add tasks via calendar or modal.

- **Date Picker/Reminder**: Our date picker feature allows users to set a date for each task.

- **Goals Section**: Users can write daily goals to stay organized, focused, and motivated in achieving their tasks. These goals are displayed in the "My Goals" section.

- **User Page**: Each user has their own page where they can update their information, such as their profile name, email, and phone number. 

- **Statistics Page**: Gain insights into productivity with our statistics page. User's can view their completed tasks for the month and see their task history. Every task is assigned a unique ID for easy tracking.
 

## Pages

Our Task Manager application consists of three main pages:

1. **Main/Home Page**: The landing page where users can add, manage, and track their tasks and goals.
2. **User Page**: Personalized page for each user.
3. **Stats Page**: Stats page to gain valuable insights on productivity.


## **Backend Structuring**

1. HTML files
    * MainPage.html : This is the main page where the schedule and primary actions are located.
    * User.html : This is the profile page where users can view their account information and make changes to their profile.
    * Stats.html : thThis page allows users to view specific statistics related to their tasks.
2. CSS files
    * styles.css : This stylesheet contains the styling for the entire application, providing a cohesive visual experience across all pages.
3. JS Files
    * <u>Class</u> DatabaseManager.js :This file contains functions related to retrieving information from the database, including the login key for the encrypted database, and hooks. 
    * <u>Class</u> Task.js : This is a class which stores all of the events for the particular user, and a DatabaseManager object. This class is where all the functions involved in sorting, organizing, and fetching the events will be stored, as well as a list of all the events.
	* server.js : This file contains the server-side code for handling requests and interactions with the database.
    * mainpage.js : Contains functions related to the buttons necessary on the home page. 
	* Users.js : Contains functions related to the buttons necessary on User page. 
	* statistics.js : Contains functions related to the Stats page. 
4. Other files
    * TaskInformation.sql : Contains 2 databases. 1 for each user, and 1 more for every task. Each user has a unique ID, and each task has a unique ID. 


## SQL Database Information

Database is not encrypted. 

```
CREATE TABLE "Users" (
	"Username"	TEXT NOT NULL UNIQUE,
	"Password"	TEXT,
	PRIMARY KEY("Username")
)

CREATE TABLE "Tasks" (
	"ID"	INTEGER NOT NULL UNIQUE,
	"Title"	TEXT,
	"Description"	TEXT,
	"DateCreated"	TEXT,
	"DateDue"	TEXT,
	"DateCompleted"	TEXT,
	"Priority"	INTEGER,
	"Username"	TEXT NOT NULL,
	PRIMARY KEY("ID" AUTOINCREMENT)
)
```

## How to Use

1. **Add Tasks**: Start by navigating to the main page and from there you can add tasks to your checklist. Use the advanced options for more flexibility.
2. **Manage Tasks**: Strike or check tasks off your list as you complete them. Remove tasks that are no longer relevant.
3. **Edit Information**: Visit User page to edit profile name, email, and phone number.
4. **Explore Your Stats**: Visit the statistics page to analyze your productivity trends.

## How to use for Admins

1. The server must be running. To run the server, ensure npm, and node.js are installed on your device. Then while in the directory, use the command `node server.js`. This will later be hosted on an external device or hosting site. 
2. Once the server is running, open the main page in order to use the application as a user. 
