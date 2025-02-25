import TaskTable from '@/components/tasks/table';
import TopBar from '@/components/tasks/top-bar';

export default function TasksPage() {
  return (
    <main className="m-4">
      <h1 className="text-3xl font-bold mb-4">Tasks</h1>
      <TopBar></TopBar>
      <TaskTable />
    </main>
  );
}
