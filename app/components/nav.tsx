import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex justify-between p-10">
      <Link href="/" className="font-bold">
        AITA.io
      </Link>
      <button className="cursor-not-allowed rounded border bg-transparent px-4 py-2 font-bold hover:bg-neutral-700">
        Login
      </button>
    </nav>
  );
}
