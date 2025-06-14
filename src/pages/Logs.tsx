
import { useState } from 'react';
import { useSmokeLog } from "@/hooks/useSmokeLog";
import { SmokeLog, SmokeType } from "@/types";
import { toast } from "sonner";
import LogsTable from '@/components/logs/LogsTable';
import EditLogDialog from '@/components/logs/EditLogDialog';

const Logs = () => {
  const { logs, updateLog, deleteLog } = useSmokeLog();
  const [editingLog, setEditingLog] = useState<SmokeLog | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const startEdit = (log: SmokeLog) => {
    setEditingLog(log);
    setIsEditDialogOpen(true);
  };

  const saveEdit = (updatedData: { type: SmokeType; trigger: string; timestamp: string }) => {
    if (editingLog) {
      updateLog(editingLog.id, updatedData);
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
          <LogsTable logs={logs} onEdit={startEdit} onDelete={handleDelete} />
        )}
      </div>

      <EditLogDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        log={editingLog}
        onSave={saveEdit}
        onCancel={cancelEdit}
      />
    </div>
  );
};

export default Logs;
