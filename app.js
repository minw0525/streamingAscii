const txtFrame = document.getElementById("content")
const video = document.getElementById("video")
const videoCanvas = document.getElementById("videoCanvas")
const ctx = videoCanvas.getContext("2d")
const btn = document.getElementById("capture")
let cells;
let videoReady = false;
let windowW = innerWidth-10;
let windowH = innerHeight-10;
let videoW, videoH;
let pixels = 100;
const videoConstraints = {
    audio: false,
    video: {
        width: {max: pixels},
        height: {max: pixels}
    }
}
let wLen, hLen;
let fontSize;
let playing = false;
let frameRate = 30;



btn.addEventListener('click', async e=>{
    e.target.classList.toggle('captured')
    if (!playing) {
        await getMedia(videoConstraints)
        playing = true;
        window.repaint = setInterval(async () => {
            if (videoReady) {
                const temp = await frameLoader()
                    cells.forEach((cell, i)=>{
                        try {
                            cell.textContent = temp[i].char;
                            cell.style.fontWeight = temp[i].weight;
                        }catch(err){
                            console.log(err, temp, i)
                        }
                    })
            }
        }, 1000/frameRate);
    }else{
        playing ? stream.getTracks()[0].stop(): stream = null
        clearInterval(repaint)
        playing = false;
    }
})


async function getMedia(constraints) {
    let stream = null;

    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        window.stream = stream;
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            videoReady = true;
            video.play();
        };
        setCanvasRes()
        init()
    } catch(err) {
        console.error(err)
    }
}

function setCanvasRes(){
    const streamSettings = stream.getTracks()[0].getSettings()
    videoW = streamSettings.width;
    videoH = streamSettings.height;
    videoCanvas.width = videoW//`${videoW}px`;
    videoCanvas.height = videoH// `${videoH}px`;
}

function init(){
    // windowW>=windowH ? (wLen = pixels, fontSize = windowW/wLen, hLen = Math.floor(windowH/fontSize)) : (hLen = pixels, fontSize = windowH/hLen, wLen = Math.floor(windowW/fontSize))

    windowW>=windowH ? (wLen = pixels, fontSize = windowW/wLen, hLen = videoH) : (hLen = pixels, fontSize = windowH/hLen, wLen = videoW)
    document.documentElement.style.setProperty("--font-size", `${(fontSize)}px`) 
    document.documentElement.style.setProperty("--grid-column", wLen) 
    document.documentElement.style.setProperty("--grid-row", hLen) 
    console.trace(windowW, windowH,wLen, hLen)

    createCells()
}

function createCells(){
    txtFrame.textContent = '';
    for(let i = 0; i < wLen * hLen; i++){
        const pre = document.createElement('pre');
        pre.classList.add('cell')
        txtFrame.appendChild(pre);
    }
    cells = document.querySelectorAll('.cell');
}


async function frameLoader(){
    ctx.clearRect(0,0,videoW,videoH);
    ctx.filter = 'grayscale(1)'
   // ctx.scale(-1,1)
    ctx.drawImage(video, videoW, 0, -videoW,videoH);
    const data = ctx.getImageData(0, 0, videoW, videoH).data;
    //const data = ctx.getImageData(0, 0, videoW, videoH).data;
    //console.log(data)
    const mappedFrameArr = [];
    let mIdx = 0;
    for(let i = 0; i < data.length; i+=4){
        let lightness = Math.round(data[i] * 0.2126 + data[i+1] * 0.715 + data[i+2] * 0.0722); 
        [data[i], data[i+1], data[i+2]] = [lightness,lightness,lightness]
        mappedFrameArr[mIdx] = brightnessMap[parseInt(lightness/256 * brightnessMap.length)];
        mIdx++
    }
    //console.log(mappedFrameArr)
    return mappedFrameArr
}


// let newData = [];
// let temp = []
// for (let i = 0; i < data.length; i++) {
//     if (i % 10 != 0) {
//         temp.push(data[i])
//     } else {
//         newData.concat(temp.reverse())
//         temp = [];
//     } 
// }
// console.log(newData)

//'ㅤ'


