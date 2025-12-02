import axios from 'axios';
import API_BASE_URL from '../../config';

class NotificationService {
    constructor() {
        this.pollInterval = null;
        this.listeners = [];
        this.isPolling = false;
    }

    // Start polling for new orders
    startPolling(intervalMs = 10000) { // Poll every 10 seconds
        if (this.isPolling) return;
        
        console.log('📡 Starting order notification polling...');
        this.isPolling = true;
        
        // Poll immediately
        this.checkForNewOrders();
        
        // Then poll at intervals
        this.pollInterval = setInterval(() => {
            this.checkForNewOrders();
        }, intervalMs);
    }

    // Stop polling
    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
            this.isPolling = false;
            console.log('📡 Stopped order notification polling');
        }
    }

    // Check for new orders
    async checkForNewOrders() {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) return;

            const response = await axios.get(
                `${API_BASE_URL}api/home/check-new-orders/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const { notifications, count } = response.data;
            
            if (count > 0) {
                console.log(`🔔 ${count} new order notification(s) received`);
                this.notifyListeners(notifications);
            }
        } catch (error) {
            // Silently fail - don't log errors for unauthorized users
            if (error.response?.status !== 403) {
                console.error('Error checking notifications:', error);
            }
        }
    }

    // Add listener for notifications
    addListener(callback) {
        this.listeners.push(callback);
    }

    // Remove listener
    removeListener(callback) {
        this.listeners = this.listeners.filter(cb => cb !== callback);
    }

    // Notify all listeners
    notifyListeners(notifications) {
        this.listeners.forEach(callback => {
            callback(notifications);
        });
    }
}

// Create and export a singleton instance
const notificationService = new NotificationService();
export default notificationService;