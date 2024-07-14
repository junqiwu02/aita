import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from "next/link";
import UserIcon from "@/app/components/user-icon";

export default function Nav() {
  return (
    <nav className="flex justify-between px-10 py-4 items-center">
      <Link href="/" className="font-bold">
        AITA.io
      </Link>
      <div className="flex items-center">
        <ModeToggle></ModeToggle>
        <div className="ml-2">
          <UserIcon></UserIcon>
        </div>
      </div>
    </nav>
  );
}
