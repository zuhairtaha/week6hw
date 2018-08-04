// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"assets\\js\\Configs.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// a class for some configurations

var Configs = exports.Configs = function () {
    function Configs() {
        _classCallCheck(this, Configs);
    }

    _createClass(Configs, null, [{
        key: 'jsonSuffix',

        // static properties
        // Authenticated requests to get a higher rate limit exceeded for ip address.
        get: function get() {
            return String('?client_id=7bb4f90952af392365c9&client_secret=4dcbcde682d20c1e8be46ede55ce15a445843cdd');
        }

        // HackYourFuture - Copenhagen repositories JSON URL

    }, {
        key: 'hackYourFutureRepos',
        get: function get() {
            return String('https://api.github.com/orgs/HackYourFuture-CPH/repos');
        }

        // searching JSON URL

    }, {
        key: 'SearchHackYourFutureRepos',
        get: function get() {
            return String('https://api.github.com/search/repositories?q=user:HackYourFuture-CPH+');
        }
    }]);

    return Configs;
}();
},{}],"assets\\js\\makeRequest.js":[function(require,module,exports) {
"use strict";
/**
 * get json data (AJAX)
 * @param {String} url
 * @param {requestCallback} callback - The callback that handles the response.
 */

Object.defineProperty(exports, "__esModule", {
    value: true
});
var makeRequest = exports.makeRequest = function makeRequest(url, callback) {
    // Create new ajax call with the assets function called XMLHttpRequest
    var request = new XMLHttpRequest();
    request.addEventListener('load', function () {
        // This in here is our callback function
        // Check our server responsecode, 200 means ok, success: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
        if (this.status === 200) callback(JSON.parse(request.responseText));else console.log('Something is probably wrong with the url');
    });

    request.addEventListener('error', function () {
        console.log('Server error like timeout');
    });

    // initializes a request with an http method
    request.open("GET", url);
    // Sends the request
    request.send();
};
/**
 * This callback is displayed as a global member.
 * @callback requestCallback
 * @param {JSON} responseText
 * @return {Array} responseData
 */
},{}],"assets\\js\\showCommits.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.showCommits = showCommits;

var _makeRequest = require("./makeRequest");

var _Configs = require("./Configs");

/*
 * show commits
 * @param {*} tr table row
 */
function showCommits(tr) {
    var commitsButton = tr.querySelector('.commitsButton');
    var moreDetailsDiv = tr.querySelector('.moreDetailsDiv');
    commitsButton.addEventListener("click", function (e) {
        var _this = this;

        e.preventDefault();
        document.querySelector("#commitsCards").style.display = 'flex';
        moreDetailsDiv.innerHTML = "";
        // const href                 = this.href + '/commits?access_token=' + ATOKEN;
        var href = this.dataset.link + '/commits';
        (0, _makeRequest.makeRequest)(href + _Configs.Configs.jsonSuffix, function (commits) {
            var count = 0;
            var CARDS_NUM = 4;
            if (commits.length > 0) {
                var comDiv = document.createElement('div');
                var comDivInnerHTML = "";

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = commits[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var c = _step.value;


                        // surround with: <div class="card-desk">..</div> every (CARDS_NUM) iteration
                        if (count % CARDS_NUM === 0) {
                            if (count !== 0) comDivInnerHTML += "</div>";
                            comDivInnerHTML += "<div class=\"card-deck\">";
                        }

                        //region user image
                        var img = "";
                        if (c != null && c.author != null && c.author.avatar_url) img += "<img class=\"card-img-top\" src=\"" + c.author.avatar_url + "\" alt=\"Card image cap\">";
                        //endregion

                        //region authorURL
                        var authorURL = '#';
                        if (c != null && c.author != null && c.author.login != null) authorURL = "https://github.com/" + c.author.login;else if (c != null && c.author != null && c.author.html_url != null) authorURL = c.author.html_url;

                        //endregion

                        // strip HTML tags from message string
                        var textMsg = c.commit.message.replace(/<\/?[^>]+(>|$)/g, "");

                        comDivInnerHTML += "\n                    <div class=\"col-lg-" + 12 / CARDS_NUM + " p-0\">\n                        <div class=\"card mb-2 bxShadow\">\n                            " + img + "\n                            <div class=\"card-body\">\n                                <a target=\"_blank\" href=\"" + authorURL + "\">\n                                    <h5 class=\"card-title\">\n                                        <i class=\"ti-user\"></i> " + c.commit.author.name + "\n                                    </h5>\n                                </a>\n                                <p class=\"card-text cardTextMessage\">" + textMsg + "</p>\n                                <p class=\"card-text\">\n                                    <small class=\"text-muted\">\n                                        <i class=\"ti-alarm-clock\"></i> " + c.commit.author.date + "\n                                    </small>\n                                </p> \n                                    <a target=\"_blank\" class=\"btn btn-primary btn-sm btn-block ripple\" \n                                      href=\"" + c.html_url + "\">\n                                        <i class=\"ti-eye\"></i> View\n                                    </a> \n                            </div>\n                         </div>\n                    </div>\n                    ";
                        count++;
                    } // END: const c of commits
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                comDivInnerHTML += "</div>";
                comDiv.innerHTML = comDivInnerHTML;
                var commitsDiv = document.querySelector("#commitsDiv");
                commitsDiv.style.display = 'flex';
                commitsDiv.innerHTML = "";
                commitsDiv.appendChild(comDiv);

                // set card title and description
                var repCardTitle = document.querySelector("#repositoryCardNav .card-body .card-title");
                repCardTitle.innerHTML = _this.dataset.cardtitle;
                document.querySelector("#repositoryCardNav .card-body .card-text").innerHTML = _this.dataset.cardtext;
                document.querySelector("#repositoryCardNav").scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    inline: "nearest"
                });
            } else alert("no commits found!");
        });
    });
}
},{"./makeRequest":"assets\\js\\makeRequest.js","./Configs":"assets\\js\\Configs.js"}],"assets\\js\\Repository.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Repository = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _showCommits = require("./showCommits");

var _makeRequest = require("./makeRequest");

var _Configs = require("./Configs");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// class for one repository
var Repository = exports.Repository = function () {
    /**
     * constructor of Repository class
     * @param {{index: number, url: *, title: *, description: string, contributorsCount: number, forksCount: number,
     *     watchersCount: number, commitsCount: number, commitsUrl: number, contributorsUrl: string }} repository :
     *     passing repository values as an object to the constructor with initial values
     */
    function Repository(repository) {
        _classCallCheck(this, Repository);

        var _repository$index = repository.index,
            index = _repository$index === undefined ? 0 : _repository$index,
            _repository$url = repository.url,
            url = _repository$url === undefined ? '' : _repository$url,
            _repository$title = repository.title,
            title = _repository$title === undefined ? '' : _repository$title,
            _repository$descripti = repository.description,
            description = _repository$descripti === undefined ? '' : _repository$descripti,
            _repository$forksCoun = repository.forksCount,
            forksCount = _repository$forksCoun === undefined ? 0 : _repository$forksCoun,
            _repository$watchersC = repository.watchersCount,
            watchersCount = _repository$watchersC === undefined ? 0 : _repository$watchersC,
            _repository$commitsUr = repository.commitsUrl,
            commitsUrl = _repository$commitsUr === undefined ? '' : _repository$commitsUr,
            _repository$contribut = repository.contributorsCount,
            contributorsCount = _repository$contribut === undefined ? 0 : _repository$contribut,
            _repository$commitsCo = repository.commitsCount,
            commitsCount = _repository$commitsCo === undefined ? 0 : _repository$commitsCo,
            _repository$contribut2 = repository.contributorsUrl,
            contributorsUrl = _repository$contribut2 === undefined ? '' : _repository$contribut2;

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


    _createClass(Repository, [{
        key: "getCommitsCount",


        // this method calculate the commits count, then insert the result into td#commits-count-(tableDivId)
        value: function getCommitsCount(commitsUrl, tableDivId) {
            (0, _makeRequest.makeRequest)(commitsUrl.replace('{/sha}', '') + _Configs.Configs.jsonSuffix, function (commits) {
                document.querySelector("#commits-count-" + tableDivId).innerHTML = commits.length;
            });
        }

        // calculate contributors count, then insert the result into td#commits-count-(tableDivId)

    }, {
        key: "getContributorsCount",
        value: function getContributorsCount(contributorsUrl, tableDivId) {
            (0, _makeRequest.makeRequest)(contributorsUrl + _Configs.Configs.jsonSuffix, function (contributors) {
                document.querySelector("#contributors-count-" + tableDivId).innerHTML = contributors.reduce(function (sum, contributor) {
                    sum += contributor.contributions;
                    return sum;
                }, 0);
            });
        }
    }, {
        key: "repositoryTableRow",
        get: function get() {
            var repTableRow = document.createElement("tr");
            repTableRow.innerHTML = "\n                        <td>" + this._index + "</td>\n                        <td>\n                            <a class=\"commitsButton\" data-cardtitle=\"" + this._title + "\" data-cardtext=\"" + this._description + "\" \n                            href=\"#\" data-link=\"" + this._url + "\" > " + this._title + "\n                            </a><br>" + this._description + " <div class=\"moreDetailsDiv\"></div>\n                        </td>\n                        <td id=\"contributors-count-" + (this._index + 1) + "\"><i class=\"fas fa-sync fa-spin\"></i></td>\n                        <td id=\"commits-count-" + (this._index + 1) + "\"><i class=\"fas fa-sync fa-spin\"></i></td>\n                        <td>" + this._forksCount + "</td>\n                        <td>" + this._watchersCount + "</td>\n                        ";

            // calculate commits count
            this.getCommitsCount(this._commitsUrl, this._index + 1);

            // calculate contributors count
            this.getContributorsCount(this._contributorsUrl, this._index + 1);

            (0, _showCommits.showCommits)(repTableRow);
            // return repository table row
            return repTableRow;
        }
    }]);

    return Repository;
}();
},{"./showCommits":"assets\\js\\showCommits.js","./makeRequest":"assets\\js\\makeRequest.js","./Configs":"assets\\js\\Configs.js"}],"assets\\js\\Repositories.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Repositories = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Repository = require("./Repository");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Repositories = exports.Repositories = function () {
    function Repositories() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'all';
        var repositoriesList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        _classCallCheck(this, Repositories);

        this._type = type;
        this._repositoriesList = repositoriesList;
    }

    _createClass(Repositories, [{
        key: "forksAverage",


        // calculate the average value for forks_count
        value: function forksAverage() {
            var average = { sum: 0, avg: 0 };
            return this._repositoriesList.reduce(function (average, repository, index) {
                average.sum += repository.forks_count;
                average.avg = average.sum / (index + 1);
                return average;
            }, average);
        }

        // get mostForked

    }, {
        key: "mostForked",
        value: function mostForked() {
            var _this = this;

            return this._repositoriesList.filter(function (repository) {
                return repository.forks_count >= _this.forksAverage().avg;
            }).sort(function (a, b) {
                return b.forks_count - a.forks_count;
            });
        }

        // calculate the average value for watchers_count

    }, {
        key: "watchedAverage",
        value: function watchedAverage() {
            var average = { sum: 0, avg: 0 };
            return this._repositoriesList.reduce(function (average, repository, index) {
                average.sum += repository.watchers_count;
                average.avg = average.sum / (index + 1);
                return average;
            }, average);
        }

        //leastForked

    }, {
        key: "leastForked",
        value: function leastForked() {
            var _this2 = this;

            return this._repositoriesList.filter(function (repository) {
                return repository.forks_count <= _this2.forksAverage().avg;
            }).sort(function (a, b) {
                return a.forks_count - b.forks_count;
            });
        }

        //mostWatched

    }, {
        key: "mostWatched",
        value: function mostWatched() {
            var _this3 = this;

            return this._repositoriesList.filter(function (repository) {
                return repository.watchers_count >= _this3.watchedAverage().avg;
            }).sort(function (a, b) {
                return b.watchers_count - a.watchers_count;
            });
        }

        //leastWatched

    }, {
        key: "leastWatched",
        value: function leastWatched() {
            var _this4 = this;

            return this._repositoriesList.filter(function (repository) {
                return repository.watchers_count <= _this4.watchedAverage().avg;
            }).sort(function (a, b) {
                return a.watchers_count - b.watchers_count;
            });
        }

        // total forks

    }, {
        key: "totalForks",
        value: function totalForks() {
            document.querySelector('#totalReposCount').innerHTML = this._repositoriesList.reduce(function (sum, repository) {
                return sum += repository.forks_count;
            }, 0);
            return false;
        }

        // filter, reduce, search the repositories according to the `type` value

    }, {
        key: "filterRepositoriesByType",
        value: function filterRepositoriesByType() {
            /*
             * this boolean value to handle exceptions (when their is no results,
             * or we just want to show the amount of total forks.
             * if its false don't display repositories at table body
             */
            var doDisplayRepositories = true;

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

    }, {
        key: "displayRepositories",
        value: function displayRepositories() {

            // filter the repositories at first,
            // if filterRepositoriesByType = false, don't complete executing
            if (!this.filterRepositoriesByType()) return;

            // selector for table body
            var repositoriesTableBody = document.querySelector('#reposTbody');

            // empty table body before fill it to avoid appending new rows
            repositoriesTableBody.innerHTML = '';

            // looping through all repositories array items
            this._repositoriesList.forEach(function (repositoryItem, index) {

                // create new instance of Repository object
                var repository = new _Repository.Repository({
                    index: index,
                    url: repositoryItem.url,
                    title: repositoryItem.name,
                    description: repositoryItem.description,
                    forksCount: repositoryItem.forks_count,
                    watchersCount: repositoryItem.watchers_count,
                    commitsUrl: repositoryItem.commits_url,
                    contributorsUrl: repositoryItem.contributors_url
                });

                // append this row to the table body
                repositoriesTableBody.appendChild(repository.repositoryTableRow);

                // call show commits function for this table row
                //showCommits(repository.repositoryTableRow);
            });
        }
    }, {
        key: "count",
        get: function get() {
            return this._repositoriesList.length;
        }
    }]);

    return Repositories;
}();
},{"./Repository":"assets\\js\\Repository.js"}],"app.js":[function(require,module,exports) {
"use strict";

var _Configs = require("./assets/js/Configs");

var _makeRequest = require("./assets/js/makeRequest");

var _Repositories = require("./assets/js/Repositories");

/**
 * this function called when any bring repositories buttons clicked.
 * @param {String} jsonUrl : API JSON URL for repositories
 * @param {String} type: it could be one of these values
 *                        ['all', 'search' 'totalForks' 'mostForked', 'leastForked', 'mostWatched', 'leastWatched']
 *                        according to the button clicked.
 */
function getRepositoriesFromJsonUrl(jsonUrl, type) {
    var tempRepositoriesList = [];
    (0, _makeRequest.makeRequest)(jsonUrl, function (repos) {
        var allRepos = new _Repositories.Repositories(type, repos);
        allRepos.displayRepositories();
    });
}

// when click on all display repositories buttons, trigger getRepositoriesFromJsonUrl function
document.querySelectorAll('.get-repositories').forEach(function (getRepositoriesButton) {
    // get data-type value
    var repositoriesType = getRepositoriesButton.dataset.type;
    getRepositoriesButton.addEventListener('click', function () {
        getRepositoriesFromJsonUrl(_Configs.Configs.hackYourFutureRepos + _Configs.Configs.jsonSuffix, repositoriesType);
    });
});

// submit search form event listener
document.querySelector("#searchForm").addEventListener("submit", submitSearchForm);

// submit search form function
function submitSearchForm(event) {
    event.preventDefault();

    // getting the value of: input[name=key], and trim spaces
    var searchKeyword = new FormData(event.target).get('key').trim();

    // the label tag upper search form
    var label = document.querySelector("#searchLabel");

    // check length to make sure that it is not empty
    if (searchKeyword.length < 1) {
        submitSearchFormNotValid(searchKeyword, label, this);
    } else {
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
    var searchURL = _Configs.Configs.SearchHackYourFutureRepos + searchKeyword + _Configs.Configs.jsonSuffix.replace('?', '&');
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
},{"./assets/js/Configs":"assets\\js\\Configs.js","./assets/js/makeRequest":"assets\\js\\makeRequest.js","./assets/js/Repositories":"assets\\js\\Repositories.js"}],"C:\\Users\\Zuhair\\AppData\\Roaming\\npm\\node_modules\\parcel-bundler\\src\\builtins\\hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '13944' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["C:\\Users\\Zuhair\\AppData\\Roaming\\npm\\node_modules\\parcel-bundler\\src\\builtins\\hmr-runtime.js","app.js"], null)
//# sourceMappingURL=/app.10a031b5.map