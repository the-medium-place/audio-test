const recBtn = $("#record-btn");
const stopBtn = $("#stop-btn");
const playBtn = $('#play-btn');

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
    // console.log("hopefully updated value:\n", "==================")
    // console.log('object value: ', eqValsObj[event.target.id])
    console.log("testing data attribute output: \n", "====================");
    console.log(event.target.dataset.hertz)

    $('.' + event.target.id).text(event.target.value + 'db');

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

// CHARTJS SETUP

var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: ['125hz', '250hz', '500hz', '1000hz', '2000hz', '4000hz', '8000hz'],
        datasets: [
            {
                label: 'Right Ear',
                // backgroundColor: 'transparent',
                borderColor: 'red',
                fill: false,
                pointRadius: 10,
                pointHoverRadius: 15,
                data: [null, null, null, null, null, null, null],
                pointStyle: 'circle',
                lineTension: 0
            },
            {
                label: 'Left Ear',
                backgroundColor: 'transparent',
                borderColor: 'blue',
                data: [null, null, null, null, null, null, null],
                pointRadius: 10,
                pointHoverRadius: 15,
                pointStyle: 'crossRot',
                lineTension: 0
            }
        ]
    },

    // Configuration options go here
    options: {
        // TODO: IDEA: CAPTURE CLICK LOCATION ON CHART TO ADD NEW DATA TO DATASET ARRAY?
        // =============================================================================
        // onClick: function(element, dataAtClick){
        //     console.log(element, dataAtClick);
        //     let scaleRef,
        //         valueX,
        //         valueY;
        //         console.log(this.scales.scaleKey);
        //         // console.log(this.scales['x-axis-0'].longestTextCache.data['125hz'])
        //     for (var scaleKey in this.scales) {
        //         scaleRef = this.scales[scaleKey];
        //         if (scaleRef.isHorizontal() && scaleKey == 'x-axis-1') {
        //             valueX = scaleRef.getValueForPixel(element.offsetX);
        //         } else if (scaleKey == 'y-axis-1') {
        //             valueY = scaleRef.getValueForPixel(element.offsetY);
        //         }
        //     }
        //     this.data.datasets.forEach((dataset) => {
        //         dataset.data.push({
        //             x: valueX,
        //             y: valueY
        //         });
        //     });
        //     this.update();
        // },
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    min: -10,
                    max: 120,
                    stepSize: 5,
                    reverse: true,
                    callback: function (value, index, values) {
                        //TODO: FIND A WAY TO ADD 25db LINE AND 
                        //TODO: MAKE IT BOLD PLUS ADJUST ITS 
                        //TODO: PADDING TO SIT BETWEEN NEXT AND PREV LINE
                        //===============================================
                        // add line and label value for 25db
                        // if (index === 0) values.splice(4, 0, '25')
                        // if (value === '25') this.major = {enabled:true}
                        const vals = [-10, 0, 10, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]
                        if (vals.includes(value)) return value + 'db';

                    }
                }
            }]
        },
        dragData: true,
        dragDataRound: 0,
        dragOptions: {
          showTooltip: true
        },
        onDragStart: function(e) {
          // console.log(e)
        },
        onDrag: function(e, datasetIndex, index, value) {
          e.target.style.cursor = 'grabbing'
          // console.log(datasetIndex, index, value)
        },
        onDragEnd: function(e, datasetIndex, index, value) {
          e.target.style.cursor = 'default' 
          // console.log(datasetIndex, index, value)
        },
        hover: {
          onHover: function(e) {
            const point = this.getElementAtEvent(e)
            if (point.length) e.target.style.cursor = 'grab'
            else e.target.style.cursor = 'default'
          }
        }

    }
});

const actButtonWrapper = $('.act-wrapper');

actButtonWrapper.on('click', '.act-btn', event => {
    console.log(event.target.dataset.hertz);
    event.target.dataset.ear === 'left' ? chart.data.datasets[1].data.splice(event.target.dataset.index, 1, Math.floor(Math.random() * 129 - 10)) : chart.data.datasets[0].data.splice(event.target.dataset.index, 1, Math.floor(Math.random() * 129 - 10));

    chart.update();
})
