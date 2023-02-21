document.title = "StoveLeague";
const url = "api/getranking";
// const checkPlayer = document.getElementById('search-text');
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
    const brRegex = /中信/;
    const mkRegex = /樂天/;
    const gdRegex = /富邦/;
    const dgRegex = /味全/;
    const ulRegex = /統一/;
    const epRegex = /^兄弟$/;
    const lmRegex = /Lamigo/;
    const snRegex = /興農/;
    const riRegex = /義大/;
    const trRegex = /米迪亞/;
    const mtRegex = /誠泰/;
    const whRegex = /^中信$/;
    const fiRegex = /第一/;
    let image = '';
    if (item.team.match(brRegex)) {
        image = "brothers.png";
    } else if (item.team.match(mkRegex)){
        image = "rakuten.png";
    } else if (item.team.match(gdRegex)){
        image = "guardians.png";
    } else if (item.team.match(dgRegex)){
        image = "dragons.png";
    } else if (item.team.match(ulRegex)) {
        image = "lions.png";
    } else if (item.team.match(epRegex)) {
        image = "elephant.png";
    } else if (item.team.match(lmRegex)) {
        image = "lamigo.png";
    } else if (item.team.match(snRegex)) {
        image = "sinon.png";
    } else if (item.team.match(riRegex)) {
        image = "rhino.png";
    } else if (item.team.match(trRegex)) {
        image = "trex.png";
    } else if (item.team.match(mtRegex)) {
        image = "macoto.png";
    } else if (item.team.match(whRegex)) {
        image = "wheel.png";
    } else if (item.team.match(fiRegex)) {
        image = "first.png";
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
    // console.log(data)
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
inputText.addEventListener("input", (e)=>{
    e.stopPropagation();
    const instantText = e.target.value
    // console.log(instantText)
    while (playerMenu.hasChildNodes()){ 
        playerMenu.removeChild(playerMenu.firstChild);
    }
    formData.append("name", instantText);
    const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    errorBox.style.display = "none";

    getData("api/getplayername", csrftoken, formData).then((data) => {
        if ("ok" in data){
            console.log(data)
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
                        formData.append("searchname", `${chooseName}`);
                        formData.append("searchid", `${chooseId}`);
                        const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
                        getData("api/checkplayer", csrftoken, formData).then((data) => {
                            if ("ok" in data){
                                location.href = "/players/"+e.target.getAttribute('data-serial');
                            }else{
                                playerMenu.style.display = "none";
                                errorBox.style.display = "flex";
                                const errorTip = document.createElement("div");
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
// =============== 依據輸入姓名查詢選手 ================== //
// 
// sendBtn.addEventListener("click", () =>{
//     const searchText = document.getElementById("search-text").value;
//     formData.append("newname", searchText)
//     const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
//     // for (const [key, value] of formData.entries()) {
//     //     console.log(`${key}: ${value}`);
//     // }
//     fetch("api/getplayerid", {
//         method:"POST",
//         headers:{
//             'X-CSRFToken': csrftoken  
//         },
//         body:formData
//     })
//     .then(res => {
//         return res.json();
//     }).then(data => {
//         if ("ok" in data){
//             playerid = data.data[0].id
//             location.href = "/players/"+playerid;
//         }else{
//             checkPlayer.addEventListener("click", () => {
//                 while (errorBox.hasChildNodes()){ 
//                     errorBox.removeChild(errorBox.firstChild);
//                 }    
//             })           
//             errorBox.style.display = "flex";
//         }
//     })
// })

// ================= 年度排行榜 ================= //
const fieldYearsMenu = document.querySelector(".field-years-frame");
const pitchYearsMenu = document.querySelector(".pitch-years-frame");

const years = Array.from({length: 20}, (_, i) => 2022 - i);//創建一個內容為20個元素（從0到19）的陣列，並使用該元素的索引對2022進行减法，以創建陣列中的每一個元素。

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
            console.log(data)
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




