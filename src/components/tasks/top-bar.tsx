'use client';

import { useState } from 'react';
import CreateTask from './create-new-task';
import { Filter, Search, Trash2, X } from 'lucide-react';
import { Priority, Status } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { filterColumn, filterAtom, filterColumnsAtom } from '@/atoms/table';
import { useAtom } from 'jotai';
import { Task } from '@/types/task';
import CustomFieldsEditor from './field-editor';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { selectedTasksAtom, tasksAtom } from '@/atoms/tasks';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';

export default function TopBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterColumns] = useAtom(filterColumnsAtom); // Now using filterColumnsAtom
  const [filterColumn, setFilterColumn] = useState<filterColumn>(
    filterColumns[0]
  );
  const [filterValue, setFilterValue] = useState<string | boolean>('');
  const [filterRules, setFilterRules] = useAtom(filterAtom);
  const [selectedTasks, setSelectedTasks] = useAtom(selectedTasksAtom);
  const [tasks, setTasks] = useAtom(tasksAtom);

  const applyFilter = (
    column: keyof Task | string,
    value: string | boolean
  ) => {
    if (value === '' || value === null) return;

    setFilterRules((prevFilters) => {
      const existingFilterIndex = prevFilters.findIndex(
        (filter) => filter.column === column
      );

      let updatedFilters = [...prevFilters];

      if (existingFilterIndex !== -1) {
        updatedFilters[existingFilterIndex] = {
          column: column,
          value: value,
        };
      } else {
        updatedFilters.push({
          column: column,
          value: value,
        });
      }

      return updatedFilters;
    });

    setIsSearchOpen(false);
  };

  const removeFilter = (column: keyof Task | string) => {
    setFilterRules((prev) => prev.filter((rule) => rule.column !== column));
  };

  const handleTitleSearch = () => {
    if (!isSearchOpen) {
      setIsSearchOpen(true);
      return;
    }

    if (searchText.length > 0) {
      applyFilter('title', searchText);
    }
    setSearchText('');
    setIsSearchOpen(false);
  };

  const handleDeleteSelectedTasks = () => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => !selectedTasks.has(task.id))
    );
    toast.error(`Deleted ${selectedTasks.size} tasks`);
    setSelectedTasks(new Set());
  };

  return (
    <div className="flex items-start justify-between rounded-lg mb-4 gap-4">
      <div className="flex flex-col">
        {filterRules.length > 0 && (
          <Button variant="outline" className="w-32 h-2">
            <span>Current Filters:</span>
          </Button>
        )}
        <div className="p-3 flex gap-2 flex-wrap">
          {filterRules.length > 0 &&
            filterRules.map((filter) => (
              <div
                key={filter.column}
                className="flex items-center gap-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm"
              >
                <span>
                  {filter.column}: <strong>{String(filter.value)}</strong>
                </span>
                <X
                  className="w-4 h-4 cursor-pointer hover:text-red-500"
                  onClick={() => removeFilter(filter.column)}
                />
              </div>
            ))}
          {filterRules.length > 0 && (
            <div
              className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium cursor-pointer hover:bg-red-700 transition"
              onClick={() => setFilterRules([])}
            >
              <span>Remove all</span>
              <X className="w-4 h-4 cursor-pointer" />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {selectedTasks.size > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 px-4 py-2 rounded-md"
                  onClick={handleDeleteSelectedTasks}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete All</span>
                  <span className="text-xs">({selectedTasks.size})</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>Deleting {selectedTasks.size} tasks</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <CustomFieldsEditor></CustomFieldsEditor>
        <div
          className={`flex items-center gap-2 transition-all duration-300 ${
            isSearchOpen ? 'w-64' : 'w-auto'
          }`}
        >
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleTitleSearch}
          >
            <Search className="w-4 h-4" />
            {isSearchOpen && <span>Search</span>}
          </Button>
          {isSearchOpen && (
            <Input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by title..."
              className="w-48"
            />
          )}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4">
            <label className="text-sm font-medium mb-2 block">Filter By:</label>

            <Select
              onValueChange={(value) => {
                const column = filterColumns.find(
                  (col) => col.column === value
                );
                if (column) setFilterColumn(column);
                setFilterValue('');
              }}
              value={filterColumn.column}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select Column" />
              </SelectTrigger>
              <SelectContent>
                {filterColumns.map((col) => (
                  <SelectItem key={col.column} value={col.column}>
                    {col.column.charAt(0).toUpperCase() + col.column.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {filterColumn.type === 'string' && (
              <Input
                type="text"
                className="mt-3"
                placeholder={`Enter ${filterColumn.column}...`}
                value={filterValue as string}
                onChange={(e) => setFilterValue(e.target.value)}
              />
            )}

            {filterColumn.type === 'enum' && (
              <Select onValueChange={setFilterValue}>
                <SelectTrigger className="w-full mt-3">
                  <SelectValue placeholder={`Select ${filterColumn.column}`} />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(
                    filterColumn.column === 'status' ? Status : Priority
                  ).map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {filterColumn.type === 'boolean' && (
              <div className="mt-3">
                <label className="text-sm font-medium mb-1 block">
                  Select Value:
                </label>
                <ToggleGroup type="single" className="flex gap-2">
                  <ToggleGroupItem
                    value="true"
                    className="bg-gray-200 hover:bg-gray-300 data-[state=on]:bg-blue-600 data-[state=on]:text-white px-4 py-2 rounded-md"
                    onClick={() => setFilterValue(true)}
                  >
                    True
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="false"
                    className="bg-gray-200 hover:bg-gray-300 data-[state=on]:bg-blue-600 data-[state=on]:text-white px-4 py-2 rounded-md"
                    onClick={() => setFilterValue(false)}
                  >
                    False
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            )}

            <Button
              className="mt-3 w-full"
              onClick={() => applyFilter(filterColumn.column, filterValue)}
            >
              Apply Filter
            </Button>
          </PopoverContent>
        </Popover>
        <CreateTask></CreateTask>
      </div>
    </div>
  );
}
