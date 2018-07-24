"use strict";

// region variables
let showReposButton     = document.querySelector("#myButton");
let reposTbody          = document.querySelector("#reposTbody");
let dataTable           = document.querySelector("#dataTable");
let loading             = document.querySelector("#itemsLoading");
let searchForm          = document.querySelector("#searchForm");
const header            = document.querySelector("#main-header .media");
const REPOS_URL         = 'https://api.github.com/orgs/HackYourFuture/repos'; // JSON 1 url:
let url2                = 'https://api.github.com/search/repositories?q=user:HackYourFuture+';
let btn                 = "";
let tr;
const label             = document.querySelector("#searchLabel");
let labelText           = label.innerHTML;
const goToTop           = document.querySelector("#goToTop");
const commitsDiv        = document.querySelector("#commitsDiv");
const ATOKEN            = 'a4609beabbf78d8f05969d0e92c1169e014961d7';
const repCardTitle      = document.querySelector("#repositoryCardNav .card-body .card-title");
const repCardText       = document.querySelector("#repositoryCardNav .card-body .card-text");
const repositoryCardNav = document.querySelector("#repositoryCardNav");
const commitsCards      = document.querySelector("#commitsCards");
// endregion

//region show-hide (progress bar and table) function & call it
let showHide = (loadingStyle, tableStyle) => {
    loading.style.display      = loadingStyle;
    dataTable.style.display    = tableStyle;
    commitsCards.style.display = 'none';
};
showHide('none', 'none');
//endregion

//region scroll to top
goToTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({top: 0, behavior: "smooth"});
});

//endregion

//region header as anchor
header.addEventListener("click", function () {
    location.href = "./";
});
//endregion

//region ajax get json function
let makeRequest = (url, callback) => {
    // Create new ajax call with the js function called XMLHttpRequest
    const request = new XMLHttpRequest();
    request.addEventListener('load', function () {
        // This in here is our callback function
        // Check our server responsecode, 200 means ok, success: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
        if (this.status === 200) {
            callback(JSON.parse(request.responseText));
        } else {
            console.log('Something is probably wrong with the url');
        }
    });

    request.addEventListener('error', function () {
        console.log('Server error like timeout');
    });

    // initializes a request with an http method
    request.open("GET", url);
    // Sends the request
    request.send();
};
//endregion

//region get json data
// parameters: json URL, the button which clicked
// then call displayRepositories (with passing the suitable data)
let getJsonUrl = (url, btn) => {

    // show loading, hide data table
    showHide('flex', 'none');

    // to empty list to avoid appending new rows
    reposTbody.innerHTML = "";

    setTimeout(function () {
        makeRequest(url, data => {
            if (btn === "showReposButton") {
                displayRepositories(data);
                return;
            }
            displayRepositories(data.items);
        });
        // hide loading, show table
        showHide('none', 'table');
    }, 1000);
};
//endregion

//region showReposButton click
showReposButton.addEventListener("click", () => {
    console.log("you clicked me! (show repositories button)");
    btn = "showReposButton";
    getJsonUrl(REPOS_URL, btn);
});
//endregion

//region submit search form
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // remove animation classes
    searchForm.classList.remove("animated");
    searchForm.classList.remove("shake");

    // reading search input[name=key] value
    const formData = new FormData(e.target);
    const k        = formData.get('key');

    // trim spaces from key then check length to make sure that it is not empty
    if (k.trim().length < 1) {
        label.innerHTML   = "Error: You didn't enter a search term";
        label.style.color = "red";
        searchForm.classList.add("animated");
        searchForm.classList.add("shake");
        return;
    }
    label.style.color = "black";
    label.innerHTML   = labelText;
    btn               = "searchButton";
    getJsonUrl(url2 + k, btn);
});
//endregion

//region show commits function
function showCommits(tr) {

    const commitsButton  = tr.querySelector('.commitsButton');
    const moreDetailsDiv = tr.querySelector('.moreDetailsDiv');
    commitsButton.addEventListener("click", function (e) {
        e.preventDefault();
        commitsCards.style.display = 'flex';
        moreDetailsDiv.innerHTML   = "";
        // const href                 = this.href + '/commits?access_token=' + ATOKEN;
        const href                 = this.href + '/commits';
        console.log(href);
        makeRequest(href, commits => {
            let count       = 0;
            const CARDS_NUM = 4;
            if (commits.length > 0) {
                let comDiv          = document.createElement('div');
                let comDivInnerHTML = ``;

                for (const c of commits) {

                    // surround with: <div class="card-desk">..</div> every (CARDS_NUM) iteration
                    if (count % CARDS_NUM === 0) {
                        if (count !== 0)
                            comDivInnerHTML += `</div>`;
                        comDivInnerHTML += `<div class="card-deck">`;
                    }

                    //region user image
                    let img = ``;
                    if (c != null && c.author != null && c.author.avatar_url)
                        img += `<img class="card-img-top" src="${c.author.avatar_url}" alt="Card image cap">`;
                    //endregion

                    //region authorURL
                    let authorURL = '#';
                    if (c != null && c.author != null && c.author.login != null)
                        authorURL = `https://github.com/${c.author.login}`;
                    else if (c != null && c.author != null && c.author.html_url != null)
                        authorURL = c.author.html_url;

                    //endregion

                    // strip HTML tags from message string
                    let textMsg = c.commit.message.replace(/<\/?[^>]+(>|$)/g, "");

                    comDivInnerHTML += `
                    <div class="col-lg-${12 / CARDS_NUM} p-0">
                        <div class="card mb-2 bxShadow">
                            ${img}
                            <div class="card-body">
                                <a target="_blank" href="${authorURL}">
                                    <h5 class="card-title">
                                        <i class="ti-user"></i> ${c.commit.author.name}
                                    </h5>
                                </a>
                                <p class="card-text cardTextMessage">${textMsg}</p>
                                <p class="card-text">
                                    <small class="text-muted">
                                        <i class="ti-alarm-clock"></i> ${c.commit.author.date}
                                    </small>
                                </p> 
                                    <a target="_blank" class="btn btn-primary btn-sm btn-block ripple" 
                                      href="${c.html_url}">
                                        <i class="ti-eye"></i> View
                                    </a> 
                            </div>
                         </div>
                    </div>
                    `;
                    count++;
                } // END: const c of commits
                comDivInnerHTML += `</div>`;
                comDiv.innerHTML     = comDivInnerHTML;
                commitsDiv.innerHTML = ``;
                commitsDiv.appendChild(comDiv);

                // set card title and description
                repCardTitle.innerHTML = this.dataset.cardtitle;
                repCardText.innerHTML  = this.dataset.cardtext;

                repositoryCardNav.scrollIntoView({
                    behavior: "smooth",
                    block:    "start",
                    inline:   "nearest"
                });
            }
            else alert("no commits found!");


        });
    });

}

//endregion

//region display repositories in the table
let displayRepositories = data => {
    let count = 0;
    for (const item of data) {
        count++;
        tr              = document.createElement("tr");
        let description = item.description;
        if (description !== null)
            description = item.description;
        else description = '';
        tr.innerHTML = `
                        <td>${count}</td>
                        <td>
                            <a class="commitsButton" href="${item.url}"
                               data-cardtitle="${item.name}" data-cardtext="${item.description}">
                                ${item.name}
                            </a>
                        </td>
                        <td>${description}<div class="moreDetailsDiv"></div></td>`;
        reposTbody.appendChild(tr);

        showCommits(tr);


    }
};
//endregion