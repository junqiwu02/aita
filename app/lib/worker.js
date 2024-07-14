// see https://github.com/xenova/whisper-web

import { pipeline, env } from "@xenova/transformers";

// Skip local model check
env.allowLocalModels = false;

// Use the Singleton pattern to enable lazy construction of the pipeline.
class PipelineSingleton {
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(
        "automatic-speech-recognition",
        "Xenova/whisper-tiny.en",
        { progress_callback },
      );
    }
    return this.instance;
  }
}

// Listen for messages from the main thread
self.addEventListener("message", async (event) => {
  // Retrieve the classification pipeline. When called for the first time,
  // this will load the pipeline and save it for future use.
  const transcriber = await PipelineSingleton.getInstance((x) => {
    // We also add a progress callback to the pipeline so that we can
    // track model loading.
    self.postMessage(x);
  });

  const output = await transcriber(event.data.audio, {
    return_timestamps: "word", // word level timestamps
    chunk_length_s: 30, // for audios longer than 30s
    stride_length_s: 5,

    // Callback functions during processing
    chunk_callback: () => {
      self.postMessage({
        status: "update",
      });
    },
    callback_function: () => {
      self.postMessage({
        status: "progress",
      });
    }
  });

  self.postMessage({
    status: "complete",
    data: output,
  });
});
