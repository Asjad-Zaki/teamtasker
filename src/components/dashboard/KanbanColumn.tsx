
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/hooks/useTasks";
import TaskCard from "./TaskCard";
import AddTaskDialog from "./AddTaskDialog";

export type TaskStatus = 'todo' | 'progress' | 'review' | 'done';

interface KanbanColumnProps {
  column: {
    id: TaskStatus;
    title: string;
    count: number;
    color: string;
  };
  tasks: Task[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, newStatus: TaskStatus) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  getPriorityColor: (priority: string) => string;
  getLabelColor: (label: string) => string;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => Promise<{ data: any; error: any }>;
  onDeleteTask?: (taskId: string) => Promise<{ error: any }>;
  canEdit?: boolean;
  canCreate?: boolean;
  canDrag?: boolean;
  userRole?: string;
}

const KanbanColumn = ({
  column,
  tasks,
  onDragOver,
  onDrop,
  onDragStart,
  getPriorityColor,
  getLabelColor,
  onUpdateTask,
  onDeleteTask,
  canEdit = true,
  canCreate = true,
  canDrag = true,
  userRole = 'developer'
}: KanbanColumnProps) => {
  return (
    <div 
      className={`space-y-4 ${canDrag ? '' : 'cursor-not-allowed'}`}
      onDragOver={canDrag ? onDragOver : undefined}
      onDrop={canDrag ? (e) => onDrop(e, column.id) : undefined}
    >
      <div className={`${column.color} rounded-lg p-4`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{column.title}</h3>
          <Badge variant="secondary" className="bg-white text-gray-700">
            {column.count}
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            getPriorityColor={getPriorityColor}
            getLabelColor={getLabelColor}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
            canEdit={canEdit}
            canDrag={canDrag}
            userRole={userRole}
          />
        ))}

        {column.id !== "done" && canCreate && canEdit && (
          <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
            <CardContent className="p-4 text-center">
              <AddTaskDialog status={column.id} />
            </CardContent>
          </Card>
        )}
        
        {!canCreate && column.id !== "done" && (
          <Card className="border-dashed border-2 border-gray-200 opacity-50">
            <CardContent className="p-4 text-center text-gray-400 text-sm">
              No permission to add tasks
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
