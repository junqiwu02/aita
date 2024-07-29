"use client";

import { useOptimistic } from "react";
import { generate } from "../lib/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CircleAlert, Loader2 } from "lucide-react";
import { useContent } from "../providers/content-provider";
import { useRouter } from "next/navigation";
import { useRenderer } from "../providers/renderer-provider";

export default function AIForm() {
  const [preparing, addPreparing] = useOptimistic(
    false,
    (currentState, optimisticValue: boolean) => optimisticValue,
  );
  const { setTitle, setBody, setTitleAudio, setBodyAudio } = useContent();
  const { run } = useRenderer();
  const router = useRouter();

  const onSubmit = async (formData: FormData) => {
    // useOptimistic to display loading while the server action is running
    addPreparing(true);

    const { title, body, titleAudio, bodyAudio } = await generate(formData);
    setTitle(title);
    setBody(body);
    // setBody([{text: "TEST", timestamp: [5, 30]}])
    setTitleAudio(titleAudio);
    setBodyAudio(bodyAudio);

    run(title, body, titleAudio, bodyAudio);
    router.push("/app");
  };

  // TODO fix labels htmlFor
  return (
    <form className="space-y-5" action={onSubmit}>
      <div className="grid gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          name="title"
          placeholder="Leave blank for a random title"
        />
      </div>
      <div className="grid gap-1.5">
        <Label className="block" htmlFor="voice">
          Voice
        </Label>
        <Select name="voice" required>
          <SelectTrigger id="voice">
            <SelectValue placeholder="Choose a voiceover style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="elevenlabs" disabled>
              <div className="flex items-center">
                ElevenLabs
                <CircleAlert className="ml-2 h-4 w-4" />
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="update" name="update" />
        <Label htmlFor="update">Include an update</Label>
      </div>
      <div>
        <Button disabled={preparing}>
          {preparing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
}
