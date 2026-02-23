import axios from 'axios';
import API_BASE_URL from '../../config';

class NotificationService {
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
                console.log(`Received ${count} new notifications`);
                return notifications;
            }

        } catch (error) {
            if (error.response?.status !== 403) {
                console.error('Error checking notifications:', error);
            }
        }
    }
}

export default new NotificationService();