//notifications.ts
/**
 * Email notification configuration
 * 
 * This file defines email recipients and notification settings.
 * Previously, recipients were configured via EMAIL_TO environment variable.
 */

/**
 * Email notification configuration
 */
export const emailConfig = {
    /**
     * Email recipients for price reports
     * 
     * TODO: Update this array with actual recipient email addresses
     * Example: ['user@example.com', 'admin@example.com']
     */
    recipients: [
        process.env.EMAIL_TO || 'marczakmonika83@gmail.com'
    ],

    /** Email subject line */
    subject: '📈 Codzienny raport o produktach',

    /** Sender display name */
    senderName: 'My Watchdog',
};
