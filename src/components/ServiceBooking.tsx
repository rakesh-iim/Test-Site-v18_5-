import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ServiceBookingProps {
  onSuccess?: (data: any) => void;
  price?: number;
  currencySymbol?: string;
}

const CITIES = ["Ahmedabad", "Surat", "Vadodara", "Bangalore", "Pune", "Delhi/NCR"];
const PROPERTY_TYPES = ["Apartment", "Independent House / Villa", "Under Construction / Empty Shell", "Penthouse / Duplex", "Commercial / Office Space"];
const TIME_SLOTS = ["10:00 AM – 12:00 PM", "12:00 PM – 02:00 PM", "02:00 PM – 04:00 PM", "04:00 PM – 06:00 PM"];

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
      <div className="bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.07)] overflow-hidden font-sans border border-gray-100">
        <div className="px-9 py-12 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#5ba585] to-[#4a8a6f] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#5ba585]/30">
              <CheckCircle2 size={36} color="#fff" strokeWidth={2} />
            </div>
          </motion.div>
          <h3 className="font-serif text-2xl font-bold text-[#1a1a2e] mb-2">Booking Confirmed</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-7">
            Thank you, <b className="text-[#1a1a2e] font-semibold">{formData.name.split(' ')[0]}</b>. Our expert will visit on{' '}
            <b className="text-[#5ba585] font-semibold">{new Date(formData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</b>{' '}
            between {formData.timeSlot}.
          </p>
          {[["Service", "Expert Home Consultation"], ["City", formData.city], ["Property", formData.propertyType], ["Amount Paid", `${currencySymbol}${price}`]].map(([l, v], i) => (
            <div key={i} className={cn("flex justify-between py-3 text-[13px]", i < 3 ? "border-b border-gray-100" : "")}>
              <span className="text-gray-500">{l}</span>
              <span className={cn("font-semibold", l === 'Amount Paid' ? "text-[#5ba585]" : "text-[#1a1a2e]")}>{v}</span>
            </div>
          ))}
          <button onClick={() => { setStep(1); setIsSuccess(false); setFormData({ city: '', propertyType: '', date: '', timeSlot: '', pincode: '', notes: '', name: '', phone: '', email: '' }); }}
            className="w-full h-[50px] rounded-[14px] bg-gradient-to-br from-[#5ba585] to-[#4a8a6f] text-white text-sm font-bold cursor-pointer mt-7 hover:shadow-lg hover:shadow-[#5ba585]/30 transition-all font-sans">
            Book Another Consultation
          </button>
        </div>
      </div>
    );
  }

  /* ─── MAIN FORM ─── */
  return (
    <div className="bg-white rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.07)] overflow-hidden font-sans border border-gray-100 flex flex-col h-full">
      {/* ── STEP BAR ── */}
      <div className="px-8 pt-6 pb-5 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between max-w-[300px] mx-auto">
          {["Location", "Schedule", "Details"].map((label, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-1.5 relative z-10 bg-gray-50/50 px-2">
                <div className={cn(
                  "w-8 h-8 rounded-full text-[13px] font-bold flex items-center justify-center transition-all duration-300 shadow-sm",
                  step > i + 1 ? "bg-[#5ba585] text-white shadow-[#5ba585]/30" : 
                  step === i + 1 ? "bg-[#5ba585] text-white ring-4 ring-[#5ba585]/20 shadow-[#5ba585]/30" : 
                  "bg-gray-200 text-gray-400"
                )}>
                  {step > i + 1 ? <CheckCircle2 size={16} strokeWidth={3} /> : i + 1}
                </div>
                <span className={cn(
                  "text-[10px] font-bold tracking-[0.08em] uppercase transition-colors duration-300",
                  step >= i + 1 ? "text-[#1a1a2e]" : "text-gray-400"
                )}>{label}</span>
              </div>
              {i < 2 && (
                <div className="flex-1 h-0.5 mx-2 bg-gray-200 relative -top-3">
                  <div 
                    className="absolute inset-0 bg-[#5ba585] transition-all duration-500 ease-in-out" 
                    style={{ width: step > i + 1 ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── FORM BODY ── */}
      <form onSubmit={submit} className="flex flex-col flex-1">
        <div className="px-8 pt-7 pb-5 min-h-[360px]">
          <AnimatePresence mode="wait">
            {/* ═══ STEP 1 ═══ */}
            {step === 1 && (
              <motion.div key="s1" {...anim}>
                <Label text="Select your city" />
                <div className="flex flex-wrap gap-2.5 mb-8">
                  {CITIES.map(city => (
                    <Pill key={city} label={city} selected={formData.city === city} onClick={() => set('city', city)} />
                  ))}
                </div>

                <Label text="Property type" />
                <div className="flex flex-col gap-2.5">
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
                  className="w-full px-4 py-3.5 rounded-[14px] text-sm font-medium border-2 border-gray-100 bg-gray-50 text-[#1a1a2e] outline-none transition-all duration-200 focus:border-[#5ba585] focus:bg-white focus:ring-4 focus:ring-[#5ba585]/10 mb-8" />

                <Label text="Time slot" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TIME_SLOTS.map(slot => (
                    <TimeCard key={slot} slot={slot} selected={formData.timeSlot === slot} onClick={() => set('timeSlot', slot)} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 3 ═══ */}
            {step === 3 && (
              <motion.div key="s3" {...anim}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Field label="Full Name" name="name" placeholder="Your name" value={formData.name} onChange={onChange} />
                  <Field label="Phone" name="phone" type="tel" placeholder="98765 43210" value={formData.phone} onChange={onChange} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Field label="Email" name="email" type="email" placeholder="you@email.com" value={formData.email} onChange={onChange} optional />
                  <Field label="Pincode" name="pincode" placeholder="380015" value={formData.pincode} onChange={onChange} />
                </div>
                <Field label="Address / Notes" name="notes" placeholder="Your address or special requirements…" value={formData.notes} onChange={onChange} optional textarea />

                {/* Summary Strip */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-4 py-3 rounded-xl bg-[#e8f5ee]/70 border border-[#5ba585]/20 mt-6 text-xs text-gray-700 font-medium">
                  <span className="flex items-center gap-1.5"><span className="text-base">📍</span> {formData.city}</span>
                  <span className="flex items-center gap-1.5"><span className="text-base">🏠</span> {formData.propertyType.split('/')[0].trim()}</span>
                  <span className="flex items-center gap-1.5"><span className="text-base">📅</span> {formData.date ? new Date(formData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</span>
                  <span className="flex items-center gap-1.5"><span className="text-base">🕐</span> {formData.timeSlot ? formData.timeSlot.split('–')[0].trim() : '—'}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── FOOTER ── */}
        <div className="px-8 py-5 flex items-center gap-3 border-t border-gray-100 bg-gray-50/50 mt-auto">
          {step > 1 && (
            <button type="button" onClick={() => setStep(step - 1)} 
              className="w-12 h-12 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center cursor-pointer text-gray-500 shrink-0 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow">
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>
          )}
          <button type="submit" disabled={!valid || isSubmitting} 
            className={cn(
              "flex-1 h-12 rounded-[14px] text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300",
              valid && !isSubmitting 
                ? "cursor-pointer bg-gradient-to-br from-[#5ba585] to-[#4a8a6f] text-white shadow-[0_6px_20px_rgba(91,165,133,0.3)] hover:shadow-[0_8px_25px_rgba(91,165,133,0.4)] hover:-translate-y-0.5" 
                : "cursor-not-allowed bg-gray-200 text-gray-400"
            )}>
            {isSubmitting
              ? <Spinner />
              : step === 3
                ? <>Book & Pay {currencySymbol}{price} <ChevronRight size={16} strokeWidth={2.5} /></>
                : <>Continue <ChevronRight size={16} strokeWidth={2.5} /></>
            }
          </button>
        </div>
      </form>
    </div>
  );
}

/* ════════════════════════════════════════════════
   SUB-COMPONENTS
   ════════════════════════════════════════════════ */

function Label({ text }: { text: string }) {
  return <div className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-gray-400 mb-3 font-sans">{text}</div>;
}

function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} 
      className={cn(
        "px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200 border-2 cursor-pointer font-sans",
        selected 
          ? "border-[#5ba585] bg-[#5ba585] text-white shadow-[0_4px_14px_rgba(91,165,133,0.3)]" 
          : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-gray-100 hover:text-gray-800"
      )}>
      {label}
    </button>
  );
}

function RadioRow({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} 
      className={cn(
        "flex items-center gap-3.5 px-4 py-3.5 rounded-[14px] text-sm font-medium text-left transition-all duration-200 w-full border-2 cursor-pointer font-sans group",
        selected 
          ? "border-[#5ba585] bg-[#e8f5ee]/70 text-[#1a1a2e]" 
          : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-gray-100"
      )}>
      <div className={cn(
        "w-[22px] h-[22px] rounded-full shrink-0 flex items-center justify-center transition-all duration-200",
        selected 
          ? "border-2 border-[#5ba585] bg-[#5ba585]" 
          : "border-2 border-gray-300 group-hover:border-gray-400 bg-white"
      )}>
        {selected && <CheckCircle2 size={14} color="#fff" strokeWidth={3} />}
      </div>
      {label}
    </button>
  );
}

function TimeCard({ slot, selected, onClick }: { slot: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} 
      className={cn(
        "px-3 py-4 rounded-[14px] text-[13px] font-semibold text-center transition-all duration-200 w-full border-2 cursor-pointer font-sans",
        selected 
          ? "border-[#5ba585] bg-[#5ba585] text-white shadow-[0_4px_14px_rgba(91,165,133,0.3)]" 
          : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-gray-100 hover:text-gray-800"
      )}>
      {slot}
    </button>
  );
}

function Field({ label, name, type = 'text', placeholder, value, onChange, optional, textarea }: {
  label: string; name: string; type?: string; placeholder: string; value: string;
  onChange: (e: any) => void; optional?: boolean; textarea?: boolean;
}) {
  const baseClasses = "w-full px-4 py-3.5 rounded-[14px] text-sm font-medium border-2 border-gray-100 bg-gray-50 text-[#1a1a2e] outline-none transition-all duration-200 focus:border-[#5ba585] focus:bg-white focus:ring-4 focus:ring-[#5ba585]/10 font-sans placeholder:text-gray-400";
  
  return (
    <div className={textarea ? "" : "mb-0"}>
      <div className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-gray-400 mb-2 font-sans">
        {label}{optional && <span className="font-normal text-gray-300"> (optional)</span>}
      </div>
      {textarea ? (
        <textarea name={name} placeholder={placeholder} value={value} onChange={onChange} rows={3}
          className={cn(baseClasses, "resize-none")} />
      ) : (
        <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange}
          className={baseClasses} />
      )}
    </div>
  );
}

function Spinner() {
  return <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />;
}
