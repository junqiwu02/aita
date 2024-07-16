import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "../components/password-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await auth();

  // TODO use middleware for protected routes instead
  if (!session) {
    redirect("/signin?redirect=%2Fsettings");
  }

  return (
    <>
      <Card className="w-[100%]">
        <CardHeader>
          Settings
          <CardDescription>
            Manage your account settings and integrations.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <Label htmlFor="elevenlabs">ElevenLabs API Key</Label>
            <PasswordInput name="elevenlabs"></PasswordInput>
            <CardDescription>
              You must provide your own API key to use ElevenLabs voices.
            </CardDescription>
          </div>

          <Alert>
            <Wallet className="h-4 w-4"></Wallet>
            <AlertTitle>Subscription Details</AlertTitle>
            <AlertDescription className="mt-3 space-y-2">
              Current Plan&nbsp;
              <Badge variant="secondary">Free</Badge>
              <br />
              Remaining generations today&nbsp;
              <Badge variant="secondary">5/5</Badge>
              <br />
              <Button asChild>
                <Link href="/plans">Manage</Link>
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </>
  );
}
