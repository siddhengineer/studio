import AppLayout from "@/components/layout/AppLayout";
import TaskList from "@/components/tasks/TaskList";

export default function Home() {
  return (
    <AppLayout>
      <TaskList />
    </AppLayout>
  );
}
