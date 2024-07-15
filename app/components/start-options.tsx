import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AIForm from "@/app/components/ai-form";

export default function StartOptions() {
  return (
    <div className="m-auto flex flex-wrap justify-center">
      <Dialog>
        <div className="rounded-lg bg-gradient-to-tr from-pink-300 to-blue-300 p-0.5">
          <Button asChild>
            <DialogTrigger>Create with AI ✨</DialogTrigger>
          </Button>
        </div>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create with AI ✨</DialogTitle>
            <DialogDescription>
              <AIForm></AIForm>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="my-2 w-[100%] text-center">or</div>
      <Button variant="secondary">
        Create from URL 🔗
      </Button>
    </div>
  );
}
