'use client';

import { selectedTasksAtom, tasksAtom } from '@/atoms/tasks';
import { Checkbox } from '@/components/ui/checkbox';
import { Task } from '@/types/task';
import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import EditTask from './edit-task';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import {
  CustomField,
  CustomFieldType,
  SortRule,
  customFieldsAtom,
  defaultFilterColumns,
  filterAtom,
  filterColumnsAtom,
  sortAtom,
} from '@/atoms/table';
import Pagination from './pagination';
import { toast } from 'sonner';

export default function TaskTable() {
  const [taskToBeEdited, setTaskToBeEdited] = useState<Task | undefined>(
    undefined
  );
  const [tasks] = useAtom(tasksAtom);
  const setTasks = useSetAtom(tasksAtom);
  const [sortRules] = useAtom(sortAtom);
  const setSortRules = useSetAtom(sortAtom);
  const [filterRules] = useAtom(filterAtom);
  const [customFields] = useAtom(customFieldsAtom);
  const [filterColumns, setFilterColumns] = useAtom(filterColumnsAtom);
  const [selectedTasks, setSelectedTasks] = useAtom(selectedTasksAtom);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.ceil(tasks.length / pageSize);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    setFilterColumns((prevColumns) => {
      const customFieldColumns = customFields.map((field) => {
        let fieldType: 'string' | 'enum' | 'number' | 'boolean' = 'string';

        if (field.type === CustomFieldType.Number) {
          fieldType = 'number';
        } else if (field.type === CustomFieldType.Checkbox) {
          fieldType = 'boolean';
        }

        return { column: field.name, type: fieldType };
      });

      return [...defaultFilterColumns, ...customFieldColumns];
    });
  }, [customFields]);

  const handleClose = () => {
    setTaskToBeEdited(undefined);
  };

  const handleDeleteTask = (task: Task) => {
    setTasks((previousTasks) =>
      previousTasks.filter((previousTask) => previousTask.id !== task.id)
    );
    toast.error(`Deleted Task: "${task.title}"`, {
      description: 'This action cannot be undone.',
    });
  };

  const getSortClass = (column: string) => {
    const sortRule = sortRules.find((rule) => rule.column === column);
    return sortRule ? 'text-blue-500' : 'text-gray-500';
  };

  const handleSort = (column: keyof Task | string) => {
    setSortRules((prevSortRules) => {
      const existingRule = prevSortRules.find((rule) => rule.column === column);
      const isDefaultOnly =
        prevSortRules.length === 1 && prevSortRules[0].column === 'id';

      let newSortRules: SortRule[];

      if (!existingRule) {
        newSortRules = isDefaultOnly
          ? [{ column, order: 'asc' }]
          : [...prevSortRules, { column, order: 'asc' }];
      } else if (existingRule.order === 'asc') {
        newSortRules = prevSortRules.map((rule) =>
          rule.column === column ? { ...rule, order: 'desc' } : rule
        );
      } else {
        newSortRules = prevSortRules.filter((rule) => rule.column !== column);
      }

      if (newSortRules.length === 0) {
        newSortRules = [{ column: 'id', order: 'desc' }];
      }

      return newSortRules;
    });
  };

  const handleCheckboxChange = (
    taskId: number,
    fieldName: string,
    checked: boolean
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              customFields: {
                ...task.customFields,
                [fieldName]: checked,
              },
            }
          : task
      )
    );
  };

  const handleTaskSelection = (taskId: number) => {
    setSelectedTasks((prev) => {
      const newSelected = new Set(prev);
      newSelected.has(taskId)
        ? newSelected.delete(taskId)
        : newSelected.add(taskId);
      return newSelected;
    });
  };

  const getTaskValue = (
    task: Task,
    column: string,
    customFields: CustomField[]
  ) => {
    if (column in task) {
      return task[column as keyof Task];
    }

    const field = customFields.find((f) => f.name === column);
    return task.customFields?.[column] ?? field?.defaultValue ?? null;
  };

  const filteredTasks = tasks.filter((task) => {
    return filterRules.every(({ column, value }) => {
      const taskValue = getTaskValue(task, column, customFields);

      if (typeof taskValue === 'string' && typeof value === 'string') {
        return taskValue.toLowerCase().includes(value.toLowerCase());
      }

      if (typeof taskValue === 'boolean' && typeof value === 'boolean') {
        return taskValue === value;
      }

      if (typeof taskValue === 'number' && typeof value === 'number') {
        return taskValue === value;
      }

      return taskValue === value;
    });
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    for (const { column, order } of sortRules) {
      let valueA: any;
      let valueB: any;

      if (column in a) {
        valueA = a[column as keyof Task];
        valueB = b[column as keyof Task];
      } else {
        valueA = a.customFields?.[column] ?? '';
        valueB = b.customFields?.[column] ?? '';
      }

      let comparison = 0;

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB);
      }

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        comparison = valueA - valueB;
      }

      if (comparison !== 0) return order === 'asc' ? comparison : -comparison;
    }

    return 0;
  });

  const paginatedTasks = sortedTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="border rounded-lg shadow-sm">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 flex font-semibold border-b">
        <div className="w-12"></div>
        <div
          className="flex-4 flex items-center gap-2 cursor-pointer"
          onClick={() => handleSort('title')}
        >
          Title <ArrowUpDown className={`w-4 h-4 ${getSortClass('title')}`} />
        </div>
        <div
          className="flex-1 flex items-center gap-2"
          onClick={() => handleSort('priority')}
        >
          Priority
          <ArrowUpDown className={`w-4 h-4 ${getSortClass('priority')}`} />
        </div>
        <div
          className="flex-1 flex items-center gap-2 cursor-pointer"
          onClick={() => handleSort('status')}
        >
          Status <ArrowUpDown className={`w-4 h-4 ${getSortClass('status')}`} />
        </div>
        {customFields.map((field) => (
          <div
            key={field.id}
            className="flex-1 flex items-center gap-2 cursor-pointer"
            onClick={() => handleSort(field.name)}
          >
            {field.name}{' '}
            <ArrowUpDown className={`w-4 h-4 ${getSortClass(field.name)}`} />
          </div>
        ))}
        <div className="flex-1 text-center">Actions</div>
      </div>

      {paginatedTasks.map((task: Task) => (
        <div
          key={task.id}
          className="flex items-center p-3 border-b last:border-0"
        >
          <div className="w-12">
            <Checkbox onCheckedChange={() => handleTaskSelection(task.id)} />
          </div>
          <div className="flex-4">{task.title}</div>
          <div className="flex-1">{task.priority}</div>
          <div className="flex-1">{task.status}</div>
          {customFields.map((field) => {
            const value =
              task.customFields?.[field.name] ?? field.defaultValue ?? 'N/A';

            return (
              <div key={field.id} className="flex-1 flex items-center">
                {field.type === CustomFieldType.Checkbox ? (
                  <Checkbox
                    className="text-blue-500 disabled:opacity-50"
                    checked={!!value}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(task.id, field.name, !!checked)
                    }
                  />
                ) : (
                  value.toString()
                )}
              </div>
            );
          })}
          <div className="flex-1 flex justify-center gap-3">
            <Pencil
              className="w-4 h-4 cursor-pointer text-blue-500 hover:text-blue-700"
              onClick={() => setTaskToBeEdited(task)}
            />
            <Trash2
              className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700"
              onClick={() => {
                handleDeleteTask(task);
              }}
            />
          </div>
        </div>
      ))}

      {taskToBeEdited && (
        <EditTask task={taskToBeEdited} onClose={handleClose}></EditTask>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
