import { pipeline, env } from "@xenova/transformers";

// Skip local model check
env.allowLocalModels = false;

// Use the Singleton pattern to enable lazy construction of the pipeline.
class PipelineSingleton {
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en', { progress_callback });
        }
        return this.instance;
    }
}

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    console.log('received message');
    // Retrieve the classification pipeline. When called for the first time,
    // this will load the pipeline and save it for future use.
    const whisper = await PipelineSingleton.getInstance(x => {
        // We also add a progress callback to the pipeline so that we can
        // track model loading.
        self.postMessage(x);
    });

    function callback_function(item) {
        // console.log(`Callback: ${item}`);
    }

    function chunk_callback(item) {
        console.log(`Chunk callback: ${item}}`);
    }

    const output = await whisper(event.data.audio, {
        return_timestamps: 'word', // word level timestamps
        chunk_length_s: 30, // for audios longer than 30s
        stride_length_s: 5,

        // Callback functions
        // callback_function: callback_function, // after each generation step
        chunk_callback: chunk_callback, // after each chunk is processed
    });

    self.postMessage({
        status: 'complete',
        output: output,
    });
});