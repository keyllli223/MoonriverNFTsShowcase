const collectionImage = document.getElementById("collections-demo");

let imageId = 0;

setInterval( ()=>{
    imageId ++;
    collectionImage.setAttribute("src", `./images/collectionRotation/${imageId % 15 + 1}.png`)
}, 1000)