const urlParams = new URLSearchParams(window.location.search);
document.title = '球隊球員名單'

const code = urlParams.get('code');
if (code && code.trim() !== '') {
    const codeElements = document.querySelectorAll(`[data-code="${code}"]`);
    codeElements.forEach(element => {
      element.classList.add('add-team-box');
    });
}

const formData = new FormData();

const getTeamPlayerData = (url, csrftoken, formData) => {
    return fetch(url, {
      method: "POST",
      headers: {
        'X-CSRFToken': csrftoken
      },
      body: formData
    }).then(response => response.json())
}  

const csrftoken = document.getElementsByName("csrfmiddlewaretoken")[0].value;
formData.append("code", code);
const url1 ='api/getTeamPlayer';

const teamPlayers = document.querySelector(".team-players");


getTeamPlayerData(url1, csrftoken, formData).then((data) => {
    console.log(data)
    const playerList = data.data;
    const teamOrder = [
        ['統一7-ELEVEn獅','統一7-ELEVEn獅二軍'],
        ['樂天桃猿', '樂天桃猿二軍'],
        ['富邦悍將', '富邦悍將二軍'],
        ['味全龍', '味全龍二軍'],
        ['中信兄弟', '中信兄弟二軍']
        ];
    const teamMap = new Map();
    teamOrder.forEach(teamArr => {
        teamArr.forEach(team => {
            teamMap.set(team, []);
        });
    });

    playerList.forEach(item => {   
        console.log(item)
        teamMap.get(item.army).push(item);
    });
    const firstTeam = document.createElement('div');
    const firstTeamTitle = document.createElement('div');
    const firstTeamPlayers = document.createElement('div');
    const hr = document.createElement('hr');

    firstTeamTitle.textContent = '一軍';
    firstTeamTitle.classList.add('team-title');
    firstTeam.appendChild(firstTeamTitle);
    const secondTeam = document.createElement('div');
    const secondTeamTitle = document.createElement('div');
    const secondTeamPlayers = document.createElement('div');
    secondTeamTitle.textContent = '二軍';
    secondTeamTitle.classList.add('team-title');
    secondTeam.appendChild(secondTeamTitle);


    teamOrder.forEach(teamArr => {
        teamArr.forEach(team => {          
            let playerArr = teamMap.get(team);
            playerArr.sort((a, b) => {
                return a.player_name.localeCompare(b.player_name);
            });

            playerArr.forEach(player => {
                console.log(player)
                const playerName = document.createElement('a');
                playerName.href = `/player?num=${player.id}`;
                if(/二軍/.test(player.army)) {
                    playerName.textContent = player.player_name;   
                    secondTeamPlayers.appendChild(playerName)
                } else {
                    playerName.textContent = player.player_name;
                    firstTeamPlayers.appendChild(playerName)
                }
                playerName.classList.add("player-name");
                secondTeamPlayers.classList.add("second-team-players");
                firstTeamPlayers.classList.add("first-team-players");
                secondTeam.classList.add("second-team");
                firstTeam.classList.add("first-team");
                hr.classList.add("hr");

                teamPlayers.classList.add("team-players-box");
                
                firstTeam.appendChild(firstTeamPlayers);
                
                secondTeam.appendChild(secondTeamPlayers);

                teamPlayers.appendChild(firstTeam);
                teamPlayers.appendChild(hr);
                teamPlayers.appendChild(secondTeam);
            });
        });
    }); 
})       

const teamBtn = document.querySelectorAll(".nav-link")

teamBtn.forEach(item => {
    item.addEventListener("click", () => {
        const teamName = item.getAttribute('data-code')
        document.querySelectorAll(".add-team-box").forEach((checkedItem) => {
            checkedItem.classList.remove("add-team-box");
        });
        item.classList.add('add-team-box');
        let url = new URL(window.location.href);
        url.searchParams.set('code', item.getAttribute('data-code'));
        window.location.href = url.href;
    })
})


