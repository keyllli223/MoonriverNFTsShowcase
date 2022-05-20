const mainBlock = document.getElementById("main-block");
const oneCollectionBlock = document.getElementById("collection-block");

const mynftsDivError = document.getElementById("mynftsDivError");
const collectionsListBlock = document.getElementById("collectionsListBlock");

const noUrlParamBlock = document.getElementById("noUrlParamBlock");
const urlParamBlock = document.getElementById("urlParamBlock");

const createLinkBlock = document.getElementById("createLinkBlock");
const inputWallet = document.getElementById("inputWallet");
const searchBtn = document.getElementById("searchBtn");


searchBtn.onclick = function () {
    searchNFT(0, inputWallet.value.trim());
};


async function init(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let errorMessage = "";
    let wallet = "";
    var validRegEx = /^0x([A-Fa-f0-9]{40})$/;

    if(urlParams.has('wallet') || urlParams.has('link')) {

        if(urlParams.has('wallet')){
            wallet = urlParams.get('wallet').trim()
            
            if (!validRegEx.test(wallet.trim())) {
                errorMessage = "Wallet address from URL is not correct";
            }
        } 

        else if(urlParams.has('link')){
            const link = urlParams.get('link')
            let response = await fetch(`${serverUrl}/api/getOne/${link}`);
            if(response.status == 200) {
                const data = await response.json();
                if(data.length){
                    if(!data[0].wallet){
                        errorMessage = `No wallet address associated with this link`;
                    }
                    else{
                        wallet = data[0].wallet;
                        if (!validRegEx.test(wallet.trim())) {
                            errorMessage = `Wallet address associated with this link (<u>${wallet}</u>)  is not correct`;
                        }
                    }
                } else {
                    errorMessage = "This link does not exist";
                }
            }
        }
        if(errorMessage){
            mynftsDivError.classList.remove("hidden");
            mynftsDivError.innerHTML = errorMessage;
            urlParamBlock.classList.add("hidden");
        } else {
            urlParamBlock.innerHTML = `<b>Wallet address:</b> ${wallet}`;
            searchNFT(1, wallet);
        }
    } 
    else{
        for(const entry of urlParams.keys()) {
            window.location.href = "./nfts.html";
            break;
        }

        noUrlParamBlock.classList.remove("hidden");
        urlParamBlock.classList.add("hidden");

        
    }

    

}



function searchNFT(type, address){
    var validRegEx = /^0x([A-Fa-f0-9]{40})$/;
    if (!address.trim() || !validRegEx.test(address.trim())) {
        mynftsDivError.classList.remove("hidden");
        mynftsDivError.innerHTML = "Put a correct wallet address !";
        inputWallet.focus();
        inputWallet.classList.add("error");
    } else {
        inputWallet.classList.remove("error");
        inputWallet.style.background = "#e0e0e0";
        inputWallet.value = inputWallet.value.trim();
        inputWallet.setAttribute("readonly", "");
        searchBtn.classList.add("hidden");
        
        mynftsDivError.innerHTML = "Waiting...";
        mynftsDivError.classList.add("hidden");
        collectionsListBlock.classList.remove("hidden");
        collectionsListBlock.innerHTML = `<div class="lds-facebook"><div></div><div></div><div></div></div>`;
        
        const walletAddress = address.trim();

        const nftCollections = [
            {
                "contract" : "0xAb4202d07C4aBF7e019c3251881e82352b774EEe",
                "title" : "MoonriverPixels",
                "ticker" : "MoonPixel",
                "image": "0xAb4202d07C4aBF7e019c3251881e82352b774EEe.png"
            },



            {
                "contract" : "0xd3a9c48df4d9342dc1a0ee2c185ce50588729fa9",
                "title" : "BEANS NFT",
                "ticker" : "Beanies",
                "image": "0xd3a9c48df4d9342dc1a0ee2c185ce50588729fa9.png"
            },

            {
                "contract" : "0xb8017E9660960C58b63d2DEdA983De4A7912E379",
                "title" : "Bored Puppets Yacht Club",
                "ticker" : "BPYC",
                "image": "0xb8017E9660960C58b63d2DEdA983De4A7912E379.png"
            },

            {
                "contract" : "0x0dad866dc0c13fb8e4a91d1b5e83cf3a61d4cee2",
                "title" : "CryptoButchers",
                "ticker" : "BUTCHER",
                "image": "0x0dad866dc0c13fb8e4a91d1b5e83cf3a61d4cee2.png"
            },
            {
                "contract" : "0xfc948004d29b2557cb6203f404db6fd90ae7e9fb",
                "title" : "CryptoButchersFemale",
                "ticker" : "FEMALEBUTCHER",
                "image": "0xfc948004d29b2557cb6203f404db6fd90ae7e9fb.png"
            },
            {
                "contract" : "0xb6e9e605aa159017173caa6181c522db455f6661",
                "title" : "Damned Pirates Society",
                "ticker" : "DPS",
                "image": "0xb6e9e605aa159017173caa6181c522db455f6661.png"
            },
            {
                "contract" : "0x1f953756a29d52f980038cbbff66375189075748",
                "title" : "VybezNFT",
                "ticker" : "VYBEZ",
                "image": "0x1f953756a29d52f980038cbbff66375189075748.png"
            },
            {
                "contract" : "0x4082d7b7a416554279148139ef0f707846b60dd9",
                "title" : " NFTrees",
                "ticker" : "🌳",
                "image": "0x4082d7b7a416554279148139ef0f707846b60dd9.webp"
            },
            {
                "contract" : "0x54148c4d47414aa12bd3fd60c9114d6f7ea0a972",
                "title" : "Moonarines",
                "ticker" : "MMAR",
                "image": "0x54148c4d47414aa12bd3fd60c9114d6f7ea0a972.jpeg"
            },
            {
                "contract" : "0x8236b2811c1a8f2b77707e11f9482d952aeda9cc",
                "title" : "MOONBRAT",
                "ticker" : "MBRAT",
                "image": "0x8236b2811c1a8f2b77707e11f9482d952aeda9cc.png"
            },
            {
                "contract" : "0xf868a89672232925226a608255218076cd989ad7",
                "title" : "MoonKeys",
                "ticker" : "MKEYS",
                "image": "0xf868a89672232925226a608255218076cd989ad7.png"
            },
            {
                "contract" : "0x65985e00bfd44c9850f275802095ae16aefc902b",
                "title" : "MoonriverPunks",
                "ticker" : "PUNK",
                "image": "0x65985e00bfd44c9850f275802095ae16aefc902b.png"
            },

            {
                "contract" : "0x56f4ca4f9dbb29c9438d9de48bd07f4b7fa765a3",
                "title" : "D`Apes",
                "ticker" : "DAPES",
                "image": "0x56f4ca4f9dbb29c9438d9de48bd07f4b7fa765a3.png"
            },
            {
                "contract" : "0x0f3a02fb8308b9c093f6f20ef6494c4c0488e044",
                "title" : "MidasDragons",
                "ticker" : "MIDAS",
                "image": "0x0f3a02fb8308b9c093f6f20ef6494c4c0488e044.jpg"
            },
            {
                "contract" : "0x609a0abc38a0aac1d20f001fa9c599db2932678f",
                "title" : "MoonSquitos",
                "ticker" : "MSQT",
                "image": "0x609a0abc38a0aac1d20f001fa9c599db2932678f.jpg"
            },
            {
                "contract" : "0x513d226142f788d6fb7737f7cd366b1c92c6168a",
                "title" : "Movr Role",
                "ticker" : "ROLE",
                "image": "0x513d226142f788d6fb7737f7cd366b1c92c6168a.gif"
            },
            {
                "contract" : "0x2d4a19b306a496be628469de820f0367a13178e5",
                "title" : "Neon Crisis V2",
                "ticker" : "NCR",
                "image": "0x2d4a19b306a496be628469de820f0367a13178e5.jpg"
            },
            {
                "contract" : "0xc433f820467107bc5176b95f3a58248c4332f8de",
                "title" : "NextGem",
                "ticker" : "NXGM",
                "image": "0xc433f820467107bc5176b95f3a58248c4332f8de.png"
            },
            {
                "contract" : "0x527dcb4dd5169ac018972df027c1133068b62fc7",
                "title" : "OBSOLETEPALS",
                "ticker" : "OPALS",
                "image": "0x527dcb4dd5169ac018972df027c1133068b62fc7.png"
            },
            {
                "contract" : "0x4fde28a4b169a5c19d4400214dc0d7cbfb1a6006",
                "title" : "SYMTRACTION",
                "ticker" : "SYMT",
                "image": "0x4fde28a4b169a5c19d4400214dc0d7cbfb1a6006.jpg"
            },
            {
                "contract" : "0x1D7A2C9345E25aBab6e2Ce11A4D03E66D05f79F7",
                "title" : "FIRUTOPICSx NFT",
                "ticker" : "FIRUTOP",
                "image": "0x1D7A2C9345E25aBab6e2Ce11A4D03E66D05f79F7.png"
            },
            {
                "contract" : "0x08716e418e68564C96b68192E985762740728018",
                "title" : "Zoombies",
                "ticker" : "Zoombies",
                "image": "0x08716e418e68564C96b68192E985762740728018.svg"
            },
            {
                "contract" : "0xD0df5418B1f30B1679Cb80Cce130EFf4Feb35d88",
                "title" : "MoonRocks NFT Club",
                "ticker" : "MNRK",
                "image": "0xD0df5418B1f30B1679Cb80Cce130EFf4Feb35d88.png"
            },
            {
                "contract" : "0x003967d80Bb2C4adcd2f1FC561a76b1bA630C770",
                "title" : "RivrMaid",
                "ticker" : "RivrMaid",
                "image": "0x003967d80Bb2C4adcd2f1FC561a76b1bA630C770.gif"
            },
            {
                "contract" : "0x2F26EfDb7233a014715ce6E895Aa67d846D93F1E",
                "title" : "MoonShroomiz",
                "ticker" : "MSHZ",
                "image": "0x2F26EfDb7233a014715ce6E895Aa67d846D93F1E.webp"
            },



        ]


        ;(async () => {
            try{
                const contractsInstances = [];
                for(var i = 0; i < nftCollections.length; i++){
                    contractsInstances.push(new web3Provider.eth.Contract(nftCollectionAbi, nftCollections[i].contract));
                }

                const balanceOfPromises = [];
                for(var i = 0; i < nftCollections.length; i++){
                    balanceOfPromises.push(contractsInstances[i].methods.balanceOf(walletAddress).call());
                }
                
                let balanceOfTemp = await Promise.allSettled(balanceOfPromises);

                const foundCollections = [];

                for(var i = 0; i < balanceOfTemp.length; i ++){
                    if(balanceOfTemp[i].status == "fulfilled"){
                        let nftCount = balanceOfTemp[i].value;
                        if(nftCount >= 1){
                            foundCollections.push({...nftCollections[i], "count": nftCount})
                        }
                    } 
                }

                showCollectionsList(foundCollections, walletAddress);
            }
            catch(error){
                showNotification('bottom-end', 'error', 'Error', `An error has occurred <br>Error mesage: <b>${error}</b>`)
            };
        })()

    }

}


function showCollectionsList(collections, walletAddress){
    collectionsListBlock.innerHTML = "";
    if(collections.length == 0){
        mynftsDivError.classList.remove("hidden");
        mynftsDivError.innerHTML = "This wallet does not have NFTs from whitelisted collections";
        inputWallet.removeAttribute("readonly");
        inputWallet.style.background = "#fff";
        searchBtn.classList.remove("hidden");
    } else {
        
        showLinkCreationBlock(collections, walletAddress);

        collectionsListBlock.classList.remove("hidden");
        collections.map((collection) => {
            collectionsListBlock.innerHTML += ` 
                <div class="collection">
                    <div class="image" style="background-image: url(./../images/collections/${collection.image});"></div>
                    <div class="info">
                        <p><b>${collection.title}</b></p>
                        <p>Balance: <b>${collection.count}</b> ${collection.ticker}</p>
                        <a class="btn view-nfts" data-contract="${collection.contract}" data-image="${collection.image}" data-title="${collection.title}" data-count="${collection.count}">View collection</a> 
                    </div>
                </div>
             `;
        })

        const viewCollectionBtns = document.querySelectorAll(".view-nfts");

        viewCollectionBtns.forEach((btn) => {
            btn.addEventListener("click", (e) =>{
                let collectionInfo = {}
                collectionInfo.contract = e.target.getAttribute("data-contract")
                collectionInfo.title = e.target.getAttribute("data-title")
                collectionInfo.image = e.target.getAttribute("data-image")
                collectionInfo.count = e.target.getAttribute("data-count")
                showOneCollection(collectionInfo, walletAddress)
                
            })
        })
    }
}



function showLinkCreationBlock(collections, walletAddress) {
    createLinkBlock.classList.remove("hidden");

    createLinkBlock.innerHTML = ` 
        <p style="text-align: center;"><b>Link for this collection:</b> <br><u><a target="_blank" href="${APP_LINK}/nfts.html?wallet=${walletAddress}">${APP_LINK}/nfts.html?wallet=${walletAddress}</a></u></p>
        <p style="text-align: center; margin: 20px 0px;">You can also create and share a user-friendly link for this collection: </p>
        <input id="linkName" type="text" placeholder="Link name (ex. 'John123')">
        <button id="createLinkBtn" >Create link</button>
        <p id="waitingLink" class="hidden" style="text-align: center; margin: 20px 0px; line-height: 30px;">Please wait...</p>
    `;
    const linkName = document.getElementById("linkName");
    const createLinkBtn = document.getElementById("createLinkBtn");
    const waitingLink = document.getElementById("waitingLink");
    
    waitingLink.classList.add("hidden");

    createLinkBtn.addEventListener("click", () => {
        mynftsDivError.classList.add("hidden");
        linkName.value = linkName.value.trim();

        let exist = false;

        (async () =>{

            if(linkName.value.trim() == ""){
                mynftsDivError.classList.remove("hidden");
                mynftsDivError.innerHTML = "Put a link name";
                linkName.focus();
                linkName.classList.add("error");
            }
            else {

                var validLinkRegEx = /^[a-z0-9]+$/i;
                if(!validLinkRegEx.test(linkName.value.trim())){
                    mynftsDivError.classList.remove("hidden");
                    mynftsDivError.innerHTML = "Put a valid link name (only letters and numbers)";
                    linkName.focus();
                    linkName.classList.add("error");
                }
                else {
                    let response = await fetch(`${serverUrl}/api/getOne/${linkName.value}`);
                    if(response.status == 200) {
                        const data = await response.json();

                        if(data.length){
                            linkName.value = linkName.value.trim();
                            mynftsDivError.classList.remove("hidden");
                            mynftsDivError.innerHTML = "Link with this name already exists !";
                            linkName.focus();
                            linkName.classList.add("error");
                        } else {
                            linkName.classList.remove("error");
                            linkName.removeAttribute("readonly");
                            createLink(linkName.value.trim(), collections, walletAddress)
                        }

                    } else {
                        linkName.value = linkName.value.trim();
                        mynftsDivError.classList.remove("hidden");
                        mynftsDivError.innerHTML = "Error fetch API";
                        linkName.focus();
                        linkName.classList.add("error");
                    }
                }
            }
            
        })();
    }) 
}


async function createLink(link, collections, walletAddress){
    const createLinkBtn = document.getElementById("createLinkBtn");
    const waitingLink = document.getElementById("waitingLink");
    createLinkBtn.classList.add("hidden");
    waitingLink.classList.remove("hidden");

    linkName.style.background = "#e0e0e0";
    linkName.setAttribute("readonly", "");
    linkName.style.background = "#fff";

    let result = await createLinkReq(link, walletAddress)
    if(result.wallet){
        linkName.classList.add("hidden");
        waitingLink.classList.add("succes");
        waitingLink.innerHTML = `<b>Succes ! </b><br>Created link: <u><a target="_blank" href="${APP_LINK}/showcase.html?link=${link}">${APP_LINK}/showcase.html?link=${link}</a></u>`;
    }
}


async function createLinkReq(link, wallet) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", `${serverUrl}/api/createLink`, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                  status: xhr.status,
                  statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        };
        xhr.send(JSON.stringify({"link": link, "wallet": wallet}));
  });
}



async function showOneCollection(collectionInfo, walletAddress){
    mainBlock.classList.add("hidden")
    oneCollectionBlock.classList.remove("hidden")
    oneCollectionBlock.innerHTML = "";
    oneCollectionBlock.innerHTML += `
        <button id="goBack">← Back</button><br>
        <div class="collectionImage" style="background-image: url(./../images/collections/${collectionInfo.image});"></div>
        <h1 class="collectionTitle">${collectionInfo.title}</h1>
        <p class="collectionAddress"><b>Contract:</b> <u><a target="_blank" href="https://moonriver.moonscan.io/address/${collectionInfo.contract}">${collectionInfo.contract.substr(0, 7)}...${collectionInfo.contract.substr(-7)}</a></u></p>
        <hr style="height: 3px;background: #888;margin: 23px 0px;">
        <h2>NFTs (${collectionInfo.count}):</h2>
    `;
    oneCollectionBlock.innerHTML += `<div id="nftsListBlock"></div>`

    document.getElementById("goBack").addEventListener("click", () =>{
        mainBlock.classList.remove("hidden");
        oneCollectionBlock.classList.add("hidden");
        oneCollectionBlock.innerHTML = "";
    })

    const nftsListBlock = document.getElementById("nftsListBlock");
    nftsListBlock.innerHTML = `<div class="lds-facebook"><div></div><div></div><div></div></div>`

    const nftsInfo = await getNfts(collectionInfo, walletAddress);
    nftsListBlock.innerHTML = "";

    nftsInfo.map((nft, index) => {
        nftsListBlock.innerHTML += ` 
            <div class="nft">
                <div class="image" style="background-image: url(${nft.image});"></div>
                <div class="info">
                    <p><b>${nft.name}</b></p>
                    <a class="btn view-details" data-index="${index}">View details</a> 
                </div>
            </div>
         `;
    })

    const viewNftDetailBtns = document.querySelectorAll(".view-details");

    viewNftDetailBtns.forEach((btn) => {
        btn.addEventListener("click", (e) =>{
            let nftData = nftsInfo[e.target.getAttribute("data-index")];
            let htmlContent = "";
            let attrCount = 0;

            if(nftData.attributes){
                if(!nftData.attributes.length && Object.keys(nftData.attributes).length > 3){
                    let attribute, attributeValue;
                    Object.keys(nftData.attributes).map((attr) => {
                        attribute = attr;
                        attributeValue = nftData.attributes[attribute];
                        if(attribute && attributeValue){
                            attrCount++;
                            htmlContent += `
                                <div class="nftAttribute">
                                    <p class="attribute">${attribute}</p>
                                    <p class="attributeValue">${attributeValue}</p>
                                </div>
                            `
                        }
                    })
                }
                else if(nftData.attributes.length){
                    nftData.attributes.map((attrArr) => {
                        
                        if(Object.keys(attrArr).length == 1){
                            attribute = Object.keys(attrArr)[0];
                            attributeValue = attrArr[Object.keys(attrArr)[0]];
                        } else {
                            attribute = attrArr['trait_type'];
                            attributeValue = attrArr['value'];
                        }

                        if(attribute && attributeValue){
                            attrCount++;
                            htmlContent += `
                                <div class="nftAttribute">
                                    <p class="attribute">${attribute}</p>
                                    <p class="attributeValue">${attributeValue}</p>
                                </div>
                            `
                        }
                    })
                } else {
                    
                }
            }
            Swal.fire({
                title: `${nftData.name}`,
                confirmButtonText: 'Close',
                html: ` 
                    <img src="${nftData.image}" alt="">
                    ${attrCount ? `<p style="margin: 20px 0px; font-size:20px; font-weight:bold; color:#000">Attributes:</p>` : `<p style="margin: 20px 0px; font-size:20px; font-weight:bold; color:#000">No attributes</p>`}
                    <div class="nftAttributesBlock">
                        ${htmlContent}
                    </div>
                `,
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
            item.image = item.image.replace("ipfs://", "https://ipfs.infura.io/ipfs/")
                .replace("https://ipfs.io/ipfs/", "https://ipfs.infura.io/ipfs/")
                .replace("https://gateway.pinata.cloud/ipfs/", "https://ipfs.infura.io/ipfs/")
            newArray.push(item);
        }
    });

    return newArray;
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


init();