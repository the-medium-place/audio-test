const recBtn = $("#record-btn");
const stopBtn = $("#stop-btn");
const playBtn = $('#play-btn');
const timer = $('#time-disp');
// const slider = document.querySelectorAll(".eq-slider");
const output = $('#output');

// EQ SLIDERS
const hz125 = $("#125hz");
const hz250 = $("#250hz");
const hz500 = $("#500hz");
const hz1000 = $("#1000hz");
const hz2000 = $("#2000hz");
const hz4000 = $("#4000hz");
const hz8000 = $("#8000hz");

// LISTEN FOR CHANGES TO SLIDERS AND LOG RESULTING VALUE
const sliderWrapper = $('.slider-wrapper')

sliderWrapper.on("input", "input[type='range']", event => {
    console.log(event.target.value)
})

// CAPTURE SLIDER VALUES AS VARIABLES
const hz125val = hz125.val();
const hz250val = hz250.val();
const hz500val = hz500.val();
const hz1000val = hz1000.val();
const hz2000val = hz2000.val();
const hz4000val = hz4000.val();
const hz8000val = hz8000.val();

// USER CLICKS RECORD BUTTON
recBtn.on('click', () => {
    console.log('clicked');
    // CAPTURE MICROPHONE INPUT
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        // SET UP RECORDING WITH MICROPHONE
        const mediaRecorder = new MediaRecorder(stream);

        // START RECORDING
        mediaRecorder.start();

        const audioChunks = [];

        // AUDIO IS CAPTURED IN MULTIPLE 'CHUNKS'
        mediaRecorder.addEventListener("dataavailable", event => {
            console.log(event)
            // timer.textContent = event.timeStamp / 1000;
            // PUSH ALL AUDIO CHUNKS TO SINGLE ARRAY
            audioChunks.push(event.data)
        })

        // USER CLICKS STOP BUTTON
        stopBtn.on('click', () => {
            // STOP RECORDING
            mediaRecorder.stop()
        })

        let audioBlob;
        let audioURL;
        let audio;
        mediaRecorder.addEventListener('stop', () => {
            // CAPTURE RAW AUDIO DATA INFO (BLOBS)
            audioBlob = new Blob(audioChunks);
            audioURL = URL.createObjectURL(audioBlob);

            // CREATE AUDIO OBJECT FROM CAPTURED BLOBS
            audio = new Audio(audioURL);

            // CREATE AUDIO PROCESSING CONTEXT AND FILTER
            const context = new AudioContext();
            const audioSource = context.createMediaElementSource(audio);
            const filter1 = context.createBiquadFilter();
            const filter2 = context.createBiquadFilter();
            const filter3 = context.createBiquadFilter();
            const filter4 = context.createBiquadFilter();
            const filter5 = context.createBiquadFilter();
            const filter6 = context.createBiquadFilter();
            const filter7 = context.createBiquadFilter();


            // CONNECT FILTER TO AUDIO DATA
            audioSource.connect(filter1);
            audioSource.connect(filter2);
            audioSource.connect(filter3);
            audioSource.connect(filter4);
            audioSource.connect(filter5);
            audioSource.connect(filter6);
            audioSource.connect(filter7);

            filter1.connect(context.destination);
            filter2.connect(context.destination);
            filter3.connect(context.destination);
            filter4.connect(context.destination);
            filter5.connect(context.destination);
            filter6.connect(context.destination);
            filter7.connect(context.destination);


            // CONFIGURE FILTER
            // TODO: MULTIPLE FILTERS FOR MANY FREQUENCY RANGES?
            filter1.type = 'notch';
            filter1.frequency.value = 125;
            filter1.Q = 100;
            filter1.gain.value = hz125val;

            filter2.type = 'notch';
            filter2.frequency.value = 250;
            filter2.Q = 100;
            filter2.gain.value = hz250val;

            filter3.type = 'notch';
            filter3.frequency.value = 500;
            filter3.Q = 100;
            filter3.gain.value = hz500val;

            filter4.type = 'notch';
            filter4.frequency.value = 1000;
            filter4.Q = 100;
            filter4.gain.value = hz1000val;

            filter5.type = 'notch';
            filter5.frequency.value = 2000;
            filter5.Q = 100;
            filter5.gain.value = hz2000val;

            filter6.type = 'notch';
            filter6.frequency.value = 4000;
            filter6.Q = 100;
            filter6.gain.value = hz4000val;

            filter7.type = 'notch';
            filter7.frequency.value = 8000;
            filter7.Q = 100;
            filter7.gain.value = hz8000val;

        })

        // USER CLICKS PLAY BUTTON
        playBtn.on('click', () => {
            audio.play();
        })
    })
})

// slider.oninput = function() {
//     output.innerHTML = this.value;
//   }

