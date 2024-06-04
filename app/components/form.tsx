import { generate } from "../lib/actions";

export default function Form() {
  return (
    <form className="space-y-5" action={generate}>
      <div>
        <label className="block" htmlFor="title">
          Title
        </label>
        <input
          className="rounded p-2 text-black shadow w-[100%]"
          type="text"
          name="title"
          placeholder="Leave blank for a random title"
        />
      </div>
      <div>
        <label className="block" htmlFor="">
          Speaker
        </label>
        <label className="p-2">
          <input type="radio" name="speaker" value="male" />
          Male
        </label>
        <label className="p-2">
          <input type="radio" name="speaker" value="female" />
          Female
        </label>
      </div>
      <div>
        <label className="block" htmlFor="">
          Include a
        </label>
        <label className="p-2">
          <input type="checkbox" name="include" value="tldr" />
          TL;DR
        </label>
        <label className="p-2">
          <input type="checkbox" name="include" value="edit" />
          Edit
        </label>
        <label className="p-2">
          <input type="checkbox" name="include" value="update" />
          Update
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
