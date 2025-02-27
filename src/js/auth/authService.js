import Store from "./store.js";
import {getIpAddress} from "../static.js";

class AuthService {
    async login(username, password) {
        try {
            const response = await fetch(getIpAddress() + '/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON. stringify(
                    {
                        username: username,
                        password: password
                    }
                )
            });

            if (response.status === 200) {
                const { token, username, creation, trust } = await response.json();
                this.saveToken(token);
                Store.setUser(username, creation, trust);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    async register(username, password) {
        try {
            const response = await fetch(getIpAddress() + '/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        username: username,
                        password: password
                    }
                )
            });

            if (response.status === 201) {
                await this.login(username, password);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    async validate() {
        try {
            const response = await fetch(getIpAddress() + '/api/v1/auth/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
            });

            if (response.status === 200) {
                const { username, creation, trust } = await response.json();
                Store.setUser(username, creation, trust);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }

    }

    saveToken(token) {
        // domain=kryeit.com; Secure; SameSite=None
        document.cookie = `auth=${token}; path=/;`;
    }

    getToken() {
        const cookies = document.cookie.split('; ')
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const [name, value] = cookie.split('=')
            if (name === 'auth') {
                return value;
            }
        }
        return null;
    }

    logout() {
        Store.removeUser()
        document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    }
}

export default new AuthService()