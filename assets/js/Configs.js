// a class for some configurations

export class Configs {
    // static properties
    // Authenticated requests to get a higher rate limit exceeded for ip address.
    static get jsonSuffix() {
        return String('?client_id=7bb4f90952af392365c9&client_secret=4dcbcde682d20c1e8be46ede55ce15a445843cdd');
    }

    // HackYourFuture - Copenhagen repositories JSON URL
    static get hackYourFutureRepos() {
        return String('https://api.github.com/orgs/HackYourFuture-CPH/repos');
    }

    // searching JSON URL
    static get SearchHackYourFutureRepos() {
        return String('https://api.github.com/search/repositories?q=user:HackYourFuture-CPH+');
    }
}