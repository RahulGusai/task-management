import { Task } from '@/types/task';
import { atom } from 'jotai';

export type SortRule = { column: keyof Task | string; order: 'asc' | 'desc' };
export const sortAtom = atom<SortRule[]>([{ column: 'id', order: 'desc' }]);

export type filterColumn = {
  column: keyof Task | string;
  type: 'string' | 'enum' | 'number' | 'boolean';
};
export const defaultFilterColumns: filterColumn[] = [
  { column: 'status', type: 'enum' },
  { column: 'priority', type: 'enum' },
];
export const filterColumnsAtom = atom<filterColumn[]>(defaultFilterColumns);

export type FilterRule = {
  column: keyof Task | string;
  value: string | number | boolean;
};
export const filterAtom = atom<FilterRule[]>([]);

export enum CustomFieldType {
  Text = 'text',
  Number = 'number',
  Checkbox = 'checkbox',
}

export interface CustomField {
  id: string;
  name: string;
  description?: string;
  defaultValue?: string | number | boolean;
  type: CustomFieldType;
}

export const customFieldsAtom = atom<CustomField[]>([]);
