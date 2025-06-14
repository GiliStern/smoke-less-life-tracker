
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SmokeType } from "@/types";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface LogSmokeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLog: (log: { type: SmokeType; trigger?: string; timestamp?: string }) => void;
}

const LogSmokeDialog = ({ open, onOpenChange, onLog }: LogSmokeDialogProps) => {
  const [type, setType] = useState<SmokeType>('🚬 Tobacco Mix');
  const [trigger, setTrigger] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState(format(new Date(), "HH:mm"));

  const resetState = () => {
    setType('🚬 Tobacco Mix');
    setTrigger('');
    setDate(new Date());
    setTime(format(new Date(), "HH:mm"));
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  };

  const handleLog = () => {
    let timestamp;
    if (date) {
      const [hours, minutes] = time.split(':').map(Number);
      const combinedDateTime = new Date(date.getTime());
      combinedDateTime.setHours(hours, minutes, 0, 0);
      timestamp = combinedDateTime.toISOString();
    }
    
    onLog({ type, trigger, timestamp });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log a Smoke</DialogTitle>
          <DialogDescription>
            Log a smoke for now or a past date and time.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>What did you smoke?</Label>
            <RadioGroup value={type} onValueChange={(value: SmokeType) => setType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="🚬 Tobacco Mix" id="tobacco" />
                <Label htmlFor="tobacco">🚬 Tobacco Mix</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="🌿 Herbal Mix" id="herbal" />
                <Label htmlFor="herbal">🌿 Herbal Mix</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="trigger">What was the trigger? (Optional)</Label>
            <Input
              id="trigger"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              placeholder="e.g., Stress, Coffee..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label>Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(d) => d > new Date()}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleLog}>Log</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogSmokeDialog;
