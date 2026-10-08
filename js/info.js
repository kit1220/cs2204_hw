document.addEventListener('DOMContentLoaded', function() {
    const messages = [
        "Optical Sensing Division has 8 openings for PhD researchers! Develop next-gen imaging systems.",
        "Bio-Sensing Group offers 5 internship positions in medical sensor development for researchers!",
        "Apply now for the precious opportunities to get a invaluable experience!" 
    ];
    
    const promotionElement = document.getElementById('promotionMsg');
    
    let currentMsgIndex = Math.floor(Math.random() * messages.length);
    promotionElement.textContent = messages[currentMsgIndex];
    
    setInterval(() => {
        currentMsgIndex = (currentMsgIndex + 1) % messages.length;
        promotionElement.textContent = messages[currentMsgIndex];
    }, 3000);
    
    const videoElement = document.getElementById('mainVideo');
    const mp4Source = document.getElementById('player1');
    const webmSource = document.getElementById('player2');
    
    const videoSources = [
        {
            mp4: "https://personal.cs.cityu.edu.hk/~cs2204/2025/video/video1.mp4",
            webm: "https://personal.cs.cityu.edu.hk/~cs2204/2025/video/video1.webm"
        },
        {
            mp4: "https://personal.cs.cityu.edu.hk/~cs2204/2025/video/video2.mp4",
            webm: "https://personal.cs.cityu.edu.hk/~cs2204/2025/video/video2.webm"
        }
    ];
    
    let currentVideoIndex = 0;
    

    function loadVideo(index) {
        webmSource.src = videoSources[index].webm;
        mp4Source.src = videoSources[index].mp4;
        console.log("load")
        videoElement.load();
        videoElement.play();
    }
    
    loadVideo(currentVideoIndex);
    

    videoElement.addEventListener('ended', function() {
        console.log(1)
        currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
        loadVideo(currentVideoIndex);
    });
});