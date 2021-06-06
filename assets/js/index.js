const SERVER_URL = "https://poemexyz.herokuapp.com/api/getPoem"
var isPlaying  = false;
var audio;

const app=()=>{
	fetch(SERVER_URL)
	.then(response=>response.json())
	.then(res=>{
		console.log(res.id)
		document.querySelector("#wrapper").classList.remove("invisible")
		document.querySelector("#loader").classList.add("invisible")
		document.querySelector("#poemName").innerText = res.name.replace(/[\["'\]]/g, "");
		document.querySelector("#poem").innerText = res.poem
		document.querySelector("#poemAuthor").innerText = res.author
		document.querySelector("#recite-btn").addEventListener("click",()=>{
			if(!isPlaying){
				isPlaying = true;
				document.querySelector("#recite-btn").innerText = "Stop"
				recite(res.id);
			}
			else{
				isPlaying = false;
				document.querySelector("#recite-btn").innerText = "Recite"
				window.speechSynthesis.cancel();
			}
		})
	})
}

const say = (m) => {
	let msg = new SpeechSynthesisUtterance();
	let voices = window.speechSynthesis.getVoices();
	msg.voice = voices[2];
	msg.voiceURI = "native";
	msg.volume = 0.8;
	msg.rate = 1;
	msg.text = m;
	msg.lang = 'en-US';
	speechSynthesis.speak(msg);
	msg.onstart = () => {
		audio.volume = 0.2;
	}
	msg.onend = () => {
		audio.volume = 0.5;
	}
}

const recite = (id) => {
	window.speechSynthesis.cancel();
	let lines;
	fetch(`${SERVER_URL}/${id}`)
	.then(response=>response.json())
	.then(res=>{
		lines = res.Poem.split("\n");
		if(res.Poem.length===1){
			lines = res.Poem.split(".")
		}
		lines.forEach((line)=>{
			say(line)
		})
	})
}



window.onload=()=>{
	audio = new Audio("assets/audio/bg.mp3");
	audio.play();
	audio.loop = true;
	audio.volume = 0.5;
    app()
}
