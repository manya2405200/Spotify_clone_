// Music library with song data
const songs = [
    {
        id: 1,
        name: "Summer Vibes",
        artist: "The Melody Makers",
        filePath: "music.mp3",
        coverPath: "a.jpg"
    },
    {
        id: 2,
        name: "Night Dreams",
        artist: "Luna Echo",
        filePath: "music2.mp3",
        coverPath: "b.jpg"
    },
    {
        id: 3,
        name: "Electric Feel",
        artist: "Synth Wave",
        filePath: "music.mp3",
        coverPath: "c.jpg"
    },
    {
        id: 4,
        name: "Chill Lofi",
        artist: "Beats Studio",
        filePath: "music2.mp3",
        coverPath: "d.jpg"
    },
    {
        id: 5,
        name: "Ocean Waves",
        artist: "Nature Sounds",
        filePath: "music.mp3",
        coverPath: "e.jpg"
    }
];

// Featured albums
const albums = [
    { name: "Summer Collection", artist: "Various Artists", cover: "a.jpg" },
    { name: "Night Vibes", artist: "Chill Masters", cover: "b.jpg" },
    { name: "Electronic Dreams", artist: "Synth Wave", cover: "c.jpg" },
    { name: "Lofi Coffee", artist: "Beats Studio", cover: "d.jpg" },
    { name: "Nature Sounds", artist: "Earth Tones", cover: "e.jpg" },
    { name: "Jazz Nights", artist: "Jazz Legends", cover: "a.jpg" }
];

// DOM Elements
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const progressSlider = document.getElementById('progressSlider');
const volumeSlider = document.getElementById('volumeSlider');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const playerSongName = document.getElementById('playerSongName');
const playerArtistName = document.getElementById('playerArtistName');
const playerAlbumArt = document.getElementById('playerAlbumArt');
const songsGrid = document.getElementById('songsGrid');
const albumsGrid = document.getElementById('albumsGrid');
const nowPlayingSong = document.getElementById('nowPlayingSong');
const nowPlayingArtist = document.getElementById('nowPlayingArtist');
const albumArt = document.getElementById('albumArt');
const spinner = document.getElementById('spinner');

// Player State
let currentSongIndex = 0;
let isPlaying = false;
let shuffle = false;
let repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one
let originalOrder = [...Array(songs.length).keys()];
let playOrder = [...originalOrder];

// Initialize player
function init() {
    populateSongsGrid();
    populateAlbumsGrid();
    updatePlayerDisplay();
    setupEventListeners();
    setVolume();
}

// Populate songs grid
function populateSongsGrid() {
    songsGrid.innerHTML = songs.map((song, index) => `
        <div class="song-card" data-index="${index}">
            <img src="${song.coverPath}" alt="${song.name}">
            <h3>${song.name}</h3>
            <p>${song.artist}</p>
            <div class="play-overlay" onclick="playSong(${index})">
                <i class="fas fa-play"></i>
            </div>
        </div>
    `).join('');
}

// Populate albums grid
function populateAlbumsGrid() {
    albumsGrid.innerHTML = albums.map((album, index) => `
        <div class="album-card">
            <img src="${album.cover}" alt="${album.name}">
            <h3>${album.name}</h3>
            <p>${album.artist}</p>
            <div class="play-overlay" onclick="playSong(${index % songs.length})">
                <i class="fas fa-play"></i>
            </div>
        </div>
    `).join('');
}

// Play specific song
function playSong(index) {
    currentSongIndex = index;
    audioPlayer.src = songs[currentSongIndex].filePath;
    audioPlayer.play();
    isPlaying = true;
    updatePlayerDisplay();
    updatePlayButton();
    spinner.classList.add('active');
}

// Toggle play/pause
function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        spinner.classList.remove('active');
    } else {
        audioPlayer.play();
        isPlaying = true;
        spinner.classList.add('active');
    }
    updatePlayButton();
}

// Play next song
function playNext() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
}

// Play previous song
function playPrev() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
}

// Toggle shuffle
function toggleShuffle() {
    shuffle = !shuffle;
    shuffleBtn.classList.toggle('active', shuffle);
    if (shuffle) {
        playOrder = originalOrder.sort(() => Math.random() - 0.5);
    } else {
        playOrder = [...originalOrder];
    }
}

// Toggle repeat
function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    repeatBtn.classList.toggle('active', repeatMode > 0);
    updateRepeatIcon();
}

// Update repeat icon
function updateRepeatIcon() {
    if (repeatMode === 2) {
        repeatBtn.innerHTML = '<i class="fas fa-redo" style="font-size: 12px; position: relative; top: 1px;">1</i>';
    } else {
        repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
    }
}

// Format time
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update player display
function updatePlayerDisplay() {
    const song = songs[currentSongIndex];
    playerSongName.textContent = song.name;
    playerArtistName.textContent = song.artist;
    playerAlbumArt.src = song.coverPath;
    nowPlayingSong.textContent = song.name;
    nowPlayingArtist.textContent = `by ${song.artist}`;
    albumArt.src = song.coverPath;
}

// Update play button
function updatePlayButton() {
    if (isPlaying) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

// Update progress bar
function updateProgress() {
    if (audioPlayer.duration) {
        progressSlider.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
}

// Set progress
function setProgress(e) {
    const percent = e.target.value / 100;
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

// Set volume
function setVolume() {
    audioPlayer.volume = volumeSlider.value / 100;
    updateVolumeSliderBackground();
}

// Update volume slider background
function updateVolumeSliderBackground() {
    const percent = volumeSlider.value;
    volumeSlider.style.background = `linear-gradient(to right, #1DB954 0%, #1DB954 ${percent}%, #404040 ${percent}%, #404040 100%)`;
}

// Setup event listeners
function setupEventListeners() {
    playBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    progressSlider.addEventListener('input', setProgress);
    volumeSlider.addEventListener('input', setVolume);

    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audioPlayer.duration);
    });
    audioPlayer.addEventListener('ended', () => {
        if (repeatMode === 2) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            playNext();
        }
    });

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const songCards = document.querySelectorAll('.song-card');
            songCards.forEach(card => {
                const songName = card.querySelector('h3').textContent.toLowerCase();
                const artistName = card.querySelector('p').textContent.toLowerCase();
                card.style.display = songName.includes(query) || artistName.includes(query) ? 'block' : 'none';
            });
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlayPause();
        }
        if (e.code === 'ArrowRight') playNext();
        if (e.code === 'ArrowLeft') playPrev();
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);

