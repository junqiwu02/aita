import { generate } from "../lib/actions";

export default function Form() {
  return (
    <form className="space-y-5" action={generate}>
      <div>
        <label className="block" htmlFor="title">
          Title
        </label>
        <input
          className="rounded p-2 text-black shadow"
          type="text"
          name="title"
          placeholder="Am I [22M] the asshole for..."
        />
      </div>
      <div>
        <label className="block" htmlFor="">
          Length
        </label>
        <label className="p-2">
          <input type="radio" name="length" disabled />
          1-2min
        </label>
        <label className="p-2">
          <input type="radio" name="length" disabled />
          2-5min
        </label>
        <label className="p-2">
          <input type="radio" name="length" disabled />
          5min+
        </label>
      </div>
      <div>
        <button className="rounded bg-indigo-500 px-4 py-2 font-bold shadow-lg hover:bg-indigo-700">
          Generate
        </button>
      </div>
    </form>
  );
}
