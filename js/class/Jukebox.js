class Jukebox {

    constructor(app) {
       
       document.body.style.backgroundColor = "black";
       this.app = document.getElementById(app);
       this.app.style.cssText = "position: absolute; width: 1300px; top: 10px; left:10px; height: 750px; z-index: 1; background-size:cover; background-color:aqua";
       this.app.style.backgroundImage = 'url("images/interface/jukebox-interface.jpg")';
       
       this.btnsDiv = document.createElement('div'); // a div to hold the jukebox buttons
       this.btnsDiv.style.cssText = "position: absolute; width: 350px; height: 209px; left: 690px; top: 405px; z-index: 1;";
       this.app.appendChild(this.btnsDiv);
      
       this.sound = document.createElement('audio');
       this.sound.setAttribute("controls", "controls");
       this.sound.style.cssText = "position: absolute; width: 288px; top: 577px; left:690px; height: 30px; z-index: 1";
       this.sound.addEventListener("click", this.muteVolSlider.bind(this))
       this.sound.addEventListener("ended", this.playRandomSong.bind(this));       
       this.app.appendChild(this.sound)
        
       this.volspan = document.createElement('span')
       this.volspan.style.cssText = "position: absolute; width: 40px; top: 635px; left:700px; height: 20px; color:#FFF; z-index: 1; font-family:sans-serif; padding:5px 10px; letter-spacing:2px";
       this.volspan.innerHTML = 'VOL' 
       this.app.appendChild(this.volspan)
        
       this.volumeSlider = document.createElement('input')
       this.volumeSlider.type = "range"
       this.volumeSlider.style.cssText = "position: absolute; width: 160px; top: 635px; left:760px; height: 25px; z-index: 1";
       this.volumeSlider.addEventListener("change", this.setVolume.bind(this));       
       this.app.appendChild(this.volumeSlider)
       this.volumeSlider.value = 100
        
       this.voloutspan = document.createElement('span')
       this.voloutspan.style.cssText = "position: absolute; width: 40px; top: 635px; left:930px; height: 20px; color:#FFF; z-index: 1; font-family:sans-serif; padding:5px 10px; letter-spacing:2px";
       this.voloutspan.innerHTML = this.volumeSlider.value
       this.app.appendChild(this.voloutspan)
        
       this.muted = false
        
       this.songInfoDiv = document.createElement('div'); // for displaying song info
       this.songInfoDiv .style.cssText = "position: absolute; width: 300px; height: 100px; left: 240px; top: 80px; z-index: 1; color:#DDF; padding: 5px 10px 5px 20px; font-family: sans-serif; font-size: 0.9em; font-weight: bold; line-height: 1.75em;";
       this.app.appendChild(this.songInfoDiv)
       this.songInfoDiv.innerHTML = '<h3>Insert Coin to Random Play All</h3>'
          
       this.albumCoverDiv = document.createElement('div') // for holding album cover
       this.albumCoverDiv.style.cssText = "position: absolute; width: 300px; top: 275px; left: 185px; height: 320px; z-index: 1; background-size: cover; transform: perspective(200px) rotateY(5deg) rotateX(5deg);"
    
       this.app.appendChild(this.albumCoverDiv)
       this.currID = 0; // stores ID num (array index) of currently playing song
       this.isPlaying = false; // keep track of song playing or not
       this.albCovPath = ""; // to store the album cover of active song

       // drag and drop quarter functionality
       this.dropZone1 = document.createElement('div')
       this.dropZone1.style.cssText = "width:100px; height:100px"
       this.app.appendChild(this.dropZone1)
        
       this.coin = new Image()
       this.coin.src = "images/coins/tails.png"
       this.coin.id = "coin" 
       this.coin.draggable = "true"
       this.coin.style.cssText = "cursor:pointer; width:85px; margin:90px 100px"
       this.coin.addEventListener('dragstart', (event) =>
           event.dataTransfer.setData('text', event.target.id)
       )
       this.dropZone1.appendChild(this.coin)
        
       this.dropZone2 = document.createElement('div')
       this.dropZone2.style.cssText = "position:absolute; left:719px; top:143px; margin:50px; width:90px; height:90px; padding:27px 18px; border:0px solid aqua"
       this.dropZone2.addEventListener('dragover', function(event) {
           event.preventDefault()
       })
       this.dropZone2.addEventListener('drop', this.dropIt.bind(this))
       this.app.appendChild(this.dropZone2)   
                        
       this.songsArr = []   
       var xhr = new XMLHttpRequest()
        
       xhr.onreadystatechange = () => {  
            if(xhr.status == 200 && xhr.readyState == 4) { 
                this.songsArr = JSON.parse(xhr.responseText) 
                this.makeButtons()     
            }    
        }
        xhr.open("GET", "json/songs.json", true)
        xhr.send()
                    
    } // end constructor()
    
    dropIt(event) {
        
       event.preventDefault()
       let coinID = event.dataTransfer.getData('text')
       event.target.appendChild(document.getElementById(coinID))
       this.coin.src = "images/coins/heads.png"
       this.coin.style.margin = "0px"
       this.playRandomSong()
        
    }

    makeButtons() { 
        
        for(let i = 0; i < this.songsArr.length; i++) { // loop makes one button per song    
            let btn = document.createElement('button');
            btn.style.cssText = "width: 75px; height: 25px; padding: 10px; margin: 5px 5px 5px 13px; cursor: pointer; background-color: cadetblue;";
            btn.id = i; // file names are numbers, so assoc a num w each btn
            btn.addEventListener("click", this.playSong.bind(this)); // click btn, play song
            btn.addEventListener("mouseover", this.onBtnMouseOver.bind(this));
            btn.addEventListener("mouseout", this.onBtnMouseOut.bind(this));
            this.btnsDiv.appendChild(btn);     
        } // end for loop 
        
    } // makeButtons() 
    
    playSong() {  
        
        this.currID = event.target.id;
        this.sound.pause(); // stop any sound that is currently playing
        this.sound.addEventListener('ended', this.onSongEnded.bind(this));
        this.isPlaying = true;
        let currSong = "audio/" + this.songsArr[currID].songFile;
        this.sound.src= currSong; // set src to use this sound
        this.sound.play();
        this.songInfoDiv.innerHTML = `Song: ${this.songsArr[currID].song}
        <br/>Artist: ${this.songsArr[currID].artist} 
        <br/>Album: ${this.songsArr[currID].album}`;
        
        this.albumCoverDiv.style.backgroundImage = `url(images/albumArt/${this.songsArr[currID].albumCover})`;
        this.albCovPath = `url(images/albumArt/${this.songsArr[currID].albumCover})`;;
        
    } // playSong()
    
    onBtnMouseOver() { // when user mouses over button, this shows album cover
                                        
        this.albumCoverDiv.style.backgroundImage = `url(images/albumArt/${this.songsArr[event.target.id].albumCover})`;
        
    } // onBtnMouseOver() 
    
    onBtnMouseOut() { // when user mouses out, album cover is hidden. 
        
        if(this.isPlaying) { // if song is playing, mouseout restores its album cover
           this.albumCoverDiv.style.backgroundImage = this.albCovPath;
        } else {
            this.albumCoverDiv.style.backgroundImage = "none";
        }
        
    } // onBtnMouseOut()
    
    onSongEnded() { // runs when song ends
        
        this.isPlaying = false;
        this.albumCoverDiv.style.backgroundImage = "none";
        
    } // onSongEnded() 
    
    playRandomSong() {
        
        this.isPlaying = true;
        this.sound.pause(); // stop existing song, if there is one
        this.albumCoverDiv.style.backgroundImage = "none"; // clear old album cover, if any
        let randNum = Math.floor(Math.random() * this.songsArr.length); // rand num within // range of the array length -1; for 12 item songArr array, the randNum is in 0-11 range
        this.sound.src = `audio/${this.songsArr[randNum].songFile}`;
        this.sound.play(); 
        this.albCovPath = `url(images/albumArt/${this.songsArr[randNum].albumCover}`
        this.albumCoverDiv.style.backgroundImage = this.albCovPath;
        // remove the randNum only from array
        this.songInfoDiv.innerHTML = `Song: ${this.songsArr[randNum].song}
        <br/>Artist: ${this.songsArr[randNum].artist} 
        <br/>Album: ${this.songsArr[randNum].album}`;
        this.songsArr.splice(randNum, 1); // remove song from array so it's not repeated
        
    } // playRandomSong()
    
    setVolume() {
        let vol = this.volumeSlider.value
        this.sound.volume = vol / 100
        this.voloutspan.innerHTML = vol
        this.muted = false
    }
    
    muteVolSlider() {
        if(!this.muted) { // if not muted, mute it
            this.volumeSlider.value = 0
            this.voloutspan.innerHTML = '0'
        } else { // was muted, so un-mute
            let vol = Math.floor(this.sound.volume*100)
            this.volumeSlider.value = vol
            this.voloutspan.innerHTML = vol
        }
        this.muted = !this.muted
    }
 
} // end Jukebox() Class
