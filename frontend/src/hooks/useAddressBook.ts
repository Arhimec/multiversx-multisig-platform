const STORAGE_KEY = 'mvx-multisig-address-book';

interface Contact {
    name: string;
    address: string;
    notes?: string;
    createdAt: string;
}

export const getContacts = (): Contact[] => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
};

export const saveContacts = (contacts: Contact[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
};

export const getContactName = (address: string): string | null => {
    const contacts = getContacts();
    const found = contacts.find(c => c.address === address);
    return found ? found.name : null;
};

export const resolveAddress = (addressOrName: string): string | null => {
    const contacts = getContacts();
    const found = contacts.find(c => c.name.toLowerCase() === addressOrName.toLowerCase());
    return found ? found.address : null;
};
