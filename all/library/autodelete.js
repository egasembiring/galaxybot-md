const fs = require("fs");
const toMs = require("ms");

const autodelete = JSON.parse(fs.readFileSync('./database/autodelete.json'));
const autodeleteConfig = JSON.parse(fs.readFileSync('./database/autodelete-config.json'));

/**
 * Add message to auto-delete queue
 * @param {String} messageId - Message ID to delete
 * @param {String} chatId - Chat ID where message was sent
 * @param {String} userId - User ID who sent the message
 * @param {Number} deleteAfter - Time in milliseconds after which to delete
 * @param {Object} _dir - Auto-delete array
 */
const addAutoDelete = (messageId, chatId, userId, deleteAfter, _dir) => {
    const deleteTime = Date.now() + deleteAfter;
    const obj = { 
        messageId: messageId,
        chatId: chatId, 
        userId: userId,
        deleteTime: deleteTime,
        createdAt: Date.now()
    };
    _dir.push(obj);
    fs.writeFileSync("./database/autodelete.json", JSON.stringify(_dir, null, 2));
};

/**
 * Get user's auto-delete configuration
 * @param {String} userId - User ID
 * @param {Object} _config - Config object
 * @returns {Object} User configuration
 */
const getUserAutoDeleteConfig = (userId, _config) => {
    return _config[userId] || {
        enabled: false,
        defaultTime: "5m", // Default 5 minutes
        messageTypes: ["text", "image", "video", "audio", "document"], // All message types
        groupsEnabled: true,
        privateEnabled: true
    };
};

/**
 * Set user's auto-delete configuration
 * @param {String} userId - User ID
 * @param {Object} config - User configuration
 * @param {Object} _config - Config object
 */
const setUserAutoDeleteConfig = (userId, config, _config) => {
    _config[userId] = { ...getUserAutoDeleteConfig(userId, _config), ...config };
    fs.writeFileSync("./database/autodelete-config.json", JSON.stringify(_config, null, 2));
};

/**
 * Check if user has auto-delete enabled
 * @param {String} userId - User ID
 * @param {Object} _config - Config object
 * @returns {Boolean}
 */
const isAutoDeleteEnabled = (userId, _config) => {
    const userConfig = getUserAutoDeleteConfig(userId, _config);
    return userConfig.enabled;
};

/**
 * Process auto-delete queue and delete expired messages
 * @param {Object} neo - WhatsApp client
 * @param {Object} _dir - Auto-delete array
 */
const processAutoDelete = (neo, _dir) => {
    setInterval(() => {
        const now = Date.now();
        const toDelete = [];
        
        _dir.forEach((item, index) => {
            if (now >= item.deleteTime) {
                toDelete.push({ index, item });
            }
        });
        
        toDelete.reverse().forEach(async ({ index, item }) => {
            try {
                // Delete the message
                await neo.sendMessage(item.chatId, { 
                    delete: { 
                        id: item.messageId,
                        fromMe: true,
                        remoteJid: item.chatId
                    }
                });
                console.log(`Auto-deleted message ${item.messageId} from ${item.chatId}`);
            } catch (err) {
                console.error('Auto-delete error:', err);
            }
            
            // Remove from queue
            _dir.splice(index, 1);
        });
        
        if (toDelete.length > 0) {
            fs.writeFileSync("./database/autodelete.json", JSON.stringify(_dir, null, 2));
        }
    }, 10000); // Check every 10 seconds
};

/**
 * Convert time string to milliseconds
 * @param {String} timeStr - Time string (e.g., "5m", "1h", "30s")
 * @returns {Number} Time in milliseconds
 */
const parseTimeString = (timeStr) => {
    try {
        return toMs(timeStr);
    } catch (err) {
        return null;
    }
};

/**
 * Get pending auto-delete messages for user
 * @param {String} userId - User ID
 * @param {Object} _dir - Auto-delete array
 * @returns {Array} Pending messages
 */
const getUserPendingDeletes = (userId, _dir) => {
    return _dir.filter(item => item.userId === userId);
};

/**
 * Remove specific auto-delete entry
 * @param {String} messageId - Message ID
 * @param {String} userId - User ID
 * @param {Object} _dir - Auto-delete array
 */
const removeAutoDelete = (messageId, userId, _dir) => {
    const index = _dir.findIndex(item => item.messageId === messageId && item.userId === userId);
    if (index !== -1) {
        _dir.splice(index, 1);
        fs.writeFileSync("./database/autodelete.json", JSON.stringify(_dir, null, 2));
        return true;
    }
    return false;
};

module.exports = {
    addAutoDelete,
    getUserAutoDeleteConfig,
    setUserAutoDeleteConfig,
    isAutoDeleteEnabled,
    processAutoDelete,
    parseTimeString,
    getUserPendingDeletes,
    removeAutoDelete,
    autodelete,
    autodeleteConfig
};