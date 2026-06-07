import { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { z } from 'zod';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { supabase } from '../../lib/supabase';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import type { Hospital } from '../../types/hospital';

const PHONE_RE = /^\+?[\d\s\-()+]{7,}$/;

const HospitalSchema = z.object({
  name: z.string().min(2, 'Hospital name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().optional(),
  lga: z.string().optional(),
  phone: z.string().refine((v) => PHONE_RE.test(v), 'Enter a valid phone number'),
  email: z.union([z.string().email('Enter a valid email'), z.literal('')]).optional(),
  ownership: z.enum(['public', 'private']),
  specialties: z.string(),
  visiting_hours: z.string().optional(),
  description: z.string().optional(),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
});

type FormData = z.infer<typeof HospitalSchema>;
type FieldErrors = Partial<Record<keyof FormData, string>>;

interface HospitalFormProps {
  open: boolean;
  onClose: () => void;
  hospital: Hospital | null;
  onSaved: () => void;
}

const EMPTY: FormData = {
  name: '',
  address: '',
  city: '',
  lga: '',
  phone: '',
  email: '',
  ownership: 'public',
  specialties: '',
  visiting_hours: '',
  description: '',
  lat: null,
  lng: null,
};

const BUCKET = 'hospital-photos';
const MAX_BYTES = 5 * 1024 * 1024;

export function HospitalForm({ open, onClose, hospital, onSaved }: HospitalFormProps) {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (hospital) {
      setForm({
        name: hospital.name,
        address: hospital.address,
        city: hospital.city ?? '',
        lga: hospital.lga ?? '',
        phone: hospital.phone,
        email: hospital.email ?? '',
        ownership: hospital.ownership,
        specialties: hospital.specialties?.join(', ') ?? '',
        visiting_hours: hospital.visiting_hours ?? '',
        description: hospital.description ?? '',
        lat: hospital.lat ?? null,
        lng: hospital.lng ?? null,
      });
      setPhotoUrl(hospital.photo_url ?? null);
    } else {
      setForm(EMPTY);
      setPhotoUrl(null);
    }
    setErrors({});
    setServerError(null);
    setPhotoError(null);
  }, [hospital, open]);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (file.size > MAX_BYTES) {
      setPhotoError('File too large — max 5 MB');
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    setUploadingPhoto(true);
    setPhotoError(null);

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (upErr) {
      setPhotoError(upErr.message);
      setUploadingPhoto(false);
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    setPhotoUrl(data.publicUrl);
    setUploadingPhoto(false);
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const result = HospitalSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FormData;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    setServerError(null);

    const payload = {
      ...result.data,
      specialties: result.data.specialties
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      photo_url: photoUrl,
    };

    const { error } = hospital
      ? await supabase.from('hospitals').update(payload).eq('id', hospital.id)
      : await supabase.from('hospitals').insert(payload);

    if (error) {
      setServerError(error.message);
    } else {
      onSaved();
    }
    setSubmitting(false);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={hospital ? 'Edit hospital' : 'Add hospital'}
      maxWidth="max-w-2xl"
    >
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="name"
            label="Hospital name *"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            error={errors.name}
          />
          <Input
            id="phone"
            label="Phone *"
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            error={errors.phone}
          />
        </div>

        <Input
          id="address"
          label="Address *"
          value={form.address}
          onChange={(e) => set('address', e.target.value)}
          error={errors.address}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="city"
            label="City"
            value={form.city ?? ''}
            onChange={(e) => set('city', e.target.value)}
          />
          <Input
            id="lga"
            label="LGA"
            value={form.lga ?? ''}
            onChange={(e) => set('lga', e.target.value)}
          />
        </div>

        <Input
          id="email"
          label="Email"
          type="email"
          value={form.email ?? ''}
          onChange={(e) => set('email', e.target.value)}
          error={errors.email}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="ownership" className="text-[13px] font-medium text-ink">
            Ownership *
          </label>
          <select
            id="ownership"
            value={form.ownership}
            onChange={(e) => set('ownership', e.target.value as 'public' | 'private')}
            className="rounded-[5px] border border-line bg-surface px-3 py-2.5 text-[14px] text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <Input
          id="specialties"
          label="Specialties (comma-separated)"
          value={form.specialties}
          onChange={(e) => set('specialties', e.target.value)}
          placeholder="e.g. maternity, emergency, dental"
        />

        <Input
          id="visiting_hours"
          label="Visiting hours"
          value={form.visiting_hours ?? ''}
          onChange={(e) => set('visiting_hours', e.target.value)}
          placeholder="e.g. Mon–Fri 9am–5pm"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="lat"
            label="Latitude"
            type="number"
            step="any"
            value={form.lat ?? ''}
            onChange={(e) => set('lat', e.target.value ? Number(e.target.value) : null)}
            placeholder="e.g. 6.5244"
          />
          <Input
            id="lng"
            label="Longitude"
            type="number"
            step="any"
            value={form.lng ?? ''}
            onChange={(e) => set('lng', e.target.value ? Number(e.target.value) : null)}
            placeholder="e.g. 3.3792"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-ink">Hospital photo</span>
          <div className="flex items-start gap-4">
            {photoUrl ? (
              <div className="relative shrink-0">
                <img
                  src={photoUrl}
                  alt="Hospital preview"
                  className="h-20 w-28 rounded-[5px] border border-line object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl(null)}
                  aria-label="Remove photo"
                  className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full border border-line bg-surface text-soft hover:text-error"
                >
                  <X className="size-3" strokeWidth={2.5} />
                </button>
              </div>
            ) : (
              <div className="grid h-20 w-28 shrink-0 place-items-center rounded-[5px] border border-dashed border-line bg-muted">
                <ImageIcon className="size-6 text-soft" strokeWidth={1.5} />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label
                htmlFor="photo-upload"
                className={`flex cursor-pointer items-center gap-2 self-start rounded-[5px] border border-line bg-surface px-3 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-muted ${uploadingPhoto ? 'pointer-events-none opacity-60' : ''}`}
              >
                <Upload className="size-4" strokeWidth={2} />
                {uploadingPhoto ? 'Uploading…' : photoUrl ? 'Replace photo' : 'Upload photo'}
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={handlePhotoUpload}
                  disabled={uploadingPhoto}
                />
              </label>
              <p className="text-[11px] text-soft">JPG, PNG or WebP · max 5 MB</p>
              {photoError && <p className="text-[12px] text-error">{photoError}</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-ink">Description (Markdown)</span>
          <div data-color-mode="light">
            <MDEditor
              value={form.description ?? ''}
              onChange={(val) => set('description', val ?? '')}
              preview="edit"
              height={200}
            />
          </div>
        </div>

        {serverError && (
          <p role="alert" className="text-[13px] text-error">
            {serverError}
          </p>
        )}

        <div className="flex justify-end gap-3 border-t border-line pt-4">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting || uploadingPhoto}>
            {submitting ? 'Saving…' : hospital ? 'Save changes' : 'Add hospital'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
