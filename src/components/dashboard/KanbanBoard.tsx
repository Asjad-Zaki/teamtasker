
import { useTasks } from "@/hooks/useTasks";
import KanbanColumn, { TaskStatus } from "./KanbanColumn";
import { getPriorityColor, getLabelColor } from "./kanbanUtils";

interface KanbanBoardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
}

const KanbanBoard = ({ user }: KanbanBoardProps) => {
  const { tasks, loading, updateTask, deleteTask } = useTasks();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tasksByStatus = {
    todo: tasks.filter(task => task.status === 'todo'),
    progress: tasks.filter(task => task.status === 'progress'),
    review: tasks.filter(task => task.status === 'review'),
    done: tasks.filter(task => task.status === 'done')
  };

  const columns: { id: TaskStatus; title: string; count: number; color: string }[] = [
    { id: "todo", title: "To Do", count: tasksByStatus.todo.length, color: "bg-gray-100" },
    { id: "progress", title: "In Progress", count: tasksByStatus.progress.length, color: "bg-blue-100" },
    { id: "review", title: "In Review", count: tasksByStatus.review.length, color: "bg-yellow-100" },
    { id: "done", title: "Done", count: tasksByStatus.done.length, color: "bg-green-100" }
  ];

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    console.log(`Moving task ${taskId} to ${newStatus}`);
    await updateTask(taskId, { status: newStatus });
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    handleStatusChange(taskId, newStatus);
  };

  const canEdit = user.role === 'admin' || user.role === 'project_manager' || user.role === 'developer';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          tasks={tasksByStatus[column.id]}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragStart={handleDragStart}
          getPriorityColor={getPriorityColor}
          getLabelColor={getLabelColor}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
