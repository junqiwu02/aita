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

export default function Home() {
  return (
    <>
      <div className="text-center">
        <h1 className="mt-[64px] text-7xl font-extrabold">🩳 SHORTS.JS</h1>
        <h2 className="mt-2 text-muted-foreground">
          Create TikTok-ready short videos with a single click
        </h2>
        <div className="mt-[64px]">
          <Dialog>
            <Button asChild>
              <DialogTrigger>Create with AI ✨</DialogTrigger>
            </Button>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create with AI ✨</DialogTitle>
                <DialogDescription>
                </DialogDescription>
              </DialogHeader>
              <AIForm></AIForm>
            </DialogContent>
          </Dialog>

          <p className="my-2 text-sm text-muted-foreground">
            or
          </p>
          <Button variant="secondary">Create from URL 🔗</Button>
        </div>
      </div>
    </>
  );
}
