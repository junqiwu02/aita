"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { signInWith } from "../lib/actions";

export default function SignIn() {
  const searchParams = useSearchParams();

  return (
    <>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              signInWith("google", searchParams.get("redirect") || "");
            }}
          >
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
