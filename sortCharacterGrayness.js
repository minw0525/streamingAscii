/// 가: AC00  힣: D7A3
const hangulList = [];
let globalIdx = 0;
let weights = [100, 300, 500, 700, 900];
let threshold = 256;

//console.log(hangulList)

const fontCanvas = document.getElementById("fontCanvas");
const ctxF = fontCanvas.getContext("2d")
const frameSize = 100;
fontCanvas.width = frameSize;
fontCanvas.height = frameSize;


function getGrayness(character){
    ctxF.clearRect(0, 0,frameSize, frameSize)
    ctxF.fillStyle = 'white'
    ctxF.fillText(character, 0, frameSize*0.86);
    let data = ctxF.getImageData(0, 0, frameSize, frameSize).data;
    let temp = 0;
    for(let i = 3; i<data.length; i+=4){
        if (data[i]){
            temp += data[i]
        }
    }
    return temp / data.length
}

function quickSort(arr){

    if (arr.length < 2) {
        return arr;
    }
    
    const pivot = [arr[0]];
    const left = [];
    const right = [];

    for(let i = 1; i<arr.length; i++){
        if (arr[i].grayness < pivot[0].grayness){
            left.push(arr[i])
        }else if (arr[i].grayness > pivot[0].grayness){
            right.push(arr[i])
        }else {
            pivot.push(arr[i])
        }
    }
    return quickSort(left).concat(pivot, quickSort(right));
}


function pick256Hanguls(){
    for (let i = 0; i<weights.length; i++){
        ctxF.font = `${weights[i]} ${frameSize}px Noto Sans KR`

        for (let j = parseInt('AC00', 16); j <= parseInt('D7A3', 16); j++){
            let str = String.fromCharCode(j);
            hangulList[globalIdx] = {
                char: str,
                grayness : getGrayness(str),
                weight: weights[i]
            }
            globalIdx++
        }
        console.log(hangulList)
    }

    let sortedHangulList = quickSort(hangulList)
    console.log(sortedHangulList)
    const rep = []
    for (let i = 0; i < sortedHangulList.length; i+= sortedHangulList.length/threshold){
        rep.push(sortedHangulList[parseInt(i)])        
    }
    return rep
}

//const brightnessMap = pick256Hanguls()