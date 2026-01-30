import { describe, it, expect } from 'vitest';
import { USER_GROUPS, getGroupById, getGroupName } from './groups';

describe('Group Constants & Utils', () => {
    it('should have basic roles defined', () => {
        expect(USER_GROUPS.GUEST).toBeDefined();
        expect(USER_GROUPS.ADMINISTRATOR).toBeDefined();
        expect(USER_GROUPS.ADMINISTRATOR.level).toBeGreaterThan(USER_GROUPS.GUEST.level);
    });

    it('should retrieve group by ID', () => {
        const admin = getGroupById(9);
        expect(admin.name).toBe('Administrator');
    });

    it('should fallback to GUEST for unknown ID', () => {
        const unknown = getGroupById(999);
        expect(unknown.name).toBe('Guest');
    });

    it('should retrieve group name by ID', () => {
        expect(getGroupName(2)).toBe('Listener');
    });

    it('should handle string IDs', () => {
        expect(getGroupName('3')).toBe('Creator');
    });
});
