let typeDelay = 100;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function blinkCursor(amt, delay=450) {
    let titleSpan = document.getElementById("titles");
    for(let i = 0; i < amt; i++) {
        let tx = titleSpan.innerText;
        titleSpan.innerText = tx.substring(0, tx.length-1)+" ";
        await sleep(450);
        titleSpan.innerText = tx.substring(0, tx.length-1)+"▐";
        await sleep(450);
    }
}

async function doTypingLoop() {
    let hs = "cs @ umd";
    let aspiring = [ 
        "full-stack dev",
        "systems eng",
        "security eng", 
    ];
    let titleSpan = document.getElementById("titles");
    while(true){
        await blinkCursor(3);
        for(let i = 1; i <= hs.length; i++){
            titleSpan.innerText = hs.substring(0, i) + "▐";
            await sleep(typeDelay);
        }
        await blinkCursor(3);
        for(let i = hs.length; i >= 0; i--){
            titleSpan.innerText = hs.substring(0, i) + "▐";
            await sleep(typeDelay);
        }
        await blinkCursor(3);
        for(let i = 1; i <= "aspiring".length; i++){
            titleSpan.innerText = "aspiring".substring(0, i) + "▐";
            await sleep(typeDelay);
        }
        for(let title of aspiring){
            await blinkCursor(2);
            title = " "+title;
            for(let i = 1; i <= title.length; i++){
                titleSpan.innerText = "aspiring"+title.substring(0, i) + "▐";
                await sleep(typeDelay);
            }
            await blinkCursor(2);
            for(let i = title.length; i >= 0; i--){
                titleSpan.innerText = "aspiring"+title.substring(0, i) + "▐";
                await sleep(typeDelay);
            }
        }
        for(let i = "aspiring".length-1; i >= 0; i--){
            titleSpan.innerText = "aspiring".substring(0, i) + "▐";
            await sleep(typeDelay);
        }
    }
}

doTypingLoop();