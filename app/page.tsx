import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Form from "./form";

export default function Home() {
  return (
    <>
      <div className="my-[64px] text-center">
        <h1 className="text-7xl font-bold">AI Generated Reddit Stories</h1>
      </div>
      <Dialog>
        <Button asChild>
          <DialogTrigger>Let&apos;s Go!</DialogTrigger>
        </Button>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Video 🎥</DialogTitle>
            <DialogDescription>
              <Form></Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
