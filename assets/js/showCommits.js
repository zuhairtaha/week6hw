"use strict";
import {makeRequest} from "./makeRequest";
import {Configs} from "./Configs";

/*
 * show commits
 * @param {*} tr table row
 */
export function showCommits(tr) {
    const commitsButton = tr.querySelector('.commitsButton');
    const moreDetailsDiv = tr.querySelector('.moreDetailsDiv');
    commitsButton.addEventListener("click", function (e) {
        e.preventDefault();
        document.querySelector("#commitsCards").style.display = 'flex';
        moreDetailsDiv.innerHTML = "";
        // const href                 = this.href + '/commits?access_token=' + ATOKEN;
        const href = this.dataset.link + '/commits';
        makeRequest(href + Configs.jsonSuffix, commits => {
            let count = 0;
            const CARDS_NUM = 4;
            if (commits.length > 0) {
                let comDiv = document.createElement('div');
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
                comDiv.innerHTML = comDivInnerHTML;
                const commitsDiv = document.querySelector("#commitsDiv");
                commitsDiv.style.display = 'flex';
                commitsDiv.innerHTML = ``;
                commitsDiv.appendChild(comDiv);

                // set card title and description
                const repCardTitle = document.querySelector("#repositoryCardNav .card-body .card-title");
                repCardTitle.innerHTML = this.dataset.cardtitle;
                document.querySelector("#repositoryCardNav .card-body .card-text").innerHTML = this.dataset.cardtext;
                document.querySelector("#repositoryCardNav").scrollIntoView({
                    behavior: "smooth",
                    block:    "start",
                    inline:   "nearest"
                });
            }
            else alert("no commits found!");
        });
    });
}