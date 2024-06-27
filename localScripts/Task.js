// Enum for priority. 
const Priority = {
    Low: 0,
    Medium: 1,
    High: 2
}


class Task {
    constructor(title, description, dateCreated, dateDue, dateCompleted, priority = Priority.Medium) {
        this.title = title;
        this.description = description;
        this.dateCreated = dateCreated;
        this.dateDue = dateDue;
        this.dateCompleted = dateCompleted;
        this.priority = priority;
    }
  }
 