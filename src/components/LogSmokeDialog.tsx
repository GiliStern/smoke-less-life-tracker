
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SmokeType } from "@/types";

interface LogSmokeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLog: (log: { type: SmokeType; trigger?: string }) => void;
}

const LogSmokeDialog = ({ open, onOpenChange, onLog }: LogSmokeDialogProps) => {
  const [type, setType] = useState<SmokeType>('🚬 Tobacco Mix');
  const [trigger, setTrigger] = useState('');

  const handleLog = () => {
    onLog({ type, trigger });
    onOpenChange(false);
    setTrigger('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log a Smoke</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>What did you smoke?</Label>
            <RadioGroup defaultValue={type} onValueChange={(value: SmokeType) => setType(value)}>
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
