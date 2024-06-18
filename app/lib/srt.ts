export type SubItem = {
  id: number;
  start: number;
  end: number;
  text: string;
};

function strToTime(s: string) {
  let [hr, min, sec] = s.split(":");
  sec = sec.replace(",", ".");
  return Number(hr) * 3600 + Number(min) * 60 + Number(sec);
}

function timeToStr(t: number) {
  const hr = Math.floor(t / 3600)
    .toString()
    .padStart(2, "0");
  const min = Math.floor((t % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const sec = Math.floor(t % 60)
    .toString()
    .padStart(2, "0");
  const millis = Math.floor((t * 1000) % 1000)
    .toString()
    .padStart(3, "0");
  return `${hr}:${min}:${sec},${millis}`;
}

export function fromSRT(data: string) {
  const lines = data.split("\n");
  const out: SubItem[] = [];

  for (let i = 0; i < lines.length; i += 4) {
    const id = Number(lines[i]);
    const [startStr, endStr] = lines[i + 1].split(" --> ");
    const start = strToTime(startStr);
    const end = strToTime(endStr);
    const text = lines[i + 2];
    // i + 3 is an empty line
    out.push({
      id: id,
      start: start,
      end: end,
      text: text,
    });
  }

  return out;
}

export function toSRT(data: SubItem[]) {
  return data
    .map(
      (item) => `${item.id}
${timeToStr(item.start)} --> ${timeToStr(item.end)}
${item.text}
`,
    )
    .join("\n");
}

export function forceAlign(batches: string[], batchDurations: number[]) {
  function heuristic(token: string) {
    let dur = 1;
    dur += token.length * 0.1; // longer tokens have longer duration
    dur += /[,.!?]/.test(token) ? 1.5 : 0; // ,.!? have a longer duration
    return dur;
  }

  const out: SubItem[] = [];
  let id = 1;
  let time = 0;

  for (let i = 0; i < batches.length; i++) {
    // split batch into individual tokens and calc proportional duration of each token
    const tokens = batches[i].split(" ");
    let tokenDurations = tokens.map((str) => heuristic(str));
    // normalize
    const norm = batchDurations[i] / tokenDurations.reduce((sum, x) => sum + x);
    tokenDurations = tokenDurations.map((dur) => norm * dur);

    // create SubItems
    for (let j = 0; j < tokens.length; j++) {
      const end = time + tokenDurations[j];
      out.push({
        id: id,
        start: time,
        end: end,
        text: tokens[j],
      });
      id++;
      time = end;
    }
  }

  return out;
}
