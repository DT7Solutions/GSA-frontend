import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { Link } from 'react-router-dom';

const NotificationDropdown = ({ notificationCount, setNotificationCount }) => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(
                `${API_BASE_URL}api/home/notifications/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            setNotifications(response.data.notifications);
            setNotificationCount(response.data.unread_count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showDropdown) {
            fetchNotifications();
        }
    }, [showDropdown]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const markAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(
                `${API_BASE_URL}api/home/notifications/${notificationId}/mark-read/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            // Update local state
            setNotifications(prev => 
                prev.map(notif => 
                    notif.id === notificationId 
                        ? { ...notif, is_read: true } 
                        : notif
                )
            );
            
            // Update unread count
            setNotificationCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(
                `${API_BASE_URL}api/home/notifications/mark-all-read/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            // Update local state
            setNotifications(prev => 
                prev.map(notif => ({ ...notif, is_read: true }))
            );
            setNotificationCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return date.toLocaleDateString();
    };

    return (
        <div className='dropdown' ref={dropdownRef} style={{ position: 'relative' }}>
            <button
                className='position-relative d-flex justify-content-center align-items-center rounded-circle'
                type='button'
                style={{ width: '40px', height: '40px', border: '1px solid #ddd', background: 'white' }}
                onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(!showDropdown);
                }}
            >
                <Icon icon='mdi:bell-outline' className='text-xl' />
                {notificationCount > 0 && (
                    <span className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'>
                        {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                )}
            </button>
            
            {showDropdown && (
                <div 
                    className='dropdown-menu dropdown-menu-end show p-0'
                    style={{
                        width: '380px',
                        maxHeight: '500px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 8px)',
                        zIndex: 1050,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                        <div className='d-flex justify-content-between align-items-center p-3 border-bottom'>
                            <h6 className='mb-0 fw-semibold'>Notifications</h6>
                            {notifications.length > 0 && (
                                <button
                                    className='btn-theme btn-sm text-white radius-5 d-inline-flex align-items-center gap-1'
                                    onClick={markAllAsRead}
                                    style={{ fontSize: '12px', padding: '4px 12px' }}
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                        
                        <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
                            {loading ? (
                                <div className='text-center p-4'>
                                    <div className='spinner-border spinner-border-sm' role='status'>
                                        <span className='visually-hidden'>Loading...</span>
                                    </div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className='text-center p-4 text-muted'>
                                    <Icon icon='mdi:bell-off-outline' className='text-4xl mb-2' />
                                    <p className='mb-0'>No notifications</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`notification-item p-3 border-bottom ${!notification.is_read ? 'bg-light' : ''}`}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            if (!notification.is_read) {
                                                markAsRead(notification.id);
                                            }
                                        }}
                                    >
                                        <div className='d-flex gap-3'>
                                            <div 
                                                className='d-flex align-items-center justify-content-center rounded-circle bg-primary'
                                                style={{ width: '40px', height: '40px', minWidth: '40px' }}
                                            >
                                                <Icon icon='mdi:cart' className='text-white text-xl' />
                                            </div>
                                            <div className='flex-grow-1'>
                                                <div className='d-flex justify-content-between align-items-start'>
                                                    <Link 
                                                        to={`/order-detail/${notification.order_id}`}
                                                        className='text-decoration-none text-dark'
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setShowDropdown(false);
                                                        }}
                                                    >
                                                        <p className='mb-1 fw-semibold' style={{ fontSize: '14px' }}>
                                                            New Order #{notification.order_id}
                                                        </p>
                                                    </Link>
                                                    {!notification.is_read && (
                                                        <span 
                                                            className='badge bg-primary'
                                                            style={{ fontSize: '8px', padding: '2px 6px' }}
                                                        >
                                                            NEW
                                                        </span>
                                                    )}
                                                </div>
                                                <p className='mb-1 text-muted' style={{ fontSize: '13px' }}>
                                                    From: {notification.customer_name}
                                                </p>
                                                <p className='mb-1 text-success fw-semibold' style={{ fontSize: '13px' }}>
                                                    ₹{parseFloat(notification.total_amount).toFixed(2)}
                                                </p>
                                                <p className='mb-0 text-muted' style={{ fontSize: '12px' }}>
                                                    <Icon icon='mdi:clock-outline' className='me-1' />
                                                    {formatTimestamp(notification.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        {notifications.length > 0 && (
                            <div className='p-2 border-top text-center '>
                                <Link 
                                    to='/OrderList' 
                                    className='btn-theme btn-sm text-white  radius-5 d-inline-flex align-items-center gap-1 '
                                    onClick={() => setShowDropdown(false)}
                                >
                                    View all orders
                                </Link>
                            </div>
                        )}
                    </div>
               
            )}
        </div>
    );
};

export default NotificationDropdown;