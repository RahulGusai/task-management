'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { tasksAtom } from '@/atoms/tasks';
import { Priority, Status, Task } from '@/types/task';
import { toast } from 'sonner';

interface EditTaskProps {
  task: Task;
  onClose: () => void;
}

export default function EditTask({ task, onClose }: EditTaskProps) {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [status, setStatus] = useState<Status>(task.status);

  const [tasks, setTasks] = useAtom(tasksAtom);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleEditTask = () => {
    const updatedTask: Task = {
      id: task.id,
      title,
      priority,
      status,
      created_at: task.created_at,
    };

    setTasks((previousTasks) =>
      previousTasks.map((previousTask) => {
        if (previousTask.id === task.id) {
          return updatedTask;
        }
        return previousTask;
      })
    );
    toast.success(`Updated Task: "${updatedTask.title}"`);

    onClose();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/75 z-[101]"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Add New Task</h2>

        <Input
          placeholder="Task Title"
          className="mb-3 w-full"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Priority</label>
          <Select
            value={priority}
            onValueChange={(value) => setPriority(value as Priority)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent className="z-9999">
              {Object.values(Priority).map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as Status)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent className="z-9999">
              {Object.values(Status).map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleEditTask}>Edit Task</Button>
        </div>
      </div>
    </div>
  );
}
