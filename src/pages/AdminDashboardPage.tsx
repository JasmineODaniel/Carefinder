import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, UserPlus } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { HospitalForm } from '../features/admin/HospitalForm';
import { useAdminHospitals } from '../features/admin/useAdminHospitals';
import { useAdminReviews } from '../features/reviews/useAdminReviews';
import { supabase } from '../lib/supabase';
import type { Hospital } from '../types/hospital';

type Tab = 'hospitals' | 'reviews' | 'invite';

export function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>('hospitals');

  const { hospitals, loading: hLoading, error: hError, deleteHospital, refreshHospitals } =
    useAdminHospitals();
  const { reviews, loading: rLoading, error: rError, toggleHidden, deleteReview } =
    useAdminReviews();

  const [editHospital, setEditHospital] = useState<Hospital | null>(null);
  const [showForm, setShowForm] = useState(false);

  function openNewForm() { setEditHospital(null); setShowForm(true); }
  function openEditForm(h: Hospital) { setEditHospital(h); setShowForm(true); }

  async function handleDeleteHospital(id: string) {
    if (!confirm('Delete this hospital entry? This cannot be undone.')) return;
    await deleteHospital(id);
  }

  async function handleDeleteReview(id: string) {
    if (!confirm('Permanently delete this review?')) return;
    await deleteReview(id);
  }

  const visibleCount = reviews.filter((r) => !r.hidden).length;
  const hiddenCount = reviews.filter((r) => r.hidden).length;

  return (
    <PageLayout>
      <div className="mx-auto max-w-6xl px-6 py-8">

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-[20px] text-ink">ADMIN DASHBOARD</h1>
            <p className="mt-1 text-[13px] text-soft">Manage entries and moderate reviews</p>
          </div>
          {tab === 'hospitals' && (
            <Button onClick={openNewForm}>
              <Plus className="size-4" strokeWidth={2.5} />
              Add hospital
            </Button>
          )}
        </div>

        <div className="mb-6 flex gap-1 rounded-[5px] border border-line bg-canvas p-1 w-fit">
          {([
            { key: 'hospitals', label: `Hospitals (${hospitals.length})` },
            { key: 'reviews', label: `Reviews (${reviews.length})` },
            { key: 'invite', label: 'Invite Admin' },
          ] as { key: Tab; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-[5px] px-4 py-1.5 text-[13px] font-medium transition-colors ${
                tab === key ? 'bg-accent text-black' : 'text-soft hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'hospitals' && (
          <>
            {hLoading && <div className="flex justify-center py-12"><Spinner /></div>}
            {hError && (
              <div role="alert" className="rounded-[5px] border border-error-border bg-error-bg p-4 text-[14px] text-error">
                {hError}
              </div>
            )}
            {!hLoading && !hError && (
              <div className="overflow-hidden rounded-[5px] border border-line">
                <table className="w-full text-left">
                  <thead className="border-b border-line bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-soft">Name</th>
                      <th className="hidden px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-soft sm:table-cell">City</th>
                      <th className="hidden px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-soft md:table-cell">Ownership</th>
                      <th className="px-4 py-3 text-right text-[12px] font-semibold uppercase tracking-wide text-soft">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {hospitals.map((h) => (
                      <tr key={h.id} className="transition-colors hover:bg-canvas">
                        <td className="px-4 py-3 text-[14px] font-medium text-ink">{h.name}</td>
                        <td className="hidden px-4 py-3 text-[13px] text-soft sm:table-cell">{h.city ?? '—'}</td>
                        <td className="hidden px-4 py-3 text-[13px] capitalize text-soft md:table-cell">{h.ownership}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditForm(h)} aria-label={`Edit ${h.name}`}
                              className="rounded-[5px] p-1.5 text-soft transition-colors hover:bg-muted hover:text-ink">
                              <Pencil className="size-4" strokeWidth={2} />
                            </button>
                            <button onClick={() => handleDeleteHospital(h.id)} aria-label={`Delete ${h.name}`}
                              className="rounded-[5px] p-1.5 text-soft transition-colors hover:bg-error-bg hover:text-error">
                              <Trash2 className="size-4" strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {hospitals.length === 0 && (
                  <div className="p-12 text-center">
                    <p className="text-[14px] text-soft">No hospitals yet. Add the first one.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {tab === 'reviews' && (
          <>
            {rLoading && <div className="flex justify-center py-12"><Spinner /></div>}
            {rError && (
              <div role="alert" className="rounded-[5px] border border-error-border bg-error-bg p-4 text-[14px] text-error">
                {rError}
              </div>
            )}
            {!rLoading && !rError && (
              <>
                <div className="mb-4 flex gap-4 text-[13px] text-soft">
                  <span><span className="font-semibold text-ink">{visibleCount}</span> visible</span>
                  <span><span className="font-semibold text-ink">{hiddenCount}</span> hidden</span>
                </div>
                <div className="overflow-hidden rounded-[5px] border border-line">
                  <table className="w-full text-left">
                    <thead className="border-b border-line bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-soft">Hospital</th>
                        <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-soft">Rating</th>
                        <th className="hidden px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-soft md:table-cell">Review</th>
                        <th className="hidden px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-soft sm:table-cell">Date</th>
                        <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-soft">Status</th>
                        <th className="px-4 py-3 text-right text-[12px] font-semibold uppercase tracking-wide text-soft">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {reviews.map((r) => (
                        <tr key={r.id} className={`transition-colors hover:bg-canvas ${r.hidden ? 'opacity-50' : ''}`}>
                          <td className="px-4 py-3 text-[13px] font-medium text-ink">
                            {r.hospitals?.name ?? '—'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-0.5" aria-label={`${r.rating} stars`}>
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`size-3.5 ${i < r.rating ? 'fill-accent text-accent' : 'text-line'}`} strokeWidth={1.5} />
                              ))}
                            </div>
                          </td>
                          <td className="hidden px-4 py-3 text-[13px] text-soft md:table-cell max-w-[260px]">
                            <span className="line-clamp-2">{r.text ?? <em className="text-[#aaa]">No text</em>}</span>
                          </td>
                          <td className="hidden px-4 py-3 text-[12px] text-soft sm:table-cell whitespace-nowrap">
                            {new Date(r.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-[5px] px-2 py-0.5 text-[11px] font-semibold ${r.hidden ? 'bg-error-bg text-error' : 'bg-green-50 text-green-700'}`}>
                              {r.hidden ? 'Hidden' : 'Visible'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => toggleHidden(r.id, !r.hidden)}
                                aria-label={r.hidden ? 'Show review' : 'Hide review'}
                                className="rounded-[5px] p-1.5 text-soft transition-colors hover:bg-muted hover:text-ink"
                              >
                                {r.hidden ? <Eye className="size-4" strokeWidth={2} /> : <EyeOff className="size-4" strokeWidth={2} />}
                              </button>
                              <button
                                onClick={() => handleDeleteReview(r.id)}
                                aria-label="Delete review"
                                className="rounded-[5px] p-1.5 text-soft transition-colors hover:bg-error-bg hover:text-error"
                              >
                                <Trash2 className="size-4" strokeWidth={2} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {reviews.length === 0 && (
                    <div className="p-12 text-center">
                      <p className="text-[14px] text-soft">No reviews yet.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {tab === 'invite' && <InviteAdminPanel />}

        <HospitalForm
          open={showForm}
          onClose={() => setShowForm(false)}
          hospital={editHospital}
          onSaved={() => { setShowForm(false); refreshHospitals(); }}
        />
      </div>
    </PageLayout>
  );
}

function InviteAdminPanel() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleInvite(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setStatus('sending');
    const { error } = await supabase.functions.invoke('invite-admin', { body: { email } });
    if (error) {
      setErrorMsg(error.message ?? 'Failed to send invite.');
      setStatus('error');
    } else {
      setStatus('sent');
      setEmail('');
    }
  }

  return (
    <div className="max-w-md">
      <div className="rounded-[5px] border border-line bg-surface p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-[5px] bg-accent">
            <UserPlus className="size-4 text-black" strokeWidth={2} />
          </span>
          <div>
            <p className="text-[14px] font-semibold text-ink">Invite a new admin</p>
            <p className="text-[12px] text-soft">They'll receive an email to set their password.</p>
          </div>
        </div>

        {status === 'sent' ? (
          <div className="rounded-[5px] bg-green-50 p-4 text-[13px] text-green-700">
            Invite sent successfully. The recipient will receive an email from Supabase Auth.
          </div>
        ) : (
          <form onSubmit={handleInvite} className="flex flex-col gap-3">
            <div>
              <label htmlFor="invite-email" className="mb-1.5 block text-[12px] font-medium text-ink">
                Email address
              </label>
              <input
                id="invite-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="newadmin@example.com"
                className="w-full rounded-[5px] border border-line bg-canvas px-3 py-2.5 text-[13px] text-ink placeholder:text-soft focus:border-accent focus:outline-none"
              />
              {errorMsg && <p className="mt-1.5 text-[12px] text-error">{errorMsg}</p>}
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="flex items-center gap-2 self-start rounded-[5px] bg-accent px-4 py-2.5 text-[13px] font-semibold text-black transition hover:bg-accent-hover disabled:opacity-60"
            >
              <UserPlus className="size-4" strokeWidth={2} />
              {status === 'sending' ? 'Sending…' : 'Send invite'}
            </button>
          </form>
        )}
      </div>

      <p className="mt-3 text-[12px] text-soft">
        Invites are sent via Supabase Auth. The new admin's role is set automatically — no manual database changes needed.
      </p>
    </div>
  );
}
