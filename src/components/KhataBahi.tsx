import React, { useState } from 'react';
import {
  Users,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Phone,
  CheckCircle2,
  Trash2,
  Calendar,
  X,
  Check,
} from 'lucide-react';
import { KhataContact, KhataEntry, KhataType, Language } from '../types';
import { getTranslation } from '../translations';
import { formatCurrency, formatDateGujarati } from '../utils/formatters';

interface KhataBahiProps {
  contacts: KhataContact[];
  onAddContact: (contact: Omit<KhataContact, 'id' | 'createdAt' | 'entries'>, initialAmount?: number) => void;
  onAddEntry: (contactId: string, entry: Omit<KhataEntry, 'id'>) => void;
  onSettleFull: (contactId: string) => void;
  onDeleteContact: (contactId: string) => void;
  language: Language;
  useGujDigits: boolean;
}

export const KhataBahi: React.FC<KhataBahiProps> = ({
  contacts,
  onAddContact,
  onAddEntry,
  onSettleFull,
  onDeleteContact,
  language,
  useGujDigits,
}) => {
  const t = getTranslation(language);
  const [activeTab, setActiveTab] = useState<KhataType>('to_give');
  const [selectedContact, setSelectedContact] = useState<KhataContact | null>(null);

  // Modal states
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showAddEntryModal, setShowAddEntryModal] = useState(false);

  // New Contact form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('કરિયાણા સ્ટોર');
  const [contactType, setContactType] = useState<KhataType>('to_give');
  const [initialAmount, setInitialAmount] = useState('');
  const [initialNote, setInitialNote] = useState('');

  // New Entry form state
  const [entryAmount, setEntryAmount] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [entryType, setEntryType] = useState<'borrowed' | 'settled'>('settled');
  const [entryNote, setEntryNote] = useState('');

  const toGiveContacts = contacts.filter((c) => c.type === 'to_give');
  const toReceiveContacts = contacts.filter((c) => c.type === 'to_receive');

  const totalToGive = toGiveContacts.reduce((sum, c) => sum + c.balance, 0);
  const totalToReceive = toReceiveContacts.reduce((sum, c) => sum + c.balance, 0);

  const displayedContacts = activeTab === 'to_give' ? toGiveContacts : toReceiveContacts;

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedAmt = parseFloat(initialAmount) || 0;
    onAddContact(
      {
        name: name.trim(),
        phone: phone.trim(),
        role: role.trim() || 'અન્ય',
        type: contactType,
        balance: parsedAmt,
      },
      parsedAmt
    );

    setName('');
    setPhone('');
    setInitialAmount('');
    setInitialNote('');
    setShowAddContactModal(false);
  };

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;
    const parsedAmt = parseFloat(entryAmount);
    if (isNaN(parsedAmt) || parsedAmt <= 0) return;

    onAddEntry(selectedContact.id, {
      amount: parsedAmt,
      date: entryDate,
      type: entryType,
      note: entryNote.trim() || (entryType === 'settled' ? 'ચુકવણી જમા' : 'નવો ઉધાર'),
    });

    setEntryAmount('');
    setEntryNote('');
    setShowAddEntryModal(false);

    // Refresh selected contact view
    const updated = contacts.find((c) => c.id === selectedContact.id);
    if (updated) setSelectedContact(updated);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with Total Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Total to give */}
        <div
          onClick={() => setActiveTab('to_give')}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            activeTab === 'to_give'
              ? 'bg-rose-50 border-rose-300 shadow-xs ring-1 ring-rose-400'
              : 'bg-white border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wide flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{t.toGive}</span>
            </span>
            <span className="text-xs font-semibold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
              {toGiveContacts.length} {language === 'gu' ? 'ખાતા' : 'Accounts'}
            </span>
          </div>
          <span className="text-2xl font-bold text-rose-800 tracking-tight">
            {formatCurrency(totalToGive, useGujDigits)}
          </span>
          <p className="text-[11px] text-rose-600/80 mt-1">
            {language === 'gu'
              ? 'દુકાનદાર કે અન્ય વ્યક્તિને ચૂકવવાના બાકી પૈસા'
              : 'Money you need to pay to vendors/others'}
          </p>
        </div>

        {/* Total to receive */}
        <div
          onClick={() => setActiveTab('to_receive')}
          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
            activeTab === 'to_receive'
              ? 'bg-emerald-50 border-emerald-300 shadow-xs ring-1 ring-emerald-400'
              : 'bg-white border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>{t.toReceive}</span>
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              {toReceiveContacts.length} {language === 'gu' ? 'ખાતા' : 'Accounts'}
            </span>
          </div>
          <span className="text-2xl font-bold text-emerald-800 tracking-tight">
            {formatCurrency(totalToReceive, useGujDigits)}
          </span>
          <p className="text-[11px] text-emerald-700/80 mt-1">
            {language === 'gu'
              ? 'કોઈની પાસેથી લેવાના નીકળતા બાકી પૈસા'
              : 'Money others owe to you'}
          </p>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-white rounded-xl p-3 border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
          <button
            onClick={() => setActiveTab('to_give')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'to_give'
                ? 'bg-white text-rose-700 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.toGive}
          </button>
          <button
            onClick={() => setActiveTab('to_receive')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'to_receive'
                ? 'bg-white text-emerald-800 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t.toReceive}
          </button>
        </div>

        <button
          onClick={() => {
            setContactType(activeTab);
            setShowAddContactModal(true);
          }}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.addContact}</span>
        </button>
      </div>

      {/* Contacts Grid */}
      {displayedContacts.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-stone-200">
          <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-stone-600 font-medium text-sm">{t.noContacts}</p>
          <button
            onClick={() => {
              setContactType(activeTab);
              setShowAddContactModal(true);
            }}
            className="mt-3 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shadow-xs"
          >
            + {t.addContact}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {displayedContacts.map((contact) => {
            const isSettled = contact.balance === 0;

            return (
              <div
                key={contact.id}
                className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-2xs hover:border-amber-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-stone-900">
                        {contact.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                        <span className="font-medium text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded">
                          {contact.role}
                        </span>
                        {contact.phone && (
                          <>
                            <span>·</span>
                            <a
                              href={`tel:${contact.phone}`}
                              className="text-stone-600 hover:text-amber-700 flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{contact.phone}</span>
                            </a>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="text-right shrink-0">
                      <span
                        className={`text-base sm:text-lg font-bold tracking-tight block ${
                          isSettled
                            ? 'text-stone-400'
                            : contact.type === 'to_give'
                            ? 'text-rose-700'
                            : 'text-emerald-700'
                        }`}
                      >
                        {formatCurrency(contact.balance, useGujDigits)}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {isSettled
                          ? language === 'gu' ? 'ચુકતે થયેલ ✓' : 'Settled'
                          : language === 'gu' ? 'બાકી રકમ' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Latest Entry Preview */}
                  {contact.entries && contact.entries.length > 0 && (
                    <div className="mt-3 bg-stone-50 rounded-lg p-2 text-xs text-stone-600 border border-stone-100">
                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                        <span>{language === 'gu' ? 'છેલ્લી એન્ટ્રી:' : 'Last Entry:'}</span>
                        <span>{contact.entries[contact.entries.length - 1].date}</span>
                      </div>
                      <p className="font-medium text-stone-800 mt-0.5 truncate">
                        {contact.entries[contact.entries.length - 1].note} (
                        {formatCurrency(
                          contact.entries[contact.entries.length - 1].amount,
                          useGujDigits
                        )}
                        )
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedContact(contact);
                      setShowAddEntryModal(true);
                    }}
                    className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg text-center transition-colors"
                  >
                    + {language === 'gu' ? 'રકમ આપો/લો' : 'Add Entry'}
                  </button>

                  {!isSettled && (
                    <button
                      onClick={() => onSettleFull(contact.id)}
                      className="py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors"
                      title={t.settleFull}
                    >
                      {language === 'gu' ? 'ચુકતે કરો ✓' : 'Settle'}
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteContact(contact.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title={t.deleteBtn}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-stone-900 text-base">{t.addContact}</h3>
              <button
                onClick={() => setShowAddContactModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="p-5 space-y-3.5">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setContactType('to_give')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    contactType === 'to_give'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-stone-600'
                  }`}
                >
                  {t.toGive}
                </button>
                <button
                  type="button"
                  onClick={() => setContactType('to_receive')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    contactType === 'to_receive'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-stone-600'
                  }`}
                >
                  {t.toReceive}
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t.contactName} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="દા.ત., પટેલ કિરાણા / રમેશભાઈ"
                  required
                  autoFocus
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.contactRole}
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="દા.ત., કરિયાણું, મિત્ર, સગા"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.contactPhone}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9825000000"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t.initialBalance}
                </label>
                <input
                  type="number"
                  min="0"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddContactModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-xs"
                >
                  {t.saveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Entry Modal for existing contact */}
      {showAddEntryModal && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-stone-200 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="font-bold text-stone-900 text-base">
                  {selectedContact.name} ({selectedContact.role})
                </h3>
                <p className="text-xs text-stone-500">
                  {language === 'gu' ? 'હાલ બાકી રકમ:' : 'Current Balance:'}{' '}
                  <span className="font-bold text-stone-800">
                    {formatCurrency(selectedContact.balance, useGujDigits)}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setShowAddEntryModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="p-5 space-y-3.5">
              {/* Type Switcher: Settled (ચુકવ્યા) vs Borrowed (વધારાનો ઉધાર) */}
              <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setEntryType('settled')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    entryType === 'settled'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-stone-600'
                  }`}
                >
                  {language === 'gu' ? 'ચુકવણી કરી (-)' : 'Payment Settled (-)'}
                </button>
                <button
                  type="button"
                  onClick={() => setEntryType('borrowed')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    entryType === 'borrowed'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'text-stone-600'
                  }`}
                >
                  {language === 'gu' ? 'નવો ઉધાર વધાર્યો (+)' : 'Added Borrowed (+)'}
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t.amount} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={entryAmount}
                  onChange={(e) => setEntryAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  autoFocus
                  className="w-full px-3 py-2 text-lg font-bold bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t.date}
                </label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'gu' ? 'નોંધ / વિગત' : 'Note / Reason'}
                </label>
                <input
                  type="text"
                  value={entryNote}
                  onChange={(e) => setEntryNote(e.target.value)}
                  placeholder={
                    entryType === 'settled'
                      ? language === 'gu' ? 'દા.ત., Google Pay થી ચૂકવ્યા' : 'e.g. Paid via UPI'
                      : language === 'gu' ? 'દા.ત., નવી ખરીદી કરી' : 'e.g. New purchase'
                  }
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEntryModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  {t.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-xs"
                >
                  {t.saveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
