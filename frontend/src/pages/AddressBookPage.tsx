import { useState, useEffect } from 'react';
import {
    BookUser,
    Plus,
    Trash2,
    Copy,
    Check,
    Search,
    User,
    AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Contact {
    name: string;
    address: string;
    notes?: string;
    createdAt: string;
}

const STORAGE_KEY = 'mvx-multisig-address-book';

const getContacts = (): Contact[] => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
};

const saveContacts = (contacts: Contact[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
};

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export const AddressBookPage = () => {
    const [contacts, setContacts] = useState<Contact[]>(getContacts());
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [newNotes, setNewNotes] = useState('');
    const [copiedAddr, setCopiedAddr] = useState<string | null>(null);

    useEffect(() => {
        saveContacts(contacts);
    }, [contacts]);

    const handleAdd = () => {
        if (!newName.trim() || !newAddress.trim()) {
            toast.error('Name and address are required');
            return;
        }
        if (!newAddress.startsWith('erd1') || newAddress.length !== 62) {
            toast.error('Invalid MultiversX address (must start with erd1)');
            return;
        }
        if (contacts.some(c => c.address === newAddress)) {
            toast.error('Address already in contacts');
            return;
        }

        setContacts(prev => [...prev, {
            name: newName.trim(),
            address: newAddress.trim(),
            notes: newNotes.trim() || undefined,
            createdAt: new Date().toISOString(),
        }]);

        setNewName('');
        setNewAddress('');
        setNewNotes('');
        setShowAdd(false);
        toast.success('Contact added!');
    };

    const handleDelete = (address: string) => {
        setContacts(prev => prev.filter(c => c.address !== address));
        toast.success('Contact removed');
    };

    const handleCopy = (address: string) => {
        navigator.clipboard.writeText(address);
        setCopiedAddr(address);
        setTimeout(() => setCopiedAddr(null), 2000);
    };

    const truncateAddress = (addr: string) => `${addr.slice(0, 10)}...${addr.slice(-6)}`;

    const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.address.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-3xl font-bold text-white mb-2">Address Book</h1>
                <p className="text-slate-400">Save contacts for quick access when creating proposals</p>
            </motion.div>

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-3 mb-6"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-surface border border-surface-border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/40 transition-colors"
                    />
                </div>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="btn-primary px-4 py-2.5 text-sm flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Contact
                </button>
            </motion.div>

            {/* Add form */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card p-6 mb-6 overflow-hidden"
                    >
                        <h3 className="text-sm font-semibold text-white mb-4">New Contact</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs text-slate-500 mb-1.5">Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Treasury Wallet"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-bg border border-surface-border rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/40"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 mb-1.5">Notes (optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Cold storage"
                                    value={newNotes}
                                    onChange={e => setNewNotes(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-bg border border-surface-border rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-primary/40"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs text-slate-500 mb-1.5">Address</label>
                            <input
                                type="text"
                                placeholder="erd1..."
                                value={newAddress}
                                onChange={e => setNewAddress(e.target.value)}
                                className="w-full px-4 py-2.5 bg-bg border border-surface-border rounded-xl text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-primary/40"
                            />
                        </div>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowAdd(false)}
                                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                className="btn-primary px-6 py-2 text-sm"
                            >
                                Save Contact
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contacts list */}
            {filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <BookUser className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No contacts yet</h3>
                    <p className="text-sm text-slate-500 mb-6">
                        Add frequently used addresses for quick access.
                    </p>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="inline-flex items-center gap-2 btn-primary px-6 py-2.5 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add First Contact
                    </button>
                </motion.div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-2"
                >
                    {filtered.map((contact) => (
                        <motion.div
                            key={contact.address}
                            variants={item}
                            className="glass-card p-4 flex items-center gap-4 group hover:border-primary/20 transition-all"
                        >
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-primary" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-white">{contact.name}</h4>
                                <p className="text-xs text-slate-500 font-mono truncate">
                                    {truncateAddress(contact.address)}
                                </p>
                                {contact.notes && (
                                    <p className="text-xs text-slate-600 mt-0.5">{contact.notes}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleCopy(contact.address)}
                                    className="p-2 rounded-lg hover:bg-surface-hover text-slate-400 hover:text-white transition-all"
                                    title="Copy address"
                                >
                                    {copiedAddr === contact.address ? (
                                        <Check className="w-4 h-4 text-green-400" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </button>
                                <button
                                    onClick={() => handleDelete(contact.address)}
                                    className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
                                    title="Delete contact"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};
