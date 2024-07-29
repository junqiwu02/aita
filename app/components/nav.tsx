import Link from "next/link";
import UserIcon from "@/app/components/user-icon";
import { Button } from "@/components/ui/button";

export default function Nav() {
  return (
    <nav className="flex items-center justify-between px-10 py-4">
      <Link href="/" className="font-bold">
        🩳
      </Link>
      <div className="flex items-center">
        <Button variant="link" asChild>
          <Link href="/plans">Plans</Link>
        </Button>
        <UserIcon></UserIcon>
      </div>
    </nav>
  );
}
