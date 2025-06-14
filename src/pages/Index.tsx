
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useSmokeLog } from "@/hooks/useSmokeLog";
import LogSmokeDialog from "@/components/LogSmokeDialog";
import { SmokeType } from "@/types";
import { toast } from "sonner";
import { BarChart, Cigarette, Clock, Leaf } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { differenceInHours, differenceInMinutes, differenceInSeconds, formatDistanceToNowStrict } from 'date-fns';

const Index = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { logs, addLog, loading } = useSmokeLog();
  const [timeSinceLast, setTimeSinceLast] = useState("No logs yet");

  const today = new Date();
  const todayLogs = logs.filter(log => new Date(log.timestamp).toDateString() === today.toDateString());
  const tobaccoCount = todayLogs.filter(log => log.type === '🚬 Tobacco Mix').length;
  const herbalCount = todayLogs.filter(log => log.type === '🌿 Herbal Mix').length;

  useEffect(() => {
    if (logs.length > 0) {
      const lastLogTime = new Date(logs[0].timestamp);
      const updateTimer = () => {
        setTimeSinceLast(formatDistanceToNowStrict(lastLogTime, { addSuffix: true }));
      };
      updateTimer();
      const intervalId = setInterval(updateTimer, 1000);
      return () => clearInterval(intervalId);
    } else {
      setTimeSinceLast("No logs yet");
    }
  }, [logs]);

  const handleLog = (logData: { type: SmokeType; trigger?: string }) => {
    addLog(logData);
    toast.success(`${logData.type} logged successfully!`);
  };
  
  const todayCountValue = (
    <div className="flex items-end gap-2">
      <span><span className="text-primary">🌿</span> {herbalCount}</span>
      <span className="text-lg text-muted-foreground">|</span>
      <span><span className="text-destructive">🚬</span> {tobaccoCount}</span>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-left">Dashboard</h1>
        <p className="text-muted-foreground text-left">Your control center.</p>
      </header>
      
      <div className="flex-grow p-4 sm:p-6 pt-0 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Today's Count"
            icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
            value={todayCountValue}
            className="col-span-2"
            description={`Total: ${herbalCount + tobaccoCount}`}
          />
          <StatCard
            title="Time Since Last"
            icon={<Clock className="h-4 w-4 text-muted-foreground" />}
            value={timeSinceLast}
          />
           <StatCard
            title="Health Gained"
            icon={<Leaf className="h-4 w-4 text-muted-foreground" />}
            value="Improving..."
            description="Coming soon!"
          />
        </div>
      </div>
      
      <div className="p-4 sm:p-6 sticky bottom-16 w-full">
        <Button
          size="lg"
          className="w-full h-16 text-xl font-bold rounded-full shadow-lg bg-gradient-to-br from-primary to-green-400 hover:from-primary/90 hover:to-green-400/90 transition-all duration-300 transform hover:scale-105 text-primary-foreground"
          onClick={() => setIsDialogOpen(true)}
        >
          <Cigarette className="mr-3 h-6 w-6" />
          Log a Smoke
        </Button>
      </div>

      <LogSmokeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onLog={handleLog}
      />
    </div>
  );
};

export default Index;
