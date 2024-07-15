import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default async function UserIcon() {
  const session = await auth();

  const onSignOut = async () => {
    "use server";
    await signOut();
  };

  return session?.user ? (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Avatar className="h-[1.5rem] w-[1.5rem]">
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <form action={onSignOut}>
            <Button
              variant="ghost"
              size={null}
              className="w-full justify-start cursor-auto"
            >
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </Button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  ) : (
    <>
      <Button variant="outline">
        <Link href="/signin">Sign In</Link>
      </Button>
    </>
  );
}
