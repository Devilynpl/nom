/**
 * Constants defining the different user groups and their properties.
 * @type {Object.<string, {id: number, name: string, level: number, color: string}>}
 */
export const USER_GROUPS = {
    GUEST: { id: 1, name: 'Guest', level: 0, color: '#9ca3af' },
    LISTENER: { id: 2, name: 'Listener', level: 1, color: '#3b82f6' },
    CREATOR: { id: 3, name: 'Creator', level: 2, color: '#8b5cf6' },
    CREATOR_PLUS: { id: 4, name: 'Creator Plus', level: 3, color: '#d946ef' },
    CREATOR_VIP: { id: 5, name: 'Creator VIP', level: 4, color: '#f59e0b' },
    AGENT: { id: 6, name: 'Agent', level: 5, color: '#10b981' },
    MODERATOR: { id: 7, name: 'Moderator', level: 6, color: '#ef4444' },
    CO_ADMIN: { id: 8, name: 'Co-Admin', level: 7, color: '#f43f5e' },
    ADMINISTRATOR: { id: 9, name: 'Administrator', level: 8, color: '#7c3aed' },
};

/**
 * Retrieves a user group object by its ID.
 * @param {number|string} id - The unique identifier of the group.
 * @returns {{id: number, name: string, level: number, color: string}} The group object or GUEST if not found.
 */
export const getGroupById = (id) => {
    return Object.values(USER_GROUPS).find(g => g.id === Number(id)) || USER_GROUPS.GUEST;
};

/**
 * Retrieves the display name of a user group by its ID.
 * @param {number|string} id - The unique identifier of the group.
 * @returns {string} The name of the group.
 */
export const getGroupName = (id) => {
    return getGroupById(id).name;
};
