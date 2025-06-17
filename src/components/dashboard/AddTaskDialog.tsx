
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";

interface AddTaskDialogProps {
  status?: string;
  trigger?: React.ReactNode;
}

const AddTaskDialog = ({ status = 'todo', trigger }: AddTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const { createTask } = useTasks();

  const availableLabels = [
    'backend', 'frontend', 'design', 'testing', 'api', 'ui', 'security', 
    'qa', 'setup', 'devops', 'realtime', 'mobile'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const { error } = await createTask({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      labels: selectedLabels
    });

    if (!error) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setSelectedLabels([]);
      setOpen(false);
    }
  };

  const addLabel = (label: string) => {
    if (!selectedLabels.includes(label)) {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const removeLabel = (label: string) => {
    setSelectedLabels(selectedLabels.filter(l => l !== label));
  };

  const addNewLabel = () => {
    if (newLabel.trim() && !selectedLabels.includes(newLabel.trim())) {
      setSelectedLabels([...selectedLabels, newLabel.trim()]);
      setNewLabel('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" className="text-gray-500 text-sm w-full">
            + Add a task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Task description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedLabels.map((label) => (
                <Badge key={label} variant="secondary" className="flex items-center gap-1">
                  {label}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeLabel(label)}
                  />
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add custom label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNewLabel())}
              />
              <Button type="button" onClick={addNewLabel} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-1">
              {availableLabels
                .filter(label => !selectedLabels.includes(label))
                .map((label) => (
                  <Button
                    key={label}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addLabel(label)}
                    className="h-6 text-xs"
                  >
                    {label}
                  </Button>
                ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
