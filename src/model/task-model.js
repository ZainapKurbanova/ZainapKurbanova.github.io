import {tasks} from '../mock/task.js';

export default class TasksModel {
    #boardtasks = tasks;

    get tasks() {
        return this.#boardtasks;
    }

    getTasksByStatus(status) {
        return this.#boardtasks.filter((task) => task.status === status);
    }
}
