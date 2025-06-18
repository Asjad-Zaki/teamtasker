
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
}

const KanbanColumn = ({
  column,
  tasks,
  onDragOver,
  onDrop,
  onDragStart,
  getPriorityColor,
  getLabelColor
}: KanbanColumnProps) => {
  return (
    <div 
      className="space-y-4"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, column.id)}
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
          />
        ))}

        {column.id !== "done" && (
          <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
            <CardContent className="p-4 text-center">
              <AddTaskDialog status={column.id} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
