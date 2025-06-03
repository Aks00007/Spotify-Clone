let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    const response = await fetch("/songs/songs.json");
    const songs = await response.json(); // Parse JSON array
    return songs;
}

const playMusic = (track, showName = true) => {
    currentSong.src = "/songs/" + encodeURIComponent(track);
    currentSong.play();
    play.src = "/assets/pause.svg";
    if (showName) {
        document.querySelector(".songinfo").innerHTML = track;
    } else {
        document.querySelector(".songinfo").innerHTML = "";
    }
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
    // Getting the list of all songs
    songs = await getSongs();

    // Remove auto-play for the first song on page load
    currentSong.pause();
    play.src = "/assets/play.svg";

    // Displaying songs in playlist
    let songUL = document.querySelector(".songList ul");
    for (const song of songs) {
        songUL.innerHTML += `<li>
            <img src="/assets/music.svg" alt="music" style="height: 20px; filter: invert();">
            <div class="info">
                <div>${song}</div>
            </div>
            <div class="playNow">
                <img src="/assets/play.svg" alt="play" style="height: 30px;">
            </div>
        </li>`;
    }

    // Attaching event listeners to each song in the playlist
    document.querySelectorAll(".songList li").forEach((e) => {
        e.addEventListener("click", () => {
            let songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playMusic(songName);
        });
    });

    // Attaching event listeners to play, next, and previous
    play.addEventListener("click", () => {
        play.style.opacity = 0.5;
        setTimeout(() => {
            if (currentSong.paused) {
                currentSong.play();
                play.src = "/assets/pause.svg";
            } else {
                currentSong.pause();
                play.src = "/assets/play.svg";
            }
            play.style.opacity = 1;
        }, 200);
    });

    previous.addEventListener("click", () => {
        let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").pop()));
        if (index > 0) playMusic(songs[index - 1]);
    });

    next.addEventListener("click", () => {
        let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").pop()));
        if (index < songs.length - 1) playMusic(songs[index + 1]);
    });

    // Listening for time update event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Adding event listener to the seek bar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    // Adding event listener to hamburger
    const hamburger = document.querySelector(".hamburger");
    const mainLeft = document.querySelector(".main-left");
    hamburger.addEventListener("click", () => {
        const isOpen = mainLeft.style.left === "0px";
        mainLeft.style.left = isOpen ? "-100%" : "0";
        hamburger.style.opacity = 0;
        setTimeout(() => {
            hamburger.src = isOpen ? "/assets/hamburger.svg" : "/assets/cross.svg";
            hamburger.style.opacity = 1;
        }, 150);
    });

    // Adding event listener to each .card for song selection
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            const songName = card.getAttribute("data-song");
            if (songName) {
                playMusic(songName);
            }
        });
    });
}

main();
