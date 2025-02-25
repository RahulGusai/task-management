import { atom } from 'jotai';
import { Task } from '@/types/task';
import { tasks } from '@/data/tasks';

let storedTasks;
let initialTasks: Task[] = [];

if (typeof window !== 'undefined') {
  storedTasks = localStorage.getItem('tasks');
}

if (storedTasks) {
  initialTasks = JSON.parse(storedTasks);
} else {
  initialTasks = tasks;
}

export const tasksAtom = atom<Task[]>(initialTasks);

export const selectedTasksAtom = atom<Set<number>>(new Set<number>());
