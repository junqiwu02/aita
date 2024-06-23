import { useOptimistic } from "react";
import { generate } from "./lib/actions";
import Spinner from "./components/spinner";

export default function Form() {
  const [preparing, addPreparing] = useOptimistic(
    false,
    (currentState, optimisticValue: boolean) => optimisticValue,
  );

  const handleSubmit = async (formData: FormData) => {
    // useOptimistic to display loading while the server action is running
    addPreparing(true);
    await generate(formData);
  };

  return (
    <form className="space-y-5" action={handleSubmit}>
      <div>
        <label className="block" htmlFor="title">
          Title
        </label>
        <input
          className="w-[100%] rounded p-2 text-black shadow"
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
          <input type="checkbox" name="include" value="update" />
          Update
        </label>
      </div>
      <div>
        {preparing ? (
          <>
            <p><Spinner /> Preparing your video...</p>
          </>
        ) : (
          <>
            <button className="rounded bg-indigo-500 px-4 py-2 font-bold shadow-lg hover:bg-indigo-700">
              Generate
            </button>
          </>
        )}
      </div>
    </form>
  );
}
