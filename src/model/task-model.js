import {tasks} from '../mock/task.js';

export default class TasksModel {
    #boardtasks = tasks;

    getTasks() {
        return this.#boardtasks;
    }
}