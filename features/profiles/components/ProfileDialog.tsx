import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type ProfileDialogProps = {
  dialogOpen: boolean;
  setDialogOpen: (dialogOpen: boolean) => void;
  children: React.ReactNode;
  title: string;
  description: string;
};

function ProfileDialog({
  dialogOpen,
  setDialogOpen,
  children,
  title,
  description,
}: ProfileDialogProps) {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="max-h-[90vh] overflow-hidden p-0 sm:max-w-[700px]">
        <div className="flex max-h-[calc(90vh-40px)] flex-col overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-5">
              <DialogHeader>
                <DialogTitle className="font-[Poppins] text-lg font-semibold tracking-[-0.4px] text-[#2C2C2C]">
                  {title}
                </DialogTitle>
                <DialogDescription className="font-[Lato] text-sm tracking-[0.08px] text-[#404040]">
                  {description}
                </DialogDescription>
              </DialogHeader>
              {children}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileDialog;
