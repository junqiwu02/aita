import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function SignIn() {
  const onGoogleSignIn = async () => {
    "use server";
    await signIn("google", { redirectTo: "/" });
  };

  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={onGoogleSignIn}>
            <Button type="submit" className="w-[100%]" variant="outline">
              <Image
                src="https://authjs.dev/img/providers/google.svg"
                alt=""
                width={24}
                height={24}
                className="mr-2"
              ></Image>
              Sign in with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
