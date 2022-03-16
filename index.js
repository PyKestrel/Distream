/*
Creator: PyKestrel (https://github.com/PyKestrel)
Date Started: 3/12/22
Description: Client-Side Only IPTV Streamer, Using IPTV-ORG JSON files
*/


//Initializing Variables

//Initialize Channel Player/Base Code
async function init(){
    let channelList = [];
    let response = await fetch('https://iptv-org.github.io/api/streams.json');
    let json = await response.json();
    let responsePics = await fetch('https://iptv-org.github.io/api/channels.json');
    let jsonPics = await responsePics.json();
    index = 0;
    indexPics = 0;
    var menuDiv = document.getElementById("menuDiv");
    console.log(json.length)
    while(index < 500){
        // Try Catch Used To Resolve Some Other Errors That Cant Be Caught In An If Statement
        try{
            // Grab Source Link And Check It
            let srcCheck = await fetch(json[index].url);
            //let filter = jsonPics.filter(d => d.id === json[index].channel);
            // Check To See If Source Is Valid
            if(srcCheck.ok && srcCheck.status != 403){
                var channelImage
                checkSum = true
                while(checkSum){
                    let filter = await jsonPics.filter(d => d.id === json[indexPics].channel);
                    if(filter.length){
                        console.log(filter[0].logo);
                        checkSum = false
                        channelImage = filter[0].logo
                    }
                    indexPics++
                }
                menuDiv.innerHTML+=`<div class="menuStreamBox"><img src="${channelImage}"> <a data-link="${json[index].url}" href="#" onclick="initPlayer(this)">${json[index].channel}</a></div>`
                index++;
            }else{
                console.log("Error: Skipping Channel");
                index++;
            }   
        }catch{
            console.log("Unspecified Error: Skipping Channel")
            index++ 
        } 
    }
    /*
    channelList.forEach(function(x){
        if(index < 200){
            menuDiv.innerHTML+=`<div class="menuStreamBox"><a data-link="${x.url}" href="#" onclick="initPlayer(this)">${x.channel}</a></div>`
            index++   
        }
    });
    */
    //Interact With VideoJS Player
    //var player = videojs('vid1');
    //Change The Source
    //player.src(json[50].url)
    // Load New Source
    //player.load()
    // Play
    //player.play()
}

//Clear Menu
 function clearMenu(){
    document.getElementById("menuDiv").innerHTML = '';
 }

async function initPlayer(url){
    console.log(url.getAttribute("data-link"))
    var player = videojs('vid1');
    player.src(url.getAttribute("data-link"))
    player.load()
    player.play()
}


//Channel Numbers

let chanNum = 0;

async function channelNumber(num){
    chanNum = num;
    let response = await fetch('https://iptv-org.github.io/api/streams.json');
    let json = await response.json();
    var player = videojs('vid1');
    player.src(json[num].url)
    player.load()
    player.play()
}


async function nextChan(){
    let checkSum = true;
    chanNum++;
    let response = await fetch('https://iptv-org.github.io/api/streams.json');
    let json = await response.json();
    // While Loop Used To Loop Through Channels
    while(checkSum){
        // Try Catch Used To Resolve Some Other Errors That Cant Be Caught In An If Statement
        try{
            // Grab Source Link And Check It
            let srcCheck = await fetch(json[chanNum].url);
            // Check To See If Source Is Valid
            if(srcCheck.ok && srcCheck.status != 403){
                checkSum = false;
                var player = videojs('vid1');
                player.src(json[chanNum].url)
                player.load()
                player.play()  
            }else{
            console.log("Error: Skipping Channel")
            chanNum++
            }   
        }catch{
            console.log("Unspecified Error: Skipping Channel")
            chanNum++ 
        } 
    }
    
}

async function lastChan(){
    let checkSum = true;
    chanNum--;
    let response = await fetch('https://iptv-org.github.io/api/streams.json');
    let json = await response.json();
    // While Loop Used To Loop Through Channels
    while(checkSum){
        // Try Catch Used To Resolve Some Other Errors That Cant Be Caught In An If Statement
        try{
            // Grab Source Link And Check It
            let srcCheck = await fetch(json[chanNum].url);
            // Check To See If Source Is Valid
            if(srcCheck.ok && srcCheck.status != 403){
                checkSum = false;
                var player = videojs('vid1');
                player.src(json[chanNum].url)
                player.load()
                player.play()  
            }else{
            console.log("Error: Skipping Channel")
            chanNum--
            }   
        }catch{
            console.log("Unspecified Error: Skipping Channel")
            chanNum--
        }
    }
}

// Channel Searches

// Channel Search Name
async function channelSearch(chan){
    let response = await fetch('https://iptv-org.github.io/api/streams.json');
    let json = await response.json();
    let index = 0;
    json.forEach(function(x){
        query = new RegExp(chan.toString(),'i');
        if(x.channel.search(query) != -1){
            console.log(x.channel);
            console.log(x.url);
            console.log(index)
        }
        index++
    });
}

// Channel Search Number
async function channelSearchNum(chan){
    let response = await fetch('https://iptv-org.github.io/api/streams.json');
    let json = await response.json();
    console.log(json[chan].channel)
    console.log(json[chan].url)
}

// Channel Filters

async function filterChannel(type, value){
    let channelList = [];
    // Fetch Channel List
    let response = await fetch('https://iptv-org.github.io/api/channels.json');
    let json = await response.json();
    let tempChannelList = [];
    // Check What Type Of Filter Was Chosen
    switch(type){
        case "Country":
            json.forEach(function(x){
                if (x.country == value){
                    tempChannelList.push(x)
                }
            });
            break;
        case "Language":
            json.forEach(function(x){
                if (x.languages == value.toLowerCase()){
                    tempChannelList.push(x)
                }
            });
            break;
        case "NSFW":
            json.forEach(function(x){
                if (x.is_nsfw == true){
                    tempChannelList.push(x)
                }
            });
            break;
    }
    // Fetch List Of Streams
    response = await fetch('https://iptv-org.github.io/api/streams.json');
    json = await response.json();
    index = 0;
    var menuDiv = document.getElementById("menuDiv");
    menuDiv.innerHTML = '';
    // Iterate Through Every Stream
    await json.forEach(function(x){
        try{
            // Use Filter To Check If A Filtered Channel Exists In The Stream List
            let filter = tempChannelList.filter(d => d.id === x.channel);
            // Filter Returns An Array If A Channel Is Found, So Check If Array Has A Length Or Not
            if(filter.length){
                console.log("Appending")
                channelImage = filter[0].logo;
                // Add Channel To List Of Channels We Filtered
                if(index < 1000){
                    menuDiv.innerHTML+=`<div class="menuStreamBox"><img src="${channelImage}"><a data-link="${json[index].url}" href="#" onclick="initPlayer(this)">${json[index].channel}</a></div>`
                }
                channelList.push(json[index]);
            }
            index++
        }
        catch{
            index++
        }
    })
}