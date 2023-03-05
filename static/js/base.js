const frontPage = document.querySelector(".domain-name");
frontPage.addEventListener("click", () =>{
    location.href = "/";
})

const logoUrl = "https://d2pr862w3j3gq8.cloudfront.net/stoveleague/"

const head = document.querySelector(".team-logo");
const brImg = document.createElement("img");
const rkImg = document.createElement("img");
const gdImg = document.createElement("img");
const dgImg = document.createElement("img");
const ulImg = document.createElement("img");
brImg.src = logoUrl + 'brothers.png';
rkImg.src = logoUrl + 'rakuten.png';
gdImg.src = logoUrl + 'guardians.png';
dgImg.src = logoUrl + 'dragons.png';
ulImg.src = logoUrl + 'lions.png';
brImg.classList.add('head-team-logo');
rkImg.classList.add('head-team-logo');
gdImg.classList.add('head-team-logo');
dgImg.classList.add('head-team-logo');
ulImg.classList.add('head-team-logo');
head.appendChild(brImg);
head.appendChild(rkImg);
head.appendChild(gdImg);
head.appendChild(dgImg);
head.appendChild(ulImg);

const checkTeam = (url) => {
    return fetch(url, {
        method: "GET",
        headers:{
            "content-Type":"application/json",
            'X-Requested-With': 'XMLHttpRequest'
        }   
    }).then(response => response.json())
}

const teamLogo = document.querySelectorAll(".head-team-logo");
teamLogo.forEach(item =>{
    item.addEventListener("click", (e) =>{
        const src = e.target.src;
        const parts = src.split('/');
        const lastPart = parts.pop();
        const teamCode = lastPart.split('.');
        const code = teamCode[0]
        const url = `api/team?code=${code}`;

        checkTeam(url).then((data) => {
            if ("ok" in data) {
                location.href = `teams?code=${code}`;
            } else {
                location.href = "/";
            }
        });
    })
})


