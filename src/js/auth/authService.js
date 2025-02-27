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
                const { token, username } = await response.json();
                this.saveToken(token);
                Store.setUser(username);
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

            return response.status === 201;
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

            return response.status === 200;
        } catch (error) {
            return false;
        }

    }

    saveToken(token) {
        // domain=kryeit.com; Secure; SameSite=None
        document.cookie = `auth=${token}; path=/;`;
    }

    getToken() {
        const cookies = document.cookie.split('; ');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const [name, value] = cookie.split('=');
            if (name === 'auth') {
                return value;
            }
        }
        return null;
    }

    logout() {
        document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
}

export default new AuthService();