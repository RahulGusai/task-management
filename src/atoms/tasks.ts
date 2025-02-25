import { atom } from 'jotai';
import { Task, Priority, Status } from '@/types/task';
import { tasks } from '@/data/tasks';

let initialTasks: Task[] = [];
const storedTasks = localStorage.getItem('tasks');
if (storedTasks) {
  initialTasks = JSON.parse(storedTasks);
} else {
  initialTasks = tasks;
}

export const tasksAtom = atom<Task[]>(initialTasks);

export const selectedTasksAtom = atom<Set<number>>(new Set<number>());
