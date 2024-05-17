export default function Nav() {
  return (
    <nav className="flex justify-between p-10">
      <a href="#" className="font-bold">
        AITA.io
      </a>
      <button className="cursor-not-allowed rounded border bg-transparent px-4 py-2 font-bold hover:bg-neutral-700">
        Login
      </button>
    </nav>
  );
}
