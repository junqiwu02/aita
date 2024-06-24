import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex justify-between px-10 py-4 items-center">
      <Link href="/" className="font-bold">
        AITA.io
      </Link>
      <div className="flex items-center">
        <ModeToggle></ModeToggle>
        <Button variant="outline" className="ml-2">Login</Button>
      </div>
    </nav>
  );
}
