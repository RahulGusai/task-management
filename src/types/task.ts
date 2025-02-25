export enum Status {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
}

export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Urgent = 'Urgent',
  None = 'None',
}

export interface Task {
  id: number;
  title: string;
  priority: Priority;
  status: Status;
  created_at?: Date;
  customFields?: Record<string, string | number | boolean | null>;
}
