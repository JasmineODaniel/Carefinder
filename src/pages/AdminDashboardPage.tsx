import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageLayout } from '../components/layout/PageLayout';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { HospitalForm } from '../features/admin/HospitalForm';
import { useAdminHospitals } from '../features/admin/useAdminHospitals';
import type { Hospital } from '../types/hospital';

export function AdminDashboardPage() {
  const { hospitals, loading, error, deleteHospital, refreshHospitals } = useAdminHospitals();
  const [editHospital, setEditHospital] = useState<Hospital | null>(null);
  const [showForm, setShowForm] = useState(false);

  function openNewForm() {
    setEditHospital(null);
    setShowForm(true);
  }

  function openEditForm(hospital: Hospital) {
    setEditHospital(hospital);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this hospital entry?')) return;
    await deleteHospital(id);
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-[20px] text-ink">ADMIN DASHBOARD</h1>
            <p className="mt-1 text-[13px] text-soft">Manage hospital entries</p>
          </div>
          <Button onClick={openNewForm}>
            <Plus className="size-4" strokeWidth={2.5} />
            Add hospital
          </Button>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-card border border-error-border bg-error-bg p-4 text-[14px] text-error"
          >
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-hidden rounded-card border border-line">
            <table className="w-full text-left">
              <thead className="border-b border-line bg-muted">
                <tr>
                  <th className="px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-soft">
                    Name
                  </th>
                  <th className="hidden px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-soft sm:table-cell">
                    City
                  </th>
                  <th className="hidden px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-soft md:table-cell">
                    Ownership
                  </th>
                  <th className="px-4 py-3 text-right text-[12px] font-semibold uppercase tracking-wide text-soft">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {hospitals.map((h) => (
                  <tr key={h.id} className="transition-colors hover:bg-canvas">
                    <td className="px-4 py-3 text-[14px] font-medium text-ink">{h.name}</td>
                    <td className="hidden px-4 py-3 text-[13px] text-soft sm:table-cell">
                      {h.city ?? '—'}
                    </td>
                    <td className="hidden px-4 py-3 text-[13px] capitalize text-soft md:table-cell">
                      {h.ownership}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(h)}
                          aria-label={`Edit ${h.name}`}
                          className="rounded-[5px] p-1.5 text-soft transition-colors hover:bg-muted hover:text-ink"
                        >
                          <Pencil className="size-4" strokeWidth={2} />
                        </button>
                        <button
                          onClick={() => handleDelete(h.id)}
                          aria-label={`Delete ${h.name}`}
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

            {hospitals.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-[14px] text-soft">No hospitals yet. Add the first one.</p>
              </div>
            )}
          </div>
        )}

        <HospitalForm
          open={showForm}
          onClose={() => setShowForm(false)}
          hospital={editHospital}
          onSaved={() => {
            setShowForm(false);
            refreshHospitals();
          }}
        />
      </div>
    </PageLayout>
  );
}
