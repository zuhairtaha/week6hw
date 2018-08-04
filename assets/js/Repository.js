"use strict";
import {showCommits} from "./showCommits";
import {makeRequest} from "./makeRequest";
import {Configs} from "./Configs";

// class for one repository
export class Repository {
    /**
     * constructor of Repository class
     * @param {{index: number, url: *, title: *, description: string, contributorsCount: number, forksCount: number,
     *     watchersCount: number, commitsCount: number, commitsUrl: number, contributorsUrl: string }} repository :
     *     passing repository values as an object to the constructor with initial values
     */
    constructor(repository) {
        let {
            index = 0,
            url = '',
            title = '',
            description = '',
            forksCount = 0,
            watchersCount = 0,
            commitsUrl = '',
            contributorsCount = 0,
            commitsCount = 0,
            contributorsUrl = ''
        } = repository;
        this._index = index;
        this._url = url;
        this._title = title;
        this._description = description;
        this._forksCount = forksCount;
        this._watchersCount = watchersCount;
        this._commitsUrl = commitsUrl;
        this._contributorsCount = contributorsCount;
        this._commitsCount = commitsCount;
        this._repository = repository;
        this._contributorsUrl = contributorsUrl;
    }

    /**
     * Create table row, then fill it with table divs and their content. finally return table row.
     * @returns {HTMLElement}
     */
    get repositoryTableRow() {
        let repTableRow = document.createElement("tr");
        repTableRow.innerHTML = `
                        <td>${this._index}</td>
                        <td>
                            <a class="commitsButton" data-cardtitle="${this._title}" data-cardtext="${this._description}" 
                            href="#" data-link="${this._url}" > ${this._title}
                            </a><br>${this._description} <div class="moreDetailsDiv"></div>
                        </td>
                        <td id="contributors-count-${this._index + 1}"><i class="fas fa-sync fa-spin"></i></td>
                        <td id="commits-count-${this._index + 1}"><i class="fas fa-sync fa-spin"></i></td>
                        <td>${this._forksCount}</td>
                        <td>${this._watchersCount}</td>
                        `;

        // calculate commits count
        this.getCommitsCount(this._commitsUrl, this._index + 1);

        // calculate contributors count
        this.getContributorsCount(this._contributorsUrl, this._index + 1);

        showCommits(repTableRow);
        // return repository table row
        return repTableRow;
    }

    // this method calculate the commits count, then insert the result into td#commits-count-(tableDivId)
    getCommitsCount(commitsUrl, tableDivId) {
        makeRequest(commitsUrl.replace('{/sha}', '') + Configs.jsonSuffix, commits => {
            document.querySelector(`#commits-count-${tableDivId}`).innerHTML = commits.length;
        });
    }

    // calculate contributors count, then insert the result into td#commits-count-(tableDivId)
    getContributorsCount(contributorsUrl, tableDivId) {
        makeRequest(contributorsUrl + Configs.jsonSuffix, contributors => {
            document.querySelector(`#contributors-count-${tableDivId}`).innerHTML =
                contributors.reduce((sum, contributor) => {
                    sum += contributor.contributions;
                    return sum;
                }, 0);
        });
    }

}
