import { useState } from 'react';
import { useSmokeLog } from "@/hooks/useSmokeLog";
import { SmokeLog, SmokeType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { format } from 'date-fns';
import { Edit, Trash2, CalendarIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

const Logs = () => {
  const { logs, updateLog, deleteLog } = useSmokeLog();
  const [editingLog, setEditingLog] = useState<SmokeLog | null>(null);
  const [editData, setEditData] = useState<{
    type: SmokeType;
    trigger: string;
    date: Date;
  }>({
    type: '🌿 Herbal Mix',
    trigger: '',
    date: new Date()
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const startEdit = (log: SmokeLog) => {
    setEditingLog(log);
    setEditData({
      type: log.type,
      trigger: log.trigger || '',
      date: new Date(log.timestamp)
    });
    setIsEditDialogOpen(true);
  };

  const saveEdit = () => {
    if (editingLog) {
      updateLog(editingLog.id, {
        type: editData.type,
        trigger: editData.trigger,
        timestamp: editData.date.toISOString()
      });
      toast.success("Log updated successfully!");
      setIsEditDialogOpen(false);
      setEditingLog(null);
    }
  };

  const cancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingLog(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this log?")) {
      deleteLog(id);
      toast.success("Log deleted successfully!");
    }
  };

  const getTypeColor = (type: SmokeType) => {
    return type === '🌿 Herbal Mix' ? 'secondary' : 'destructive';
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-left">Logs</h1>
        <p className="text-muted-foreground text-left">View and edit your smoking history.</p>
      </header>
      
      <div className="flex-grow p-4 sm:p-6 pt-0 overflow-y-auto">
        {logs.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No logs yet. Start by logging your first smoke!
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getTypeColor(log.type)}>
                        {log.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(log)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(log.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Log</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium">
                Type
              </label>
              <select
                id="type"
                value={editData.type}
                onChange={(e) => setEditData({ ...editData, type: e.target.value as SmokeType })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="🌿 Herbal Mix">🌿 Herbal Mix</option>
                <option value="🚬 Tobacco Mix">🚬 Tobacco Mix</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="trigger" className="text-sm font-medium">
                Trigger
              </label>
              <Input
                id="trigger"
                value={editData.trigger}
                onChange={(e) => setEditData({ ...editData, trigger: e.target.value })}
                placeholder="Enter trigger..."
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Date & Time</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editData.date ? format(editData.date, "PPP HH:mm") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editData.date}
                    onSelect={(date) => {
                      if (date) {
                        // Preserve the time from the current date
                        const newDate = new Date(date);
                        newDate.setHours(editData.date.getHours());
                        newDate.setMinutes(editData.date.getMinutes());
                        setEditData({ ...editData, date: newDate });
                      }
                    }}
                    initialFocus
                    className="pointer-events-auto"
                  />
                  <div className="p-3 border-t">
                    <Input
                      type="time"
                      value={format(editData.date, "HH:mm")}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':');
                        const newDate = new Date(editData.date);
                        newDate.setHours(parseInt(hours, 10));
                        newDate.setMinutes(parseInt(minutes, 10));
                        setEditData({ ...editData, date: newDate });
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button onClick={saveEdit}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Logs;
