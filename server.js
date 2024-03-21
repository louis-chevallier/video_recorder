const webcam = document.getElementById('webcam');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const recordedVideo = document.getElementById('recorded');

let mediaRecorder;
let recordedChunks = [];
    
txt = "coucou";
LOGX(txt);
vvvv = 32+4;
LOGX(vvvv);
serverURL = "/chunk"

aa="aeze";
LOGX(aa);



//const ws = new WebSocket(serverURL);

//https://stackoverflow.com/questions/52680587/send-mediarecorder-blobs-to-server-and-build-file-on-backend

async function startRecording() {
    LOGX("start");
    recordedChunks = [];
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    webcam.srcObject = stream;
    const options = {mimeType: 'video/webm', codecs : 'H264'}
    const mediaRecorder = new MediaRecorder(stream, options)
    
    mediaRecorder.ondataavailable = e => {
        LOGX("data");
        if (e.data.size > 0) {
            LOGX(e.data.size)
            //recordedChunks.push(e.data);
            const reader = new FileReader() 
            reader.readAsDataURL(e.data)        // Using Base64 encoding
            LOGX(1);
            reader.addEventListener('loadend', async (e) => {
                LOGX(2);
                const chunk = reader.result.split(',').pop()
                //LOGX(chunk);
                const response = await fetch('chunk', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        chunk: chunk
                    })
                })
                LOGX(3);
                const json = await response
                LOGX(json)
                const j = json.json();


            })
        }
            

        /*


            
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "/chunk");
            xhr.send();
            LOGX("sent");
        }
*/
  };
    
  mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/chunk");
      xhr.send();
      
      recordedVideo.src = url;
      recordedVideo.style.display = 'block';
      recordedVideo.controls = true;
  };

  mediaRecorder.start(1000);
  startButton.disabled = true;
  stopButton.disabled = false;
}

function stopRecording() {
  mediaRecorder.stop();
  startButton.disabled = false;
  stopButton.disabled = true;
}

startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording); 
