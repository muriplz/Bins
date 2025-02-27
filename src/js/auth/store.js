import User from './user.js';

class Store {
    constructor() {
        this.state = {
            user: null
        };
    }

    setUser(username) {
        this.state.user = new User(username);
    }

    getUser() {
        return this.state.user;
    }
}

export default new Store();