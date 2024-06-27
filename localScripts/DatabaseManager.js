//------------------------MODIFY THIS FOR SERVER LOCATION---------------------------------\\
const serverAddress = "localhost:3000";
//------------------------^^MODIFY THIS FOR SERVER LOCATION^^---------------------------------\\





const channelDatabase = new BroadcastChannel("tasksLoaded");

const testTask = new Task("TestTitle", "TestDescription", new Date().toString(), new Date().toString(), new Date().toString());

class DatabaseManager {

    constructor(){
        self.tasks = null;
    }
    
    addDefaultTask(){
        this.addTask(testTask);
    }

    addTask(taskToAdd){
        let xhr = new XMLHttpRequest();
        xhr.open( "POST", `http://${serverAddress}/addTask?title=${taskToAdd.title}&description=${taskToAdd.description}&dateCreated=${taskToAdd.dateCreated}&dateDue=${taskToAdd.dateDue}&dateCompleted=${taskToAdd.dateCompleted}&priority=${taskToAdd.priority}&username=admin`);
        xhr.send(); 
    }

    markTaskAsComplete(id){
        let xhr = new XMLHttpRequest();
        xhr.open( "POST", `http://${serverAddress}/markComplete?ID=${id}`);
        xhr.send(); 
    }

    markTaskAsIncomplete(id){
        let xhr = new XMLHttpRequest();
        xhr.open( "POST", `http://${serverAddress}/markIncomplete?ID=${id}`);
        xhr.send(); 
    }

    addUser(username, password){
        let xhr = new XMLHttpRequest();
        xhr.open( "POST", `http://${serverAddress}/addUser?username=${username}&password=${password}`);
        xhr.send();
    }

    verifyUser(username, password){
        let xhr = new XMLHttpRequest();
        xhr.addEventListener( "load", onUserVerified);
        xhr.open( "GET", `http://${serverAddress}/verifyUser?username=${username}&password=${password}`);
        xhr.send();
    }

    onUserVerified(){
        // TODO: Change global variable and local storage to reflect if user logged in
        let conversionObject = JSON.parse( this.response);
        console.log(response);
    }

    tester(username){
        console.log("Get tasks Called");
        let xhr = new XMLHttpRequest();
        xhr.addEventListener( "load", (e) => {
            self.tasks = JSON.parse(e.target.response);
            //console.log(self.tasks);
            channelDatabase.postMessage(self.tasks);
            });
        xhr.open( "GET", `http://${serverAddress}/test`);
        return xhr.send(); 
    }

    getTasks(username){
        console.log("Get tasks Called");
        let xhr = new XMLHttpRequest();
        xhr.addEventListener( "load", (e) => {
            this.tasks = JSON.parse(e.target.response);
            channelDatabase.postMessage(true);
        });
        xhr.open( "GET", `http://${serverAddress}/getTasks?username=${username}`);
        xhr.send(); 
    }
}