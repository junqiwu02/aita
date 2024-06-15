
const CPS = 21400; // base64 encoded chars per second of audio

// seconds to ass format
function stoa(t: number) {
  const hr = Math.floor(t / 3600);
  const min = Math.floor((t % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const sec = Math.floor(t % 60)
    .toString()
    .padStart(2, "0");
  const centisec = Math.floor((t * 100) % 100)
    .toString()
    .padStart(2, "0");
  return `${hr}:${min}:${sec}.${centisec}`;
}

// ass format to seconds
function atos(a: string) {
  const [hr, min, sec] = a.split(/[:]/).map(str => Number(str));
  return hr * 3600 + min * 60 + sec
}


function toASS(batches: string[], encodedLens: number[]) {
  const header = `[Script Info]
Title: Transcript
ScriptType: v4.00+
Collisions: Normal
PlayDepth: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Montserrat ExtraBold,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,2,2,5,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;



  function heuristic(word: string) {
    let dur = 1;
    dur += word.length * 0.1;
    dur += /[,.!?]/.test(word) ? 1.5 : 0;
    return dur;
  }

  const dialogues: string[] = [];
  let currTime = 0;

  for (let i = 0; i < batches.length; i++) {
    // split batch into individual tokens and calc duration in seconds of each token
    const totalDuration = encodedLens[i] / CPS;
    const tokens = batches[i].split(" ");
    let durations = tokens.map((str) => heuristic(str));
    // normalize to sum to totalDuration
    const norm = totalDuration / durations.reduce((sum, x) => sum + x);
    durations = durations.map((dur) => norm * dur);

    tokens.forEach((text, j) => {
      const start = stoa(currTime);
      currTime += durations[j];
      const end = stoa(currTime);
      dialogues.push(`Dialogue: 0,${start},${end},Default,,0,0,0,,${text}`);
    });
  }

  return header + dialogues.join("\n");
}

function fromASS(ass: string) {
  const dialogues = ass.split('\n').filter(line => line.startsWith("Dialogue:"));
  const res: { timestamps: number[], texts: string[] } = {
    timestamps: [],
    texts: []
  }
  for (const line in dialogues) {
    const time = line.slice(23, 33);
    console.log(time)
    const text = line.slice(50);
    res.timestamps.push(atos(time));
    res.texts.push(text);
  }
  return res
} 