import { useState } from 'react';
import { Check, Copy, Mail } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useShareLink } from './useShareLink';
import { supabase } from '../../lib/supabase';
import { isValidEmail } from '../../lib/utils';
import type { Hospital } from '../../types/hospital';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  hospitals: Hospital[];
}

export function ShareModal({ open, onClose, hospitals }: ShareModalProps) {
  const [searchParams] = useSearchParams();
  const { generateLink, copyToClipboard } = useShareLink();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const shareUrl = generateLink(searchParams);

  async function handleCopy() {
    await copyToClipboard(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleEmailShare(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setEmailError('Enter a valid email address.');
      return;
    }
    setEmailError('');
    setSending(true);
    try {
      const { error: fnError } = await supabase.functions.invoke('share-hospitals', {
        body: { to: email, hospitals: hospitals.slice(0, 50), shareUrl },
      });
      if (fnError) throw fnError;
      setSent(true);
    } catch {
      setEmailError('Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Share hospitals">
      <div className="space-y-6">
        <div>
          <p className="mb-3 text-[13px] font-medium text-ink">Shareable link</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={shareUrl}
              aria-label="Shareable link"
              className="min-w-0 flex-1 rounded-[5px] border border-line bg-muted px-3 py-2 text-[13px] text-soft"
            />
            <button
              onClick={handleCopy}
              aria-label={copied ? 'Copied' : 'Copy link'}
              className="flex items-center gap-1.5 rounded-[5px] border border-line bg-surface px-3 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-muted"
            >
              {copied ? (
                <Check className="size-4 text-green-600" strokeWidth={2} />
              ) : (
                <Copy className="size-4" strokeWidth={2} />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="border-t border-line pt-5">
          <p className="mb-3 text-[13px] font-medium text-ink">Send via email</p>
          {sent ? (
            <div className="rounded-[5px] bg-green-50 p-4 text-[13px] text-green-700">
              Email sent successfully!
            </div>
          ) : (
            <form onSubmit={handleEmailShare} className="flex flex-col gap-3">
              <Input
                id="share-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="recipient@example.com"
                label="Recipient email"
                error={emailError}
              />
              <Button type="submit" disabled={sending} className="self-start">
                <Mail className="size-4" strokeWidth={2} />
                {sending ? 'Sending…' : `Send ${hospitals.length} hospitals`}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}
