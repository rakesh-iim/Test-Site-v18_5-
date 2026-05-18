import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';

interface ServiceBookingProps {
  onSuccess?: (data: any) => void;
  price?: number;
  currencySymbol?: string;
}

const CITIES = ["Ahmedabad", "Surat", "Vadodara", "Bangalore", "Pune", "Delhi/NCR"];
const PROPERTY_TYPES = ["Apartment", "Independent House / Villa", "Under Construction / Empty Shell", "Penthouse / Duplex", "Commercial / Office Space"];
const TIME_SLOTS = ["10:00 AM – 12:00 PM", "12:00 PM – 02:00 PM", "02:00 PM – 04:00 PM", "04:00 PM – 06:00 PM"];

/* ── Design Tokens ── */
const C = {
  green: '#5ba585', greenDark: '#4a8a6f', greenLight: '#e8f5ee', greenGlow: 'rgba(91,165,133,0.3)',
  dark: '#1a1a2e', text: '#444', muted: '#999', border: '#eaeaea', bg: '#fafafa', white: '#fff', gold: '#d4a853',
  font: "'Inter', sans-serif", fontSerif: "'Playfair Display', serif",
  radius: '14px', radiusPill: '50px', shadow: '0 8px 40px rgba(0,0,0,0.07)',
};

export default function ServiceBooking({ onSuccess, price = 499, currencySymbol = "₹" }: ServiceBookingProps) {
  const [formData, setFormData] = useState({ city: '', propertyType: '', date: '', timeSlot: '', pincode: '', notes: '', name: '', phone: '', email: '' });
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const set = (key: string, val: string) => setFormData(p => ({ ...p, [key]: val }));
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(e.target.name, e.target.value);

  const v1 = formData.city && formData.propertyType;
  const v2 = formData.date && formData.timeSlot;
  const v3 = formData.name && formData.phone.length >= 10 && formData.pincode;
  const valid = step === 1 ? v1 : step === 2 ? v2 : v3;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3 && valid) return setStep(step + 1);
    if (step === 3 && valid) {
      setIsSubmitting(true);
      setTimeout(() => { setIsSubmitting(false); setIsSuccess(true); onSuccess?.(formData); }, 1500);
    }
  };

  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const anim = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -16 }, transition: { duration: 0.25 } };

  /* ─── SUCCESS ─── */
  if (isSuccess) {
    return (
      <div style={{ background: C.white, borderRadius: '20px', boxShadow: C.shadow, overflow: 'hidden', fontFamily: C.font }}>
        <div style={{ padding: '48px 36px', textAlign: 'center' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle2 size={36} color="#fff" strokeWidth={2} />
            </div>
          </motion.div>
          <h3 style={{ fontFamily: C.fontSerif, fontSize: 24, fontWeight: 700, color: C.dark, marginBottom: 8 }}>Booking Confirmed</h3>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 28 }}>
            Thank you, <b style={{ color: C.dark }}>{formData.name.split(' ')[0]}</b>. Our expert will visit on{' '}
            <b style={{ color: C.green }}>{new Date(formData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</b>{' '}
            between {formData.timeSlot}.
          </p>
          {[["Service", "Expert Home Consultation"], ["City", formData.city], ["Property", formData.propertyType], ["Amount Paid", `${currencySymbol}${price}`]].map(([l, v], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 3 ? `1px solid ${C.border}` : 'none', fontSize: 13 }}>
              <span style={{ color: C.muted }}>{l}</span>
              <span style={{ fontWeight: 600, color: l === 'Amount Paid' ? C.green : C.dark }}>{v}</span>
            </div>
          ))}
          <button onClick={() => { setStep(1); setIsSuccess(false); setFormData({ city: '', propertyType: '', date: '', timeSlot: '', pincode: '', notes: '', name: '', phone: '', email: '' }); }}
            style={{ width: '100%', height: 50, borderRadius: C.radius, background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 28, fontFamily: C.font }}>
            Book Another Consultation
          </button>
        </div>
      </div>
    );
  }

  /* ─── MAIN FORM ─── */
  return (
    <div style={{ background: C.white, borderRadius: '20px', boxShadow: C.shadow, overflow: 'hidden', fontFamily: C.font }}>

      {/* ── STEP BAR ── */}
      <div style={{ padding: '24px 32px 20px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {["Location", "Schedule", "Details"].map((label, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 60 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', fontSize: 13, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step > i + 1 ? C.green : step === i + 1 ? C.green : '#f0f0f0',
                  color: step >= i + 1 ? '#fff' : '#ccc',
                  transition: 'all 0.3s ease',
                }}>
                  {step > i + 1 ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: step >= i + 1 ? C.dark : '#ccc', transition: 'color 0.3s' }}>{label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 2, borderRadius: 1, margin: '0 12px 20px', background: step > i + 1 ? C.green : '#f0f0f0', transition: 'background 0.4s' }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── FORM BODY ── */}
      <form onSubmit={submit}>
        <div style={{ padding: '28px 32px 20px', minHeight: 340 }}>
          <AnimatePresence mode="wait">

            {/* ═══ STEP 1 ═══ */}
            {step === 1 && (
              <motion.div key="s1" {...anim}>
                <Label text="Select your city" />
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 10, marginBottom: 32 }}>
                  {CITIES.map(city => (
                    <Pill key={city} label={city} selected={formData.city === city} onClick={() => set('city', city)} />
                  ))}
                </div>

                <Label text="Property type" />
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                  {PROPERTY_TYPES.map(type => (
                    <RadioRow key={type} label={type} selected={formData.propertyType === type} onClick={() => set('propertyType', type)} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 2 ═══ */}
            {step === 2 && (
              <motion.div key="s2" {...anim}>
                <Label text="Preferred date" />
                <input type="date" name="date" min={minDate} value={formData.date} onChange={onChange}
                  style={{ ...inputStyle, marginBottom: 32, width: '100%' }}
                  onFocus={focusIn} onBlur={focusOut} />

                <Label text="Time slot" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {TIME_SLOTS.map(slot => (
                    <TimeCard key={slot} slot={slot} selected={formData.timeSlot === slot} onClick={() => set('timeSlot', slot)} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 3 ═══ */}
            {step === 3 && (
              <motion.div key="s3" {...anim}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <Field label="Full Name" name="name" placeholder="Your name" value={formData.name} onChange={onChange} />
                  <Field label="Phone" name="phone" type="tel" placeholder="98765 43210" value={formData.phone} onChange={onChange} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <Field label="Email" name="email" type="email" placeholder="you@email.com" value={formData.email} onChange={onChange} optional />
                  <Field label="Pincode" name="pincode" placeholder="380015" value={formData.pincode} onChange={onChange} />
                </div>
                <Field label="Address / Notes" name="notes" placeholder="Your address or special requirements…" value={formData.notes} onChange={onChange} optional textarea />

                {/* Summary Strip */}
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px 16px', padding: '12px 16px', borderRadius: 12, background: C.greenLight, marginTop: 20, fontSize: 12, color: C.text }}>
                  <span>📍 {formData.city}</span>
                  <span>🏠 {formData.propertyType.split('/')[0].trim()}</span>
                  <span>📅 {formData.date ? new Date(formData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</span>
                  <span>🕐 {formData.timeSlot ? formData.timeSlot.split('–')[0].trim() : '—'}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ padding: '16px 32px 24px', display: 'flex', alignItems: 'center', gap: 12, borderTop: `1px solid ${C.border}` }}>
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} style={{
              width: 44, height: 44, borderRadius: '50%', border: `2px solid ${C.border}`, background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.muted, flexShrink: 0,
            }}>
              <ArrowLeft size={18} />
            </button>
          )}
          <button type="submit" disabled={!valid || isSubmitting} style={{
            flex: 1, height: 50, borderRadius: C.radius, border: 'none', fontSize: 14, fontWeight: 700, fontFamily: C.font,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: valid && !isSubmitting ? 'pointer' : 'not-allowed',
            background: valid && !isSubmitting ? `linear-gradient(135deg, ${C.green}, ${C.greenDark})` : '#f0f0f0',
            color: valid && !isSubmitting ? '#fff' : '#ccc',
            boxShadow: valid && !isSubmitting ? `0 6px 20px ${C.greenGlow}` : 'none',
            transition: 'all 0.3s ease',
          }}>
            {isSubmitting
              ? <Spinner />
              : step === 3
                ? <>Book & Pay {currencySymbol}{price} <ChevronRight size={16} /></>
                : <>Continue <ChevronRight size={16} /></>
            }
          </button>
        </div>
      </form>
    </div>
  );
}

/* ════════════════════════════════════════════════
   SUB-COMPONENTS (inline-styled for reliability)
   ════════════════════════════════════════════════ */

function Label({ text }: { text: string }) {
  return <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: C.muted, marginBottom: 12, fontFamily: C.font }}>{text}</div>;
}

function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: '10px 22px', borderRadius: C.radiusPill, fontSize: 13, fontWeight: 600, fontFamily: C.font,
      border: selected ? `2px solid ${C.green}` : '2px solid #eee',
      background: selected ? C.green : '#f8f8f8', color: selected ? '#fff' : C.text,
      cursor: 'pointer', transition: 'all 0.2s ease',
      boxShadow: selected ? `0 4px 14px ${C.greenGlow}` : 'none',
    }}>
      {label}
    </button>
  );
}

function RadioRow({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: C.radius, fontSize: 14, fontWeight: 500, fontFamily: C.font, textAlign: 'left' as const,
      border: selected ? `2px solid ${C.green}` : '2px solid #f0f0f0', cursor: 'pointer',
      background: selected ? C.greenLight : '#fafafa', color: selected ? C.dark : '#666',
      transition: 'all 0.2s ease', width: '100%',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        border: selected ? `2px solid ${C.green}` : '2px solid #ddd',
        background: selected ? C.green : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
      }}>
        {selected && <CheckCircle2 size={14} color="#fff" />}
      </div>
      {label}
    </button>
  );
}

function TimeCard({ slot, selected, onClick }: { slot: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      padding: '16px 12px', borderRadius: C.radius, fontSize: 13, fontWeight: 600, fontFamily: C.font,
      border: selected ? `2px solid ${C.green}` : '2px solid #f0f0f0', textAlign: 'center' as const,
      background: selected ? C.green : '#fafafa', color: selected ? '#fff' : C.text, cursor: 'pointer',
      boxShadow: selected ? `0 4px 14px ${C.greenGlow}` : 'none', transition: 'all 0.2s ease', width: '100%',
    }}>
      {slot}
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '14px 16px', borderRadius: C.radius, fontSize: 14, fontWeight: 500, fontFamily: C.font,
  border: `2px solid ${C.border}`, background: C.bg, color: C.dark, outline: 'none', transition: 'all 0.2s',
  boxSizing: 'border-box' as const,
};

const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = C.green; e.target.style.background = C.white; e.target.style.boxShadow = `0 0 0 3px ${C.greenGlow}`;
};
const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  e.target.style.borderColor = C.border; e.target.style.background = C.bg; e.target.style.boxShadow = 'none';
};

function Field({ label, name, type = 'text', placeholder, value, onChange, optional, textarea }: {
  label: string; name: string; type?: string; placeholder: string; value: string;
  onChange: (e: any) => void; optional?: boolean; textarea?: boolean;
}) {
  return (
    <div style={{ marginBottom: textarea ? 0 : undefined }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.1em', color: '#aaa', marginBottom: 8, fontFamily: C.font }}>
        {label}{optional && <span style={{ fontWeight: 400, color: '#ccc' }}> (optional)</span>}
      </div>
      {textarea ? (
        <textarea name={name} placeholder={placeholder} value={value} onChange={onChange} rows={3}
          style={{ ...inputStyle, width: '100%', resize: 'none' as const }} onFocus={focusIn as any} onBlur={focusOut as any} />
      ) : (
        <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange}
          style={{ ...inputStyle, width: '100%' }} onFocus={focusIn} onBlur={focusOut} />
      )}
    </div>
  );
}

function Spinner() {
  return <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />;
}
