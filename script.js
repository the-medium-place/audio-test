const recBtn = $("#record-btn");
const stopBtn = $("#stop-btn");
const playBtn = $('#play-btn');
const timer = $('#time-disp');

// EQ SLIDERS
const hz125 = $("#hz125");
const hz250 = $("#hz250");
const hz500 = $("#hz500");
const hz1000 = $("#hz1000");
const hz2000 = $("#hz2000");
const hz4000 = $("#hz4000");
const hz8000 = $("#hz8000");

// CREATE OBJECT TO HOUSE EQ VALUES
const eqValsObj = {
    hz125: 0,
    hz250: 0,
    hz500: 0,
    hz1000: 0,
    hz2000: 0,
    hz4000: 0,
    hz8000: 0
}

// LISTEN FOR CHANGES TO SLIDERS AND LOG RESULTING VALUE
const sliderWrapper = $('.slider-wrapper')

sliderWrapper.on("input", "input[type='range']", event => {

    eqValsObj[event.target.id] = parseInt(event.target.value);
    console.log("hopefully updated value:\n","==================")
    console.log('object value: ',eqValsObj[event.target.id])

    $('.'+event.target.id).text(event.target.value + 'db');

})




// USER CLICKS RECORD BUTTON
recBtn.on('click', () => {
    console.log(eqValsObj);
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
                $('.rec-timer').text(context.currentTime)

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
                filter1.type = 'peaking';
                filter1.frequency.value = 125;
                filter1.Q.value = 100;
                filter1.gain.value = eqValsObj.hz125;

                filter2.type = 'peaking';
                filter2.frequency.value = 250;
                filter2.Q.value = 100;
                filter2.gain.value = eqValsObj.hz250;

                filter3.type = 'peaking';
                filter3.frequency.value = 500;
                filter3.Q.value = 100;
                filter3.gain.value = eqValsObj.hz500;

                filter4.type = 'peaking';
                filter4.frequency.value = 1000;
                filter4.Q.value = 100;
                filter4.gain.value = eqValsObj.hz1000;

                filter5.type = 'peaking';
                filter5.frequency.value = 2000;
                filter5.Q.value = 100;
                filter5.gain.value = eqValsObj.hz2000;

                filter6.type = 'peaking';
                filter6.frequency.value = 4000;
                filter6.Q.value = 100;
                filter6.gain.value = eqValsObj.hz4000;

                filter7.type = 'peaking';
                filter7.frequency.value = 8000;
                filter7.Q.value = 100;
                filter7.gain.value = eqValsObj.hz8000;

                console.log("filter after:/n", "=======================");
                console.log(filter1, filter2, filter7);

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

