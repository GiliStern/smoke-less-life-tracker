
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSmokeLog } from "@/hooks/useSmokeLog";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";

const Profile = () => {
  const { logs } = useSmokeLog();

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
    toast.success("All data has been reset successfully!");
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <img src="/lovable-uploads/23789c59-36c7-4bf5-a537-f13eb2c0701a.png" alt="Smoke Control Logo" className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
        <p className="text-muted-foreground">Manage your account and data settings.</p>
      </header>
      
      <div className="flex-grow p-4 sm:p-6 pt-0 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Overview</CardTitle>
            <CardDescription>
              Current status of your smoking logs and data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total logs:</span>
                <span className="font-medium">{logs.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data stored locally:</span>
                <span className="font-medium text-green-600">✓ Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Permanently delete all your data. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your smoking logs, 
                    settings, and any other stored data from this device.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleResetData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, reset everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
