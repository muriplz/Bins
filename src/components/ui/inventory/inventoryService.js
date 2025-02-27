const API_URL = '/api/v1/auth/inventory';
let cachedInventory = null;
let fetchingPromise = null;

// Helper for fetch requests
const fetchJSON = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    if (!response.ok) {
        const error = new Error(`HTTP error ${response.status}`);
        error.status = response.status;
        error.statusText = response.statusText;
        try {
            error.data = await response.json();
        } catch (e) {
            error.data = null;
        }
        throw error;
    }

    return response.json();
};

export default {
    async getInventory(force = false) {
        // Return cached inventory if available and not forced refresh
        if (cachedInventory && !force) {
            return Promise.resolve(cachedInventory);
        }

        // If already fetching, return the existing promise
        if (fetchingPromise) {
            return fetchingPromise;
        }

        // Create new fetch promise
        fetchingPromise = fetchJSON(API_URL)
            .then(data => {
                cachedInventory = data;
                fetchingPromise = null;
                return cachedInventory;
            })
            .catch(error => {
                fetchingPromise = null;
                throw error;
            });

        return fetchingPromise;
    },

    async addItem(item, position) {
        const response = await fetchJSON(`${API_URL}/add`, {
            method: 'POST',
            body: JSON.stringify({
                item: item.toJSON(),
                position: position
            })
        });

        if (response.success) {
            // Update cache if successful
            if (cachedInventory) {
                cachedInventory = await this.getInventory(true);
            }
        }

        return response;
    },

    async removeItem(itemId) {
        const response = await fetchJSON(`${API_URL}/remove`, {
            method: 'POST',
            body: JSON.stringify({
                itemId
            })
        });

        if (response.success) {
            // Update cache if successful
            if (cachedInventory) {
                cachedInventory = await this.getInventory(true);
            }
        }

        return response;
    },

    async moveItem(itemId, newPosition) {
        const response = await fetchJSON(`${API_URL}/move`, {
            method: 'POST',
            body: JSON.stringify({
                itemId,
                newPosition
            })
        });

        if (response.success) {
            // Update cache if successful
            if (cachedInventory) {
                cachedInventory = await this.getInventory(true);
            }
        }

        return response;
    },

    // Optimistic update helpers to reduce API calls
    updateLocalInventory(inventoryManager) {
        // Update cache with optimistic state without API call
        cachedInventory = inventoryManager.toServerFormat();
    },

    clearCache() {
        cachedInventory = null;
    }
};