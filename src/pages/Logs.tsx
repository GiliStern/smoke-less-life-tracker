
import { useState } from 'react';
import { useSmokeLog } from "@/hooks/useSmokeLog";
import { SmokeLog, SmokeType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Edit, Save, X, Trash2 } from 'lucide-react';

const Logs = () => {
  const { logs, updateLog, deleteLog } = useSmokeLog();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<SmokeLog>>({});

  const startEdit = (log: SmokeLog) => {
    setEditingId(log.id);
    setEditData({
      type: log.type,
      trigger: log.trigger || '',
      timestamp: log.timestamp
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = () => {
    if (editingId && editData.type) {
      updateLog(editingId, editData);
      toast.success("Log updated successfully!");
      setEditingId(null);
      setEditData({});
    }
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
                  <TableHead>Trigger</TableHead>
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
                      {editingId === log.id ? (
                        <select
                          value={editData.type}
                          onChange={(e) => setEditData({ ...editData, type: e.target.value as SmokeType })}
                          className="w-full p-1 border rounded"
                        >
                          <option value="🌿 Herbal Mix">🌿 Herbal Mix</option>
                          <option value="🚬 Tobacco Mix">🚬 Tobacco Mix</option>
                        </select>
                      ) : (
                        <Badge variant={getTypeColor(log.type)}>
                          {log.type}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === log.id ? (
                        <Input
                          value={editData.trigger || ''}
                          onChange={(e) => setEditData({ ...editData, trigger: e.target.value })}
                          placeholder="Enter trigger..."
                          className="w-full"
                        />
                      ) : (
                        <span className="text-muted-foreground">
                          {log.trigger || 'No trigger specified'}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {editingId === log.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={saveEdit}
                              className="h-8 w-8 p-0"
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={cancelEdit}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
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
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
