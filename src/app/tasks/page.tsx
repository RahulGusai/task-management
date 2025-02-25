import TaskTable from '@/components/tasks/table';
import TopBar from '@/components/tasks/top-bar';
import { ClipboardList } from 'lucide-react';

export default function TasksPage() {
  return (
    <main className="m-4">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <ClipboardList className="w-8 h-8 text-blue-600" />
        Tasks
      </h1>
      <TopBar></TopBar>
      <TaskTable />
    </main>
  );
}
