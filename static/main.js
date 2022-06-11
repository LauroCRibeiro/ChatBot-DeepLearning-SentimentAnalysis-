var thumbs_up_count=0
var thumbs_down_count=0
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "https://image.flaticon.com/icons/svg/327/327779.svg";
const PERSON_IMG = "https://image.flaticon.com/icons/svg/145/145867.svg";
const BOT_NAME = "Ada";
const PERSON_NAME = "You";

msgerForm.addEventListener("submit", event => {
    event.preventDefault();
    const msgText = msgerInput.value;
    if (!msgText) return;
    appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
    msgerInput.value = "";
    botResponse(msgText);
    sentimentResponse(msgText);
});

function appendMessage(name, img, side, text) {
    //   Simple solution for small apps
    const msgHTML = `
        <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image: url(${img})"></div>

        <div class="msg-bubble">
        <div class="msg-info">
        <div class="msg-info-name">${name}</div>
        <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
        </div>
        </div>
    `;
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}

function appendSentMessage(name, img, side, text) {
//   Simple solution for small apps
    const msgHTML = `
        <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image: url(${img})"></div>

        <div class="msg-bubble">
        <div class="msg-info">
        <div class="msg-info-name">${name}</div>
        <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
        </div>
        </div>
    `;
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}

function appendFeedback(name, img, side, tu, td) {
//   Simple solution for small apps
    const msgHTML = `
        <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image: url(${img})"></div>

        <div class="msg-bubble">
        <div class="msg-info">
        <div class="msg-info-name">${name}</div>
        <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">Rate My Answer!</div>

        <div class="rating">
        <!-- Thumbs up -->
        <div class="like grow like_button">
            <i class="fa fa-thumbs-up fa-lg like" aria-hidden="true"></i><i class="tu_count">${tu}</i>
        </div>
        <!-- Thumbs down -->
        <div class="dislike grow dislike_button">
            <i class="fa fa-thumbs-down fa-lg like" aria-hidden="true"></i><i class="td_count">${td}</i>
        </div>
        </div>
        </div>
        </div>
    `;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;

/*
$('.like, .dislike').on('click', function() {
    event.preventDefault();
    $('.active').removeClass('active');
    $(this).addClass('active');
});*/

$('.like_button').on('click', function() {
    event.preventDefault();
    $('.dislike_button').removeClass('active');
    $('.like_button').addClass('active');
    thumbs_up_count += 1
    $('.tu_count').html(thumbs_up_count)
    appendFeedbackMessageTU(BOT_NAME, BOT_IMG, "left",thumbs_up_count);
});

$('.dislike_button').on('click', function() {
    event.preventDefault();
    $('.like_button').removeClass('active');
    $('.dislike_button').addClass('active');
    thumbs_down_count += 1
    $('.td_count').html(thumbs_down_count)
    appendFeedbackMessageTD(BOT_NAME, BOT_IMG, "left",thumbs_down_count);
});
}

function appendFeedbackMessageTU(name, img, side, tu) {
//   Simple solution for small apps
    const msgHTML = `
        <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image: url(${img})"></div>

        <div class="msg-bubble">
        <div class="msg-info">
        <div class="msg-info-name">${name}</div>
        <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">Great! I am glad my reply is correct! Tell me more about your feeling for me to correctly identify your mood 😊</div>
        </div>
        </div>
        `;
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}

function appendFeedbackMessageTD(name, img, side, td) {
    //   Simple solution for small apps
    const msgHTML = `
        <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image: url(${img})"></div>

        <div class="msg-bubble">
        <div class="msg-info">
        <div class="msg-info-name">${name}</div>
        <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">I'm sorry that response wasn't helpful. If you have any feedback towards my performance feel free to fill in the survey!<br><br>Survey link:<br> <a href="https://forms.gle/JL2aJyKHNkQHvdx28" target="_blank">🗒Chatbot Ada Evaluation🗒</a></div>
        </div>
        </div>
        `;
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}

function botResponse(rawText) {
    // Bot Response
    $.get("/get", {
        msg: rawText
    }).done(function(data) {
        console.log(rawText);
        console.log(data);
        const msgText = data;
        appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
    });
}

function sentimentResponse(rawText) {
// Sentiment Response
    $.get("/getsentiment", {
        msg: rawText
    }).done(function(data) {
        console.log(rawText);
        console.log(data);
        const msgText = data;
        appendSentMessage(BOT_NAME, BOT_IMG, "left", msgText);
        appendFeedback(BOT_NAME, BOT_IMG, "left",thumbs_up_count,thumbs_down_count);
    });
}

// Utils
function get(selector, root = document) {
    return root.querySelector(selector);
}

function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
}


/**
 * Audio Recording
 * Based on: https://github.com/addpipe/simple-web-audio-recorder-demo
*/

var gumStream;
var recorder;

let recordBtn = document.getElementById('record-btn');

recordBtn.addEventListener("click", startRecording);

function startRecording() {
    console.log("startRecording() called");
    recordBtn.removeEventListener("click", startRecording);
    recordBtn.disabled = true;

    /*
        Simple constraints object, for more advanced features see
        https://addpipe.com/blog/audio-constraints-getusermedia/
    */
    
    var constraints = { audio: true, video:false }

    /*
        We're using the standard promise based getUserMedia() 
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing WebAudioRecorder...");

        /*
            create an audio context after getUserMedia is called
            sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
            the sampleRate defaults to the one set in your OS for your playback device

        */
        audioContext = new AudioContext();

        //assign to gumStream for later use
        gumStream = stream;
        
        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        recorder = new WebAudioRecorder(input, {
          workerDir: "/static/", // must end with slash
          encoding: "wav",
          numChannels: 1,
          onEncoderLoading: function(recorder, encoding) {
            // show "loading encoder..." display
            console.log("Loading "+encoding+" encoder...");
          },
          onEncoderLoaded: function(recorder, encoding) {
            // hide "loading encoder..." display
            console.log(encoding+" encoder loaded");
          }
        });

        recorder.onComplete = function(recorder, blob) { 
            console.log("Encoding complete");
            submitAudio(blob);
            // let playAudio = document.getElementById('audio-play');
            // let audioSrc = window.URL.createObjectURL(blob);
            // playAudio.src = audioSrc;
        }

        recorder.setOptions({
          timeLimit: 30,    // in seconds
          encodeAfterRecord: true,
        });

        //start the recording process
        recorder.startRecording();

        console.log("Recording started");
        recordBtn.addEventListener("click", stopRecording);
        recordBtn.classList.add('msger-record-btn');
        recordBtn.disabled = false;
    }).catch(function(err) {
        console.log(err);
        recordBtn.addEventListener("click", startRecording);
        recordBtn.disabled = false;
    });
}

function stopRecording() {
    console.log("stopRecording() called");
    recordBtn.removeEventListener("click", stopRecording);
    
    //stop microphone access
    gumStream.getAudioTracks()[0].stop();
    
    //tell the recorder to finish the recording (stop recording + encode the recorded audio)
    recorder.finishRecording();

    console.log('Recording stopped');
    recordBtn.addEventListener("click", startRecording);
    recordBtn.disabled = false;
    recordBtn.classList.remove('msger-record-btn');
}

function submitAudio(audioData) {
    var fd = new FormData();
    fd.append('audio', audioData);
    $.ajax({
        type: 'POST',
        url: '/transcriptaudio',
        data: fd,
        processData: false,
        contentType: false
    }).done(function(response) {
        console.log(response);
        const msgText = response;
        appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
        $("#send-btn").click();
    });
}