import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Hospital {
  name: string
  address: string
  city: string | null
  phone: string
  email: string | null
  specialties: string[]
  ownership: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS })
  }

  try {
    const { to, hospitals, shareUrl }: { to: string; hospitals: Hospital[]; shareUrl: string } =
      await req.json()

    const rows = hospitals
      .map(
        (h) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:13px">${h.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b">${h.city ?? '—'}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:13px">${h.phone}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b">${(h.specialties ?? []).join(', ') || '—'}</td>
        </tr>`,
      )
      .join('')

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:ui-sans-serif,sans-serif;color:#0f172a">
  <div style="max-width:620px;margin:40px auto;background:#fff;border-radius:5px;border:1px solid #e2e8f0;overflow:hidden">
    <div style="background:#00e5d4;padding:24px 32px">
      <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:.08em;color:rgba(0,0,0,.5)">CAREFINDER</p>
      <h1 style="margin:4px 0 0;font-size:20px;font-weight:700;color:#000">Hospital list shared with you</h1>
    </div>
    <div style="padding:32px">
      <p style="margin:0 0 20px;font-size:14px;color:#64748b">
        ${hospitals.length} Nigerian hospital${hospitals.length !== 1 ? 's' : ''} from Carefinder.
      </p>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="background:#f1f5f9">
            <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;letter-spacing:.05em;color:#64748b">HOSPITAL</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;letter-spacing:.05em;color:#64748b">CITY</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;letter-spacing:.05em;color:#64748b">PHONE</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;letter-spacing:.05em;color:#64748b">SPECIALTIES</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="margin-top:28px">
        <a href="${shareUrl}"
           style="display:inline-block;background:#00e5d4;color:#000;font-weight:600;font-size:13px;padding:11px 22px;border-radius:5px;text-decoration:none">
          View on Carefinder →
        </a>
      </div>
    </div>
  </div>
</body>
</html>`

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Carefinder <onboarding@resend.dev>',
        to: [to],
        subject: `${hospitals.length} hospital${hospitals.length !== 1 ? 's' : ''} shared via Carefinder`,
        html,
      }),
    })

    if (!resendRes.ok) {
      const err = await resendRes.json()
      return new Response(JSON.stringify({ error: err }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...CORS },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json', ...CORS },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS },
    })
  }
})
