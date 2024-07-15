"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SignInButton() {
  const currPath = usePathname();

  return (
    <Button variant="outline">
      <Link href={{ pathname: "/signin", query: { redirect: currPath }}}>Sign In</Link>
    </Button>
  );
}
