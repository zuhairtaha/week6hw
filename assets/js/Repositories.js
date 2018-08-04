"use strict";
import {Repository} from "./Repository";

export class Repositories {
    constructor(type = 'all', repositoriesList = []) {
        this._type = type;
        this._repositoriesList = repositoriesList;
    }

    get count() {
        return this._repositoriesList.length;
    }

    // calculate the average value for forks_count
    forksAverage() {
        let average = {sum: 0, avg: 0};
        return this._repositoriesList.reduce((average, repository, index) => {
            average.sum += repository.forks_count;
            average.avg = average.sum / (index + 1);
            return average;
        }, average);
    }

    // get mostForked
    mostForked() {
        return this._repositoriesList
            .filter(repository => repository.forks_count >= this.forksAverage().avg)
            .sort((a, b) => b.forks_count - a.forks_count);
    }

    // calculate the average value for watchers_count
    watchedAverage() {
        let average = {sum: 0, avg: 0};
        return this._repositoriesList.reduce((average, repository, index) => {
            average.sum += repository.watchers_count;
            average.avg = average.sum / (index + 1);
            return average;
        }, average);
    }

    //leastForked
    leastForked() {
        return this._repositoriesList
            .filter(repository => repository.forks_count <= this.forksAverage().avg)
            .sort((a, b) => a.forks_count - b.forks_count);
    }

    //mostWatched
    mostWatched() {
        return this._repositoriesList
            .filter(repository => repository.watchers_count >= this.watchedAverage().avg)
            .sort((a, b) => b.watchers_count - a.watchers_count);
    }

    //leastWatched
    leastWatched() {
        return this._repositoriesList
            .filter(repository => repository.watchers_count <= this.watchedAverage().avg)
            .sort((a, b) => a.watchers_count - b.watchers_count);
    }

    // total forks
    totalForks() {
        document.querySelector('#totalReposCount').innerHTML = this._repositoriesList
            .reduce((sum, repository) => sum += repository.forks_count, 0);
        return false;
    }

// filter, reduce, search the repositories according to the `type` value
    filterRepositoriesByType() {
        /*
         * this boolean value to handle exceptions (when their is no results,
         * or we just want to show the amount of total forks.
         * if its false don't display repositories at table body
         */
        let doDisplayRepositories = true;

        switch (this._type) {
            case "mostForked":
                this._repositoriesList = this.mostForked();
                break;
            case "leastForked":
                this._repositoriesList = this.leastForked();
                break;
            case "mostWatched":
                this._repositoriesList = this.mostWatched();
                break;
            case "leastWatched":
                this._repositoriesList = this.leastWatched();
                break;
            case "totalForks":
                this.totalForks();
                doDisplayRepositories = false;
                break;
            case "search":
                this._repositoriesList = this._repositoriesList.items;
                if (this.count === 0) {
                    document.querySelector('#commitsDiv').innerHTML = '';
                    document.querySelector('#commitsCards .card-title').innerHTML = '';
                    document.querySelector('#commitsCards .card-text').innerHTML = '';
                    alert("No repositories found!");
                }
        }
        return doDisplayRepositories;
    }

    // fill table body content with the repositories
    displayRepositories() {

        // filter the repositories at first,
        // if filterRepositoriesByType = false, don't complete executing
        if (!this.filterRepositoriesByType())
            return;

        // selector for table body
        const repositoriesTableBody = document.querySelector('#reposTbody');

        // empty table body before fill it to avoid appending new rows
        repositoriesTableBody.innerHTML = '';

        // looping through all repositories array items
        this._repositoriesList.forEach((repositoryItem, index) => {

            // create new instance of Repository object
            let repository = new Repository({
                index:           index,
                url:             repositoryItem.url,
                title:           repositoryItem.name,
                description:     repositoryItem.description,
                forksCount:      repositoryItem.forks_count,
                watchersCount:   repositoryItem.watchers_count,
                commitsUrl:      repositoryItem.commits_url,
                contributorsUrl: repositoryItem.contributors_url,
            });

            // append this row to the table body
            repositoriesTableBody.appendChild(repository.repositoryTableRow);

            // call show commits function for this table row
            //showCommits(repository.repositoryTableRow);
        });
    }

}