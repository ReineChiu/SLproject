document.title = 'StoveLeague';
const url = 'api/getranking';
const errorBox = document.querySelector('.error-box');
const sendBtn = document.querySelector('.send-btn');
const playerMenu = document.querySelector('.player-menu');
const formData = new FormData();

const fieldYearTitle = document.querySelector('.field-year-title');
const pitchYearTitle = document.querySelector('.pitch-year-title');
formData.append('fieldyear', fieldYearTitle.textContent);
formData.append('pitchyear', pitchYearTitle.textContent);
const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;

const imgUrl = 'https://d2pr862w3j3gq8.cloudfront.net/stoveleague/';
const backgroundImg = document.querySelector('.background-image');
const bgImg = document.createElement('img');
bgImg.src = imgUrl+'background2.png'; 
bgImg.classList.add('backimages');
backgroundImg.appendChild(bgImg);

const getData = (url, csrftoken, formData) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrftoken
      },
      body: formData
    }).then(response => response.json())
}  
const checkData = (url) => {
    return fetch(url, {
      method: 'GET',
      headers:{
        'content-Type':'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }   
    }).then(response => response.json())
}  
// ============ 建立比對隊名-圖片function ============== //
const setTeamImg = (item, type, posRankImg) => {
    if (item.team === 1 || item.team_id === 1){
        image = 'lions.png';
    } else if (item.team === 2 || item.team_id === 2){
        image = 'elephant.png';
    } else if (item.team === 3 || item.team_id === 3){
        image = 'sinon.png';
    } else if (item.team === 4 || item.team_id === 4){
        image = 'wheel.png';
    } else if (item.team === 5 || item.team_id === 5){
        image = 'first.png';
    } else if (item.team === 6 || item.team_id === 6){
        image = 'macoto.png';
    } else if (item.team === 7 || item.team_id === 7){
        image = 'trex.png';
    } else if (item.team === 8 || item.team_id === 8){
        image = 'lamigo.png';
    } else if (item.team === 9 || item.team_id === 9){
        image = 'rhino.png';
    } else if (item.team === 10 || item.team_id === 10){
        image = 'brothers.png';
    } else if (item.team === 11 || item.team_id === 11){
        image = 'guardians.png';
    } else if (item.team === 12 || item.team_id === 12){
        image = 'dragons.png';
    } else if (item.team === 13 || item.team_id === 13){
        image = 'rakuten.png';
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
    const fieldRank = document.querySelector('.fieldrank');
    while (fieldRank.hasChildNodes()){ 
        fieldRank.removeChild(fieldRank.firstChild);
    }
    field.forEach(item =>{
        const fieldRankBar = document.createElement('div');
        const fieldRankImg = document.createElement('img');
        const fieldRankName = document.createElement('div');
        const fieldRankAvg = document.createElement('div'); 
        fieldRankName.textContent = item.fielder_name;
        fieldRankAvg.textContent = item.AVG;
        fieldRankImg.classList.add('rank-img');
        fieldRankName.classList.add('rank-name');
        fieldRankAvg.classList.add('rank-avg');
        fieldRankBar.classList.add('rank-bar');
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
    const pitchRank = document.querySelector('.pitchrank');
    while (pitchRank.hasChildNodes()){ 
        pitchRank.removeChild(pitchRank.firstChild);
    }
    pitch.forEach(item =>{           
        const pitchRankBar = document.createElement('div');
        const pitchRankImg = document.createElement('img');
        const pitchRankName = document.createElement('div');
        const pitchRankAvg = document.createElement('div');
        pitchRankName.textContent = item.pitcher_name;
        pitchRankAvg.textContent = item.ERA;
        pitchRankImg.classList.add('rank-img');
        pitchRankName.classList.add('rank-name');
        pitchRankAvg.classList.add('rank-avg');
        pitchRankBar.classList.add('rank-bar');
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
const inputText = document.getElementById('search-text');
const errorTip = document.createElement('div');
let timerId = null // 計時器

inputText.addEventListener('input', (e)=>{
    e.stopPropagation();
    const instantText = e.target.value
   
    while (playerMenu.hasChildNodes()){ 
        playerMenu.removeChild(playerMenu.firstChild);
    }

    if (timerId != null) {
        clearTimeout(timerId);
    }

    formData.append('name', instantText);
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    errorBox.style.display = 'none';

    timerId = setTimeout(() =>{
        getData('api/getplayername', csrftoken, formData).then((data) => {
            if ('ok' in data){
                data.data.forEach(ele =>{
                    const playerItem = document.createElement('div');
                    const inputPlayerTeam = document.createElement('img');
                    const inputPlayerName = document.createElement('div');
                    playerItem.classList.add('player-item');
                    inputPlayerTeam.classList.add('team-image');
                    inputPlayerName.textContent = ele.player_name;
                    inputPlayerName.classList.add('input-player-name');
                    inputPlayerName.setAttribute('data-serial', ele.id);
                    playerItem.appendChild(inputPlayerTeam);
                    playerItem.appendChild(inputPlayerName);
                    playerMenu.appendChild(playerItem);
                    playerMenu.style.display = 'block';

                    // === 模糊比對 隊名&圖示 === //
                    setTeamImg(ele, 'search', inputPlayerTeam)

                    const newName = document.querySelectorAll('.input-player-name');
                    newName.forEach(item =>{
                        item.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const chooseName = e.target.textContent.trim();
                            const chooseId = e.target.getAttribute('data-serial');

                            formData.append("searchname", `${chooseName}`);
                            const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
                            const url = `api/checkplayer/${chooseId}`;
                            getData(url, csrftoken, formData).then((data) => {
                                console.log(data)
                                if ("ok" in data){
                                    location.href =`player/${chooseId}`;
                                }else{
                                    playerMenu.style.display = 'none';
                                    errorBox.style.display = 'flex';
                                    errorTip.textContent = '這樣是查不到球員滴～\n<般耶波羅密>';
                                    errorTip.classList.add('error-name');
                                    errorBox.appendChild(errorTip);
                                }
                            })
                        })
                    })
                })
            } 
        })
    },500);
})

inputText.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (timerId != null) {
            clearTimeout(timerId);
        }
        formData.append("name", inputText.value);
        const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        getData('api/getplayername', csrftoken, formData).then((data) => {
            if ('error' in data){
                errorBox.style.display = 'block';
                errorTip.textContent = '沒有這個球員';
                errorTip.classList.add('error-name');
                errorBox.appendChild(errorTip);
            } else {
                if (data.data.length === 1){
                    location.href =`/player/${data.data[0].id}`;
                }               
            }
        })
    }
})


// ================= 年度排行榜 ================= //
const fieldYearsMenu = document.querySelector('.field-years-frame');
const pitchYearsMenu = document.querySelector('.pitch-years-frame');

const years = Array.from({length: 20}, (_, i) => 2022 - i);

years.forEach(ele =>{
    const year = document.createElement('div');
    year.textContent = ele;
    year.classList.add('fieldyear')
    fieldYearsMenu.appendChild(year);
})
years.forEach(ele =>{
    const year = document.createElement('div');
    year.textContent = ele;
    year.classList.add('pitchyear')
    pitchYearsMenu.appendChild(year);
})
const fieldYear = document.getElementById('fieldarrow');
fieldYear.addEventListener('click', (e) =>{
    fieldYearsMenu.style.display = 'block';
    e.stopPropagation();
})
const pitchYear = document.getElementById('pitcharrow');
pitchYear.addEventListener('click', (e) =>{
    pitchYearsMenu.style.display = 'block';
    e.stopPropagation();
})
document.addEventListener('click',(e) =>{
    fieldYearsMenu.style.display = 'none';
    pitchYearsMenu.style.display = 'none';
    e.stopPropagation();
});
fieldYearsMenu.addEventListener('click',(event) =>{
    event.stopPropagation();
})
pitchYearsMenu.addEventListener('click',(event) =>{
    event.stopPropagation();
})

const allfieldyear = document.querySelectorAll('.fieldyear');
allfieldyear.forEach(item =>{
    item.addEventListener('click', (e) =>{
        fieldYearTitle.textContent = e.target.textContent;
        formData.append('fieldyear', fieldYearTitle.textContent);
        const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        getData(url, csrftoken, formData).then((data) => {
            updateFieldRank(data)
        }) 
    })
})
const allpitchyear = document.querySelectorAll('.pitchyear');
allpitchyear.forEach(item =>{
    item.addEventListener('click', (e) =>{
        pitchYearTitle.textContent = e.target.textContent;
        formData.append('pitchyear', pitchYearTitle.textContent);
        const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        getData(url, csrftoken, formData).then((data) => {
            updatePitchRank(data)
        }) 
    })
})
// ================= 查看年度排行 ================= //
const fieldAnnualBtn = document.getElementById('field-annual');
const pitchAnnualBtn = document.getElementById('pitch-annual');

const clickAnnualBtn = (btnItem, pos) =>{
    let yearTitle;
    if (pos === 'field') {
        yearTitle = document.querySelector('.field-year-title');
    } else if (pos === 'pitch') {
        yearTitle = document.querySelector('.pitch-year-title');
    }
    btnItem.addEventListener('click',()=>{
        const annual = yearTitle.textContent;
        const url = `api/annual?pos=${pos}&annual=${annual}`;
        checkData(url).then((data) => {
            if ("ok" in data) {
                location.href = `annual?pos=${pos}&annual=${annual}`;
            } else {
                location.href = '/';
            }
        });
    })
}
clickAnnualBtn(fieldAnnualBtn, 'field');
clickAnnualBtn(pitchAnnualBtn, 'pitch');

// ================= 顯示時間 ================= //
const today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();
currentday = yyyy + '-' + mm + '-' + dd;

// ================= 顯示預告比賽資訊 ================= //
const gameCalendarBox = document.querySelector('.game-calendar-box');
const leftBtn = document.querySelector('.fa-chevron-left');
const rightBtn = document.querySelector('.fa-chevron-right');
leftBtn.addEventListener('click', function() {
    gameCalendarBox.scrollLeft -= 180;  
});
rightBtn.addEventListener('click', function() {
    gameCalendarBox.scrollLeft += 180; 
});
const noGame = document.querySelector('.no-game');
const gameDetail = document.querySelector('.game-detail');

const gameTimeLocal = document.querySelector('.time-local');

const gameTime = document.querySelector('.time');
const gameScoreInfo = document.querySelector('.game-score-info');

gameTime.textContent = currentday;

// ================= 顯示當日比賽資訊 ================= //
let gameLocations = [];
let guestTeam = [];
let guestScore = [];
let homeTeam = [];
let homeScore = [];
let winPitch = [];
let losePitch = [];
let mvp = [];

const renderGameDetails = (index) => {
    const gameBattleContainer = document.createElement('div');
    const gameGuestContainer = document.createElement('div');
    const gameVs = document.createElement('div');
    const gameHomeContainer = document.createElement('div');
    gameBattleContainer.classList.add('battle-container');
    gameGuestContainer.classList.add('score-board');
    gameVs.classList.add('versus');
    gameHomeContainer.classList.add('score-board');
    const gameGuestTeam = document.createElement('div');
    const gameGuestScore = document.createElement('div');
    const gameHomeTeam = document.createElement('div');
    const gameHomeScore = document.createElement('div');
    gameGuestTeam.classList.add('team');
    gameHomeTeam.classList.add('team');
    gameGuestScore.classList.add('score');
    gameHomeScore.classList.add('score');
    const gameFinalInfo= document.createElement('div');
    const gameWinPitch = document.createElement('div');
    const gameLosePitch = document.createElement('div');
    const gameMvp = document.createElement('div');
    gameFinalInfo.classList.add('final-info');
    gameWinPitch.classList.add('win-pitch');
    gameLosePitch.classList.add('lose-pitch');

    gameGuestTeam.textContent = guestTeam[index];
    gameGuestScore.textContent = guestScore[index];
    gameVs.textContent = 'VS.';
    gameHomeTeam.textContent = homeTeam[index];
    gameHomeScore.textContent = homeScore[index];
    gameWinPitch.textContent = '勝投：'+winPitch[index];
    gameLosePitch.textContent = '敗投：'+losePitch[index];
    gameMvp.textContent = 'MVP：'+mvp[index];

    gameGuestContainer.appendChild(gameGuestTeam);
    gameGuestContainer.appendChild(gameGuestScore);
    gameHomeContainer.appendChild(gameHomeTeam);
    gameHomeContainer.appendChild(gameHomeScore);
    gameFinalInfo.appendChild(gameWinPitch);
    gameFinalInfo.appendChild(gameLosePitch);
    gameFinalInfo.appendChild(gameMvp);
    gameBattleContainer.appendChild(gameGuestContainer);
    gameBattleContainer.appendChild(gameVs);
    gameBattleContainer.appendChild(gameHomeContainer);
    gameScoreInfo.appendChild(gameBattleContainer);
    gameScoreInfo.appendChild(gameFinalInfo);

}

fetch(`api/getgame`).then(response => response.json()).then((data) => {
    const date = new Date();
    let gameFound = false;

    data.data.forEach(item =>{
        let date = new Date(item.date); 
        let weekday = ['日', '一', '二', '三', '四', '五', '六'];
        let week = weekday[date.getUTCDay()];
        let year = date.getUTCFullYear();
        let month = String(date.getUTCMonth() + 1).padStart(2, '0'); // 注意JavaScript中月份是从0开始的，所以要加1
        let day = String(date.getUTCDate()).padStart(2, '0');
        let hours = date.getUTCHours();
        let minutes = String(date.getUTCMinutes()).padStart(2, '0');
        let gameDate = `${year}.${month}.${day} (${week})`;
        let gameTime = `${hours}:${minutes}`;

        if (date >= new Date()){
            const gameCalendar = document.createElement('div');
            gameCalendar.classList.add('game-calendar');
            const gamePlayDate = document.createElement('div');
            const gameTimeLocContainer = document.createElement('div');
            gameTimeLocContainer.classList.add('game-time-loc');
            const gamePlayTime = document.createElement('div');
            const gameLocation = document.createElement('div');
            const guestTeam = document.createElement('div');
            const homeTeam = document.createElement('div');
            gamePlayDate.textContent = gameDate;
            gamePlayDate.classList.add('game-play-date');
            gamePlayTime.textContent = gameTime;
            gamePlayTime.classList.add('game-play-time');
            gameLocation.textContent = item.location;
            gameLocation.classList.add('game-play-loc'); 
            guestTeam.textContent = item.guestTeam;
            guestTeam.classList.add('text');
            homeTeam.textContent = item.homeTeam;
            homeTeam.classList.add('text');
            gameCalendar.appendChild(gamePlayDate);
            gameTimeLocContainer.appendChild(gamePlayTime);
            gameTimeLocContainer.appendChild(gameLocation);
            gameCalendar.appendChild(gameTimeLocContainer);
            gameCalendar.appendChild(guestTeam);
            gameCalendar.appendChild(homeTeam);
            gameCalendarBox.appendChild(gameCalendar);
        }

        const dateStr = date.toISOString().substring(0, 10);
        const todayStr = today.toISOString().substring(0, 10);

        if (dateStr == todayStr) { 
            gameFound = true;
            noGame.style.display = 'none';
            gameDetail.style.display = 'block';
            gameLocations.push(item.location + '('+gameTime+')');
            guestTeam.push(item.guestTeam);
            guestScore.push(item.guestScore);
            homeTeam.push(item.homeTeam);
            homeScore.push(item.homeScore);
            winPitch.push(item.winPitch);
            losePitch.push(item.losePitch);
            mvp.push(item.mvp);
        } 
    });
    if (gameFound) {
        noGame.style.display = 'none';
        gameDetail.style.display = 'block';

        renderGameDetails(0);

        gameLocations.forEach((local, index) => {
            const gameLocation = document.createElement('div');
            gameLocation.textContent = local;
            gameLocation.classList.add('game-day-local');
            gameLocation.setAttribute('id', `game-location-${index}`);
            if (index === 0) {
                gameLocation.classList.add('choose-local');
            }
            gameTimeLocal.appendChild(gameLocation);

            const locationElement = document.querySelector(`#game-location-${index}`);
            locationElement.addEventListener('click', () => {
                gameLocations.forEach((local, index) => {
                    const otherLocationElement = document.querySelector(`#game-location-${index}`);
                    otherLocationElement.classList.remove('choose-local');
                });
                locationElement.classList.add('choose-local');
                while (gameScoreInfo.hasChildNodes()){ 
                    gameScoreInfo.removeChild(gameScoreInfo.firstChild);
                }

                renderGameDetails(index);
            });
        });    
    } else {
        noGame.textContent = '今日無賽事';
        noGame.style.display = 'block';
        gameDetail.style.display = 'none';
    }
})

