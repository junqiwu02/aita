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

  const time_precision =
    transcriber.processor.feature_extractor.config.chunk_length /
    transcriber.model.config.max_source_positions;

  // Storage for chunks to be processed. Initialise with an empty chunk.
  let chunks_to_process = [
    {
      tokens: [],
      finalised: false,
    },
  ];

  // TODO: Storage for fully-processed and merged chunks
  // let decoded_chunks = [];

  function chunk_callback(chunk) {
    let last = chunks_to_process[chunks_to_process.length - 1];

    // Overwrite last chunk with new info
    Object.assign(last, chunk);
    last.finalised = true;

    // Create an empty chunk after, if it not the last chunk
    if (!chunk.is_last) {
      chunks_to_process.push({
        tokens: [],
        finalised: false,
      });
    }
  }

  // Inject custom callback function to handle merging of chunks
  function callback_function(item) {
    let last = chunks_to_process[chunks_to_process.length - 1];

    // Update tokens of last chunk
    last.tokens = [...item[0].output_token_ids];

    // Merge text chunks
    // TODO optimise so we don't have to decode all chunks every time
    // TODO fix word level timestamp decoding for unfinished chunks
    // let data = transcriber.tokenizer._decode_asr(chunks_to_process, {
    // For now exclude the last unfinished chunk from the decoder
    let data = transcriber.tokenizer._decode_asr(
      chunks_to_process.slice(0, -1),
      {
        time_precision: time_precision,
        return_timestamps: "word",
        force_full_sequences: false,
      },
    );

    self.postMessage({
      status: "update",
      data: data,
    });
  }

  const output = await transcriber(event.data.audio, {
    return_timestamps: "word", // word level timestamps
    chunk_length_s: 30, // for audios longer than 30s
    stride_length_s: 5,

    // Callback functions during processing
    callback_function: callback_function,
    chunk_callback: chunk_callback,
  });

  self.postMessage({
    status: "complete",
    output: output,
  });
});
