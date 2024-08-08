const axios = require("axios")
const fs = require("fs")
const FormData = require('form-data')

require('dotenv').config();

async function uploadAudio() {
    const url = "https://api.gladia.io/v2/upload";
    const headers = {
        "Content-Type": "multipart/form-data",
        "x-gladia-key": process.env.GLADIA_KEY
    };
    const formData = new FormData();
    formData.append('audio', fs.createReadStream('./eduardo.mp3'));

    try {
        const response = await axios.post(url, formData, { headers });
        return response.data
    } catch (error) {
        console.error('error at upload audio: ', error);
        throw Error('error at upload audio: ', error);
    }
}


async function transcribeAudio() {
    const audio = await uploadAudio();

    const url = "https://api.gladia.io/v2/transcription";
    const headers = {
        "Content-Type": "application/json",
        "x-gladia-key": process.env.GLADIA_KEY
    };
    const data = {
        "audio_url": audio.audio_url
    };
    let response
    try {
        response = await axios.post(url, data, { headers });
    } catch (error) {
        console.error('error at transcribe: ', error);
    }

    await fetchTranscription(response.data.result_url)
}

async function fetchTranscription(url) {
    console.log('fetchTranscription', url);
    const headers = {
        "Content-Type": "application/json",
        "x-gladia-key": process.env.GLADIA_KEY
    };

    try {
        const response = await axios.get(url, { headers });
        console.log('transcribe', response.data);
    } catch (error) {
        console.error(error);
    }
    return
}

// THIS IS RUNNING IN REAL TIME THE FUNCTIONS
transcribeAudio();