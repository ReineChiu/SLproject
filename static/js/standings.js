document.title = "StoveLeague";
const url = "api/getranking";
const errorBox = document.querySelector(".error-box");
const sendBtn = document.querySelector(".send-btn");
const playerMenu = document.querySelector(".player-menu");
const formData = new FormData();

const fieldYearTitle = document.querySelector(".field-year-title");
const pitchYearTitle = document.querySelector(".pitch-year-title");
formData.append("fieldyear", fieldYearTitle.textContent);
formData.append("pitchyear", pitchYearTitle.textContent);
const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;

const imgUrl = "https://d2pr862w3j3gq8.cloudfront.net/stoveleague/"
const backgroundImg = document.querySelector(".background-image");
const bgImg = document.createElement("img");
bgImg.src = imgUrl+"background2.png"; 
bgImg.classList.add("backimages");
backgroundImg.appendChild(bgImg);

const getData = (url, csrftoken, formData) => {
    return fetch(url, {
      method: "POST",
      headers: {
        'X-CSRFToken': csrftoken
      },
      body: formData
    }).then(response => response.json())
}  
const checkData = (url) => {
    return fetch(url, {
      method: "GET",
      headers:{
        "content-Type":"application/json",
        'X-Requested-With': 'XMLHttpRequest'
    }   
    }).then(response => response.json())
}  
// ============ 建立比對隊名-圖片function ============== //
const setTeamImg = (item, type, posRankImg) => {
    if (item.team === 1){
        image = "lions.png";
    } else if (item.team === 2){
        image = "elephant.png";
    } else if (item.team === 3){
        image = "sinon.png";
    } else if (item.team === 4){
        image = "wheel.png";
    } else if (item.team === 5){
        image = "first.png";
    } else if (item.team === 6){
        image = "macoto.png";
    } else if (item.team === 7){
        image = "trex.png";
    } else if (item.team === 8){
        image = "lamigo.png";
    } else if (item.team === 9){
        image = "rhino.png";
    } else if (item.team === 10){
        image = "brothers.png";
    } else if (item.team === 11){
        image = "guardians.png";
    } else if (item.team === 12){
        image = "dragons.png";
    } else if (item.team === 13){
        image = "rakuten.png";
    } 
    if (type === 'field') {
        posRankImg.src = imgUrl + image;
    } else if (type === 'pitch') {
        posRankImg.src = imgUrl + image;
    } else {
        posRankImg.src = imgUrl + image;
    }
}

// ============ 取得打者排行 ============== //
const updateFieldRank = (rankData) => {
    const field = rankData.field;
    const fieldRank = document.querySelector(".fieldrank");
    while (fieldRank.hasChildNodes()){ 
        fieldRank.removeChild(fieldRank.firstChild);
    }
    field.forEach(item =>{
        const fieldRankBar = document.createElement("div");
        const fieldRankImg = document.createElement("img");
        const fieldRankName = document.createElement("div");
        const fieldRankAvg = document.createElement("div"); 
        fieldRankName.textContent = item.fielder_name;
        fieldRankAvg.textContent = item.AVG;
        fieldRankImg.classList.add("rank-img");
        fieldRankName.classList.add("rank-name");
        fieldRankAvg.classList.add("rank-avg");
        fieldRankBar.classList.add("rank-bar");
        fieldRankBar.append(fieldRankImg);
        fieldRankBar.append(fieldRankName);
        fieldRankBar.append(fieldRankAvg);
        fieldRank.append(fieldRankBar);

        setTeamImg(item, 'field', fieldRankImg)
    })
}
getData(url, csrftoken, formData).then((data) => {
    updateFieldRank(data)
})

// ============ 取得投手排行 ============== //
const updatePitchRank = (rankData) => {
    const pitch = rankData.pitch;
    const pitchRank = document.querySelector(".pitchrank");
    while (pitchRank.hasChildNodes()){ 
        pitchRank.removeChild(pitchRank.firstChild);
    }
    pitch.forEach(item =>{           
        const pitchRankBar = document.createElement("div");
        const pitchRankImg = document.createElement("img");
        const pitchRankName = document.createElement("div");
        const pitchRankAvg = document.createElement("div");
        pitchRankName.textContent = item.pitcher_name;
        pitchRankAvg.textContent = item.ERA;
        pitchRankImg.classList.add("rank-img");
        pitchRankName.classList.add("rank-name");
        pitchRankAvg.classList.add("rank-avg");
        pitchRankBar.classList.add("rank-bar");
        pitchRankBar.append(pitchRankImg);
        pitchRankBar.append(pitchRankName);
        pitchRankBar.append(pitchRankAvg);
        pitchRank.append(pitchRankBar);

        setTeamImg(item, 'pitch', pitchRankImg)
    })   
}
getData(url, csrftoken, formData).then((data) => {
    updatePitchRank(data)
})


// ============ 即時輸入 ============== //
const inputText = document.getElementById("search-text");
const errorTip = document.createElement("div");

inputText.addEventListener("input", (e)=>{
    e.stopPropagation();
    const instantText = e.target.value
    while (playerMenu.hasChildNodes()){ 
        playerMenu.removeChild(playerMenu.firstChild);
    }
    formData.append("name", instantText);
    const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    errorBox.style.display = "none";

    getData("api/getplayername", csrftoken, formData).then((data) => {
        if ("ok" in data){
            data.data.forEach(ele =>{
                const playerItem = document.createElement("div");
                const inputPlayerTeam = document.createElement("img");
                const inputPlayerName = document.createElement("div");
                playerItem.classList.add("player-item");
                inputPlayerTeam.classList.add("team-image");
                inputPlayerName.textContent = ele.player_name;
                inputPlayerName.classList.add("input-player-name");
                inputPlayerName.setAttribute("data-serial", ele.id);
                playerItem.appendChild(inputPlayerTeam);
                playerItem.appendChild(inputPlayerName);
                playerMenu.appendChild(playerItem);
                playerMenu.style.display = "block";

                // === 模糊比對 隊名&圖示 === //
                setTeamImg(ele, 'search', inputPlayerTeam)

                const newName = document.querySelectorAll(".input-player-name");
                newName.forEach(item =>{
                    item.addEventListener("click", (e) => {
                        e.stopPropagation();
                        const chooseName = e.target.textContent.trim();
                        const chooseId = e.target.getAttribute('data-serial');
                        const url = `api/checkplayer?num=${chooseId}&name=${chooseName}`;
                        checkData(url).then((data) => {
                            if ("ok" in data){
                                location.href =`player?num=${chooseId}`;

                            }else{
                                playerMenu.style.display = "none";
                                errorBox.style.display = "flex";
                                errorTip.textContent = "這樣是查不到球員滴～\n<般耶波羅密>";
                                errorTip.classList.add("error-name");
                                errorBox.appendChild(errorTip);
                            }

                        })
                    })
                })
            })
        } 
    })
})

inputText.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        formData.append("name", inputText.value);
        const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        getData("api/getplayername", csrftoken, formData).then((data) => {
            if ("error" in data){
                errorBox.style.display = "block";
                errorTip.textContent = "沒有這個球員";
                errorTip.classList.add("error-name");
                errorBox.appendChild(errorTip);
            }
        })
    }
})


// ================= 年度排行榜 ================= //
const fieldYearsMenu = document.querySelector(".field-years-frame");
const pitchYearsMenu = document.querySelector(".pitch-years-frame");

const years = Array.from({length: 20}, (_, i) => 2022 - i);

years.forEach(ele =>{
    const year = document.createElement("div");
    year.textContent = ele;
    year.classList.add("fieldyear")
    fieldYearsMenu.appendChild(year);
})
years.forEach(ele =>{
    const year = document.createElement("div");
    year.textContent = ele;
    year.classList.add("pitchyear")
    pitchYearsMenu.appendChild(year);
})
const fieldYear = document.getElementById("fieldarrow");
fieldYear.addEventListener("click", (e) =>{
    fieldYearsMenu.style.display = "block";
    e.stopPropagation();
})
const pitchYear = document.getElementById("pitcharrow");
pitchYear.addEventListener("click", (e) =>{
    pitchYearsMenu.style.display = "block";
    e.stopPropagation();
})
document.addEventListener("click",(e) =>{
    fieldYearsMenu.style.display = "none";
    pitchYearsMenu.style.display = "none";
    e.stopPropagation();
});
fieldYearsMenu.addEventListener("click",(event) =>{
    event.stopPropagation();
})
pitchYearsMenu.addEventListener("click",(event) =>{
    event.stopPropagation();
})

const allfieldyear = document.querySelectorAll(".fieldyear");
allfieldyear.forEach(item =>{
    item.addEventListener("click", (e) =>{
        fieldYearTitle.textContent = e.target.textContent;
        formData.append("fieldyear", fieldYearTitle.textContent);
        const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        getData(url, csrftoken, formData).then((data) => {
            updateFieldRank(data)
        }) 
    })
})
const allpitchyear = document.querySelectorAll(".pitchyear");
allpitchyear.forEach(item =>{
    item.addEventListener("click", (e) =>{
        pitchYearTitle.textContent = e.target.textContent;
        formData.append("pitchyear", pitchYearTitle.textContent);
        const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
        getData(url, csrftoken, formData).then((data) => {
            updatePitchRank(data)
        }) 
    })
})
// ================= 查看年度排行 ================= //
const fieldAnnualBtn = document.getElementById("field-annual");
const pitchAnnualBtn = document.getElementById("pitch-annual");

const clickAnnualBtn = (btnItem, pos) =>{
    let yearTitle;
    if (pos === 'field') {
        yearTitle = document.querySelector(".field-year-title");
    } else if (pos === 'pitch') {
        yearTitle = document.querySelector(".pitch-year-title");
    }
    btnItem.addEventListener("click",()=>{
        const annual = yearTitle.textContent;
        const url = `api/annual?pos=${pos}&annual=${annual}`;
        checkData(url).then((data) => {
            if ("ok" in data) {
                location.href = `annual?pos=${pos}&annual=${annual}`;
            } else {
                location.href = "/";
            }
        });
    })
}
clickAnnualBtn(fieldAnnualBtn, "field");
clickAnnualBtn(pitchAnnualBtn, "pitch");

// ================= 顯示時間 ================= //
const today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();
currentday = yyyy + '-' + mm + '-' + dd;

// ================= 顯示比賽資訊 ================= //
const gameCalendarBox = document.querySelector(".game-calendar-box");
const leftBtn = document.querySelector(".fa-chevron-left");
const rightBtn = document.querySelector(".fa-chevron-right");
leftBtn.addEventListener('click', function() {
    gameCalendarBox.scrollLeft -= 180; 
});
rightBtn.addEventListener('click', function() {
    gameCalendarBox.scrollLeft += 180;  
});
const noGame = document.querySelector(".no-game");
const gameDetail = document.querySelector(".game-detail");

const gameTime = document.querySelector(".time");
const gameLocation = document.querySelector(".location");
const guestTeam = document.getElementById("guest-team");
const guestScore = document.getElementById("guest-score");
const homeTeam = document.getElementById("home-team");
const homeScore = document.getElementById("home-score");
const guestPitch = document.querySelector(".guest-pitch");
const homePitch = document.querySelector(".home-pitch");
const winPitch = document.querySelector(".win-pitch");
const losePitch = document.querySelector(".lose-pitch");
const mvp = document.querySelector(".mvp");

const guestError = document.querySelector(".guest-error");
const homeError = document.querySelector(".home-error");

gameTime.textContent = currentday;
fetch(`api/getgame`).then(response => response.json()).then((data) => {
    data.data.forEach(item =>{
        let date = new Date(item.date); 
        let weekday = ['日', '一', '二', '三', '四', '五', '六'];
        let week = weekday[date.getUTCDay()];
        let year = date.getUTCFullYear();
        let month = String(date.getUTCMonth() + 1).padStart(2, '0'); 
        let day = String(date.getUTCDate()).padStart(2, '0');
        let hours = date.getUTCHours();
        let minutes = String(date.getUTCMinutes()).padStart(2, '0');
        let gameDate = `${year}.${month}.${day} (${week})`;
        let gameTime = `${hours}:${minutes}`;

        if (date >= new Date()){
            const gameCalendar = document.createElement('div');
            gameCalendar.classList.add('game-calendar');
            const gamePlayDate = document.createElement('div');
            const gamePlayTime = document.createElement('div');
            const guestTeam = document.createElement('div');
            const homeTeam = document.createElement('div');
            gamePlayDate.textContent = gameDate;
            gamePlayDate.classList.add('game-play-date');
            gamePlayTime.textContent = gameTime;
            gamePlayTime.classList.add('game-play-time');
            guestTeam.textContent = item.guestTeam;
            guestTeam.classList.add('text');
            homeTeam.textContent = item.homeTeam;
            homeTeam.classList.add('text');
            if (item.guestTeam.includes('Taipei') || item.homeTeam.includes('Taipei')) {
                guestTeam.classList.add('text-color');
                homeTeam.classList.add('text-color');
            }
            gameCalendar.appendChild(gamePlayDate);
            gameCalendar.appendChild(gamePlayTime);
            gameCalendar.appendChild(guestTeam);
            gameCalendar.appendChild(homeTeam);

            gameCalendarBox.appendChild(gameCalendar);
        }

        if (date.getDate() === today.getDate()) {
            console.log('日期相同');
            noGame.style.display = 'none';
            gameDetail.style.display = 'block';
            gameLocation.textContent = 'MLB'
            guestTeam.textContent = item.guestTeam;
            guestScore.textContent = item.guestScore;
            homeTeam.textContent = item.homeTeam;
            homeScore.textContent = item.homeScore;
            guestPitch.textContent = '安打：'+ item.location; 
            homePitch.textContent =  '安打：'+ item.homePitch; 
            winPitch.textContent = '勝投：'+item.winPitch;
            losePitch.textContent = '敗投：'+item.losePitch;
            guestError.textContent = '失誤：'+item.mvp;
            homeError.textContent = '失誤：'+item.guestPitch;
        } else {
            noGame.textContent = '今日無賽事';
            noGame.style.display = 'block';
            gameDetail.style.display = 'none';
        }       
    })
})

