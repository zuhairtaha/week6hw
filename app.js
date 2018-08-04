"use strict";
import {Configs} from "./assets/js/Configs";
import {makeRequest} from "./assets/js/makeRequest";
import {Repositories} from "./assets/js/Repositories";

/**
 * this function called when any bring repositories buttons clicked.
 * @param {String} jsonUrl : API JSON URL for repositories
 * @param {String} type: it could be one of these values
 *                        ['all', 'search' 'totalForks' 'mostForked', 'leastForked', 'mostWatched', 'leastWatched']
 *                        according to the button clicked.
 */
function getRepositoriesFromJsonUrl(jsonUrl, type) {
    let tempRepositoriesList = [];
    makeRequest(jsonUrl, function (repos) {
        let allRepos = new Repositories(type, repos);
        allRepos.displayRepositories();
    });
}

// when click on all display repositories buttons, trigger getRepositoriesFromJsonUrl function
document.querySelectorAll('.get-repositories').forEach(function (getRepositoriesButton) {
    // get data-type value
    let repositoriesType = getRepositoriesButton.dataset.type;
    getRepositoriesButton.addEventListener('click', function () {
        getRepositoriesFromJsonUrl(Configs.hackYourFutureRepos + Configs.jsonSuffix, repositoriesType);
    })
});

// submit search form event listener
document.querySelector("#searchForm").addEventListener("submit", submitSearchForm);

// submit search form function
function submitSearchForm(event) {
    event.preventDefault();

    // getting the value of: input[name=key], and trim spaces
    let searchKeyword = new FormData(event.target).get('key').trim();

    // the label tag upper search form
    const label = document.querySelector("#searchLabel");

    // check length to make sure that it is not empty
    if (searchKeyword.length < 1) {
        submitSearchFormNotValid(searchKeyword, label, this);
    }
    else {
        submitSearchFormValid(searchKeyword, label, this);
    }
}

// submit search form valid
function submitSearchFormValid(searchKeyword, label, searchForm) {
    // reset label to black color, and initial value
    label.innerHTML = 'Search for a repository';
    label.style.color = "black";

    // remove animation classes
    searchForm.classList.remove('animated', 'shake');

    // set search url
    let searchURL = Configs.SearchHackYourFutureRepos + searchKeyword + Configs.jsonSuffix.replace('?', '&');
    getRepositoriesFromJsonUrl(searchURL, 'search');
}

// submit search form not valid
function submitSearchFormNotValid(searchKeyword, label, searchForm) {
    // set error message at label and change color to red
    label.innerHTML = "Error: You didn't enter a search term";
    label.style.color = "red";

    // shake search form
    searchForm.classList.add('animated', 'shake');
}