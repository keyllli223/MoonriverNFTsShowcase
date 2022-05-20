window.addEventListener('load', async () => {
    loadEvents();
    
    checkAccountAndChain();

    init();
});


var colorRange = 5; 
var pixelSize = 15;
var colors = [];
var wasGenerated = false;


const connectWallet = document.getElementById('connectWallet');
const currentAccount = document.getElementById('currentAccount');
const addressBlock = document.getElementById('addressBlock');
const generationBlock = document.getElementById('generationBlock');
const errBlock = document.getElementById('errBlock');
const errBlock2 = document.getElementById('errBlock2');
const moonriverPixelsBlock = document.getElementById('moonriverPixelsBlock');

const mintButton = document.getElementById('mintButton');
const generateButton = document.getElementById('generateButton');
const resultMint = document.getElementById('resultMint');

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

generationBlock.classList.add("hidden")

function checkColorsRange(element){
    if(!(element.value >= 2 && element.value <= 15)){
        document.getElementById("nrColors").min = 2;
        document.getElementById("nrColors").max = 15;
        this.value = 5;
    }
    element.nextElementSibling.value = element.value;
}

function checkPixelSize(element){
    if(!(element.value >= 15 && element.value <= 30)){
        document.getElementById("sizeOfPixel").min = 15;
        document.getElementById("sizeOfPixel").max = 30;
        this.value = 20;
    }
    element.nextElementSibling.value = element.value;
}


async function checkAccountAndChain() {
    await ethereum.request({ method: 'eth_requestAccounts' })
    .then((accounts)=>{
        let account = accounts[0];
        if(account){
            currentAccount.innerHTML = `${account.substr(0,10)}...${account.substr(-10)}`;
            connectWallet.classList.add("hidden");
            addressBlock.classList.remove("hidden");

            if(window.ethereum.networkVersion == CHAIN_ID){
                generationBlock.classList.remove("hidden");
                errBlock.classList.remove("error");
                errBlock.classList.add("hidden");
                errBlock2.classList.add("hidden");
                moonriverPixelsBlock.innerHTML = `<div class="lds-facebook"><div></div><div></div><div></div></div>`

                getMoonriverPixel(account);
                generateCanvas();
            } else {
                generationBlock.classList.add("hidden");
                errBlock.classList.add("error");
                errBlock.innerHTML = "<b>Incorrect network:</b> Switch network to Moonriver Mainnet !";
                errBlock.classList.remove("hidden");
            }
        }
    })
    .catch((error) => {
        if (error.code === 4001) {
            console.log('Rejected...Please connect to MetaMask.');
        } else {
            console.error(error);
        }
    });

}

function loadEvents(){
    generateButton.addEventListener("click", ()=>{
        generateCanvas();
    })

    mintButton.addEventListener('click', () => {
        generateButton.classList.add("hidden");
        mintButton.classList.add("hidden");
        resultMint.innerHTML = `<div class="waiting"></div>`;
          
        if (typeof window.ethereum !== 'undefined') {
            if(ethereum.isConnected()){
                if(wasGenerated){
                    ;(async () => {
                        resultMint.innerHTML = `<div class="waiting">Uploading image to IPFS server...</div>`;

                        let linkIpfs = await uploadToIpfs();

                        if(linkIpfs == "error"){
                            return console.log("Error");
                        }

                        resultMint.innerHTML = `<div class="waiting">You need to confirm the transaction in the wallet</div>`;

                        const contractPixel = new web3.eth.Contract(moonriverPixelContractAbi, moonriverPixelAddress);
                        const encodedData = contractPixel.methods.createPixel(linkIpfs).encodeABI();
                          
                        const transactionParameters = {
                            to: moonriverPixelAddress, 
                            from: await getCurrentWallet(), 
                            data: encodedData
                        };

                        ethereum.request({
                            method: 'eth_sendTransaction',
                            params: [transactionParameters],
                        })
                        .then((txHash) => {
                            generateCanvas();
                            resultMint.innerHTML = `<div class="succes"><b>Succes !</b><br>Tx. hash: <u><a target="_blank" href="https://moonriver.moonscan.io/tx/${txHash}">${txHash.substr(0,10)}...${txHash.substr(-10)}</a></u></div>`;
                            generateButton.classList.remove("hidden");
                            mintButton.classList.remove("hidden");
                        })
                        .catch((error) => {
                            console.log(error);
                            resultMint.innerHTML = `<div class="error">Error !</div>`;
                            generateButton.classList.remove("hidden");
                            mintButton.classList.remove("hidden");
                        });
                  })()
                }
            }
        }
        else{
            errBlock.innerHTML = "Please connect Metamask wallet !";
            errBlock.classList.remove("hidden");
        }
    });
}

function generateCanvas(){
    canvas.classList.remove("hidden");
    resultMint.innerHTML = "";

    if(window.ethereum.networkVersion != CHAIN_ID){
        checkAccountAndChain();
        return;
    }

    var y, x;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let elPixelSize = document.getElementById("nrColors");
    let elColorsRange = document.getElementById("sizeOfPixel");

    checkColorsRange(elPixelSize);
    checkPixelSize(elColorsRange);

    colorRange = parseInt(elPixelSize.value);
    pixelSize = parseInt(elColorsRange.value);

    generateColors(colorRange);

    for(y = 0; y <= canvas.height; y+=pixelSize){
        for(x = 0; x <= canvas.width; x+=pixelSize){
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            ctx.fillRect(x, y, pixelSize, pixelSize);
        }
    }

    var image = document.getElementById('source');

    ctx.fillStyle = "white";
    ctx.arc(canvas.width / 2, canvas.height / 2, 60, 0, 2 * Math.PI, false);
    ctx.fill();

    ctx.drawImage(image, canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100);

    wasGenerated = true;
    document.getElementById("mintButton").classList.remove("hidden");
}

function generateColors(colorRange){
    colors = [];
    for(var i = 0; i < colorRange; i++){
        colors[i] = getRandomColor();
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

}


async function getCurrentWallet(){
    const currentAccount = await ethereum.request({ method: 'eth_requestAccounts' });
    return currentAccount[0];
}

function init(){
    if (typeof window.ethereum !== 'undefined') {
        let accounts = [];
        connectWallet.addEventListener('click', () => {
            checkAccountAndChain();
        });

        ethereum.on('accountsChanged', function (accounts) {
            if(accounts.length){
                currentAccount.innerHTML = `${accounts[0].substr(0,10)}...${accounts[0].substr(-10)}`;

                getMoonriverPixel(accounts[0]);
            }
            else{
                currentAccount.innerHTML = "NONE";
                connectWallet.classList.remove("hidden");
                addressBlock.classList.add("hidden");
                generationBlock.classList.add("hidden");
                errBlock.classList.add("error");
                errBlock.classList.remove("hidden");
                errBlock.innerHTML = "Please connect Metamask wallet !";
                errBlock2.classList.add("error");
                errBlock2.classList.remove("hidden");
                errBlock2.innerHTML = "Please connect Metamask wallet !";
            }
        });

        ethereum.on('chainChanged', (chainId) => {
            checkAccountAndChain()
        });
    }
    else{
        errBlock.innerHTML = "Please connect Metamask wallet !";
        errBlock.classList.remove("hidden");
    }
}







async function getMoonriverPixel(wallet){
    const collectionInfo = {
        "contract" : "0xAb4202d07C4aBF7e019c3251881e82352b774EEe",
        "title" : "MoonriverPixels",
        "ticker" : "MoonPixel",
        "image": "0xAb4202d07C4aBF7e019c3251881e82352b774EEe.png"
    }
    const nftsInfo = await getNfts(collectionInfo, wallet);
    if(nftsInfo.length == 0){
        moonriverPixelsBlock.innerHTML = `<p style="font-size:19px; margin-top:10px">You don't have MoonriverPixels</p>`;
        return
    }
    moonriverPixelsBlock.innerHTML = "";

    nftsInfo.map((nft, index) => {
        moonriverPixelsBlock.innerHTML += ` 
            <div class="nft">
                <div class="image" style="background-image: url(${nft.image});"></div>
                <div class="info">
                    <p><b>${nft.name} #${nft.id}</b></p>
                    <a class="btn transfer" data-index="${index}" data-tokenId="${nft.id}">Transfer</a> 
                </div>
            </div>
         `;
    })

    const transferNftBtns = document.querySelectorAll(".transfer");

    transferNftBtns.forEach((btn) => {
        btn.addEventListener("click", (e) =>{
            let nftData = nftsInfo[e.target.getAttribute("data-index")];
            let tokenId = e.target.getAttribute("data-tokenId");

            Swal.fire({
                title: `Transfer MoonriverPixel#${tokenId}` ,
                html:`<img width="60%" style="margin:auto" src="${nftData.image}" alt=""><br>Enter address of receiver:`,
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Transfer',
                showLoaderOnConfirm: true,
                preConfirm: (toWallet) => {
                    try{
                        var validRegEx = /^0x([A-Fa-f0-9]{40})$/;
                        if(validRegEx.test(toWallet.trim())){
                            return toWallet;
                        } else {
                            throw new Error("Incorrect wallet address")
                        }                      
                    }
                    catch(error){
                        return Swal.showValidationMessage(error)
                    }
                },
                allowOutsideClick: () => !Swal.isLoading()
            })
            .then((result) => {
                if (result.isConfirmed && result.value) {

                    toWallet = result.value;

                    const contractPixel = new web3.eth.Contract(moonriverPixelContractAbi, moonriverPixelAddress);
                    const encodedData = contractPixel.methods.transferFrom(wallet, toWallet, tokenId).encodeABI();
                      
                    const transactionParameters = {
                        to: moonriverPixelAddress, 
                        from: wallet, 
                        data: encodedData
                    };

                    ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    })
                    .then((txHash) => {
                        generateCanvas();
                        showNotification('center', 'success', 'Succes !', `MoonriverPixel <b>#${tokenId}</b> was successfully sent !<br> Tx hash: <u><b><a href="https://moonriver.moonscan.io/tx/${txHash}" target="_blank">${txHash}</a></b></u>`);
                    })
                    .catch((error) => {
                        showNotification('center', 'error', 'Transfer error', `Error: <br>${error.message}`);
                    });
                }
            })
            
        })
    })
}





async function getNfts(collectionInfo, walletAddress){
    walletAddress = web3Provider.utils.toChecksumAddress(walletAddress);

    const contractAbi = nftCollectionAbi;

    const collectionAddress = web3Provider.utils.toChecksumAddress(collectionInfo.contract);
    let contract = new web3Provider.eth.Contract(contractAbi, collectionAddress);
    let nftBalance = await contract.methods.balanceOf(walletAddress).call()

    const promisesIdArray = [];
    const promisesUriArray = [];
    const promisesMetadataArray = [];
    const promisesResponseArray = [];

    for(var i = 0; i < nftBalance; i++){
        promisesIdArray.push(contract.methods.tokenOfOwnerByIndex(walletAddress, i).call())
    }

    const idArray = await Promise.all(promisesIdArray);
    for(var i = 0; i < idArray.length; i++){
        promisesUriArray.push(contract.methods.tokenURI(idArray[i]).call())
    }

    const uriArray = await Promise.all(promisesUriArray);
    uriArray.map((uri, index)=>{
        promisesMetadataArray.push(fetch(uriArray[index]
            .replace("ipfs://", "https://ipfs.infura.io/ipfs/")
            .replace("https://ipfs.io/ipfs/", "https://ipfs.infura.io/ipfs/")
            .replace("https://gateway.pinata.cloud/ipfs/", "https://ipfs.infura.io/ipfs/")
        ));
    });

    const metadataArray = await Promise.all(promisesMetadataArray);
    metadataArray.map((metadata, index)=>{
        promisesResponseArray.push(metadata.json());
    });

    const responsesArray = await Promise.all(promisesResponseArray);
    const newArray = [];

    responsesArray.map((item, index)=>{
        if(item.name){
            item.id = idArray[index];
            item.image = item.image.replace("ipfs://", "https://ipfs.infura.io/ipfs/")
                .replace("https://ipfs.io/ipfs/", "https://ipfs.infura.io/ipfs/")
                .replace("https://gateway.pinata.cloud/ipfs/", "https://ipfs.infura.io/ipfs/")
            newArray.push(item);
        }
    });

    return newArray;
}




async function uploadToIpfs(){
    if(window.ethereum.networkVersion != CHAIN_ID){
        checkAccountAndChain();
        return "error";
    }

    const imageToData = canvas.toDataURL("image/png");
    var file = dataURLtoFile(imageToData,'image.png');
    const cidImage  = await ipfsInfura.add(file)

    const metadataObj = {
        "name": "Moonriver Pixel",
        "description": "NFT collection on Moonriver",
        "image": `ipfs://${cidImage.path}`
    }

    const cidJson  = await ipfsInfura.add(JSON.stringify(metadataObj))
    return `ipfs://${cidJson.path}`;
}


function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}

function showNotification(position, type, title, text){
    Swal.fire({
        position: position,
        icon: type,
        title: title,
        html: text,
        showConfirmButton: false,
        showCloseButton: true
    })
}