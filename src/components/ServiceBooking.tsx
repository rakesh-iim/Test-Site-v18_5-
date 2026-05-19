import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowLeft, Check } from 'lucide-react';

interface ServiceBookingProps {
  onSuccess?: (data: any) => void;
  price?: number;
  currencySymbol?: string;
}

const CITIES = ["Ahmedabad", "Surat", "Vadodara", "Bangalore", "Pune", "Delhi/NCR"];
const PROPERTY_TYPES = ["Apartment", "Independent House / Villa", "Under Construction / Empty Shell", "Penthouse / Duplex", "Commercial / Office Space"];
const TIME_SLOTS = ["10:00 AM – 12:00 PM", "12:00 PM – 02:00 PM", "02:00 PM – 04:00 PM", "04:00 PM – 06:00 PM"];
const STEPS = ["Location", "Schedule", "Details"];

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

  const anim = {
    initial: { opacity: 0, x: 20, filter: 'blur(3px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, x: -20, filter: 'blur(3px)' },
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
  };

  /* ─── SUCCESS ─── */
  if (isSuccess) {
    return (
      <div className="bf-card">
        <div className="bf-success">
          <div className="bf-success-glow" />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 14 }}>
            <div className="bf-success-icon">
              <Check />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3>Booking Confirmed</h3>
            <p>
              Thank you, <strong>{formData.name.split(' ')[0]}</strong>. Our expert will visit on{' '}
              <span className="green">{new Date(formData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</span>{' '}
              between {formData.timeSlot}.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bf-success-details">
            {[["Service", "Expert Home Consultation", false], ["City", formData.city, false], ["Property", formData.propertyType, false], ["Amount Paid", `${currencySymbol}${price}`, true]].map(([l, v, isGreen], i) => (
              <div key={i} className="bf-success-row">
                <span className="label">{l as string}</span>
                <span className={`value${isGreen ? ' green' : ''}`}>{v as string}</span>
              </div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <button className="bf-success-btn" onClick={() => { setStep(1); setIsSuccess(false); setFormData({ city: '', propertyType: '', date: '', timeSlot: '', pincode: '', notes: '', name: '', phone: '', email: '' }); }}>
              Book Another Consultation
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ─── MAIN FORM ─── */
  return (
    <div className="bf-card">
      {/* ── STEP BAR ── */}
      <div className="bf-steps">
        <div className="bf-steps-inner">
          {STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <div className="bf-step">
                <div className={`bf-step-num${step > i + 1 ? ' done' : step === i + 1 ? ' active' : ''}`}>
                  {step > i + 1 ? <Check /> : i + 1}
                </div>
                <span className={`bf-step-label${step >= i + 1 ? ' active' : ''}`}>{label}</span>
              </div>
              {i < 2 && (
                <div className="bf-step-line">
                  <div className="bf-step-line-fill" style={{ width: step > i + 1 ? '100%' : '0%' }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── FORM BODY ── */}
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="bf-body">
          <AnimatePresence mode="wait">
            {/* ═══ STEP 1 ═══ */}
            {step === 1 && (
              <motion.div key="s1" {...anim}>
                <div className="bf-label">Select your city</div>
                <div className="bf-pills">
                  {CITIES.map((city, idx) => (
                    <motion.button
                      key={city} type="button"
                      className={`bf-pill${formData.city === city ? ' selected' : ''}`}
                      onClick={() => set('city', city)}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.3 }}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    >
                      {city}
                    </motion.button>
                  ))}
                </div>

                <div className="bf-label">Property type</div>
                <div className="bf-radios">
                  {PROPERTY_TYPES.map((type, idx) => (
                    <motion.button
                      key={type} type="button"
                      className={`bf-radio${formData.propertyType === type ? ' selected' : ''}`}
                      onClick={() => set('propertyType', type)}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.04, duration: 0.3 }}
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    >
                      <div className="bf-radio-dot" />
                      {type}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 2 ═══ */}
            {step === 2 && (
              <motion.div key="s2" {...anim}>
                <div className="bf-label">Preferred date</div>
                <input type="date" name="date" min={minDate} value={formData.date} onChange={onChange}
                  className="bf-input mb" />

                <div className="bf-label">Time slot</div>
                <div className="bf-times">
                  {TIME_SLOTS.map((slot, idx) => (
                    <motion.button
                      key={slot} type="button"
                      className={`bf-time${formData.timeSlot === slot ? ' selected' : ''}`}
                      onClick={() => set('timeSlot', slot)}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.06, duration: 0.3 }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    >
                      {slot}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 3 ═══ */}
            {step === 3 && (
              <motion.div key="s3" {...anim}>
                <div className="bf-field-grid">
                  <div>
                    <div className="bf-field-label">Full Name</div>
                    <input type="text" name="name" placeholder="Your name" value={formData.name} onChange={onChange} className="bf-input" />
                  </div>
                  <div>
                    <div className="bf-field-label">Phone</div>
                    <input type="tel" name="phone" placeholder="98765 43210" value={formData.phone} onChange={onChange} className="bf-input" />
                  </div>
                </div>
                <div className="bf-field-grid">
                  <div>
                    <div className="bf-field-label">Email <span>(optional)</span></div>
                    <input type="email" name="email" placeholder="you@email.com" value={formData.email} onChange={onChange} className="bf-input" />
                  </div>
                  <div>
                    <div className="bf-field-label">Pincode</div>
                    <input type="text" name="pincode" placeholder="380015" value={formData.pincode} onChange={onChange} className="bf-input" />
                  </div>
                </div>
                <div>
                  <div className="bf-field-label">Address / Notes <span>(optional)</span></div>
                  <textarea name="notes" placeholder="Your address or special requirements…" value={formData.notes} onChange={onChange} rows={3}
                    className="bf-input bf-textarea" />
                </div>

                <motion.div className="bf-summary" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div>City: <strong>{formData.city}</strong></div>
                  <div>Type: <strong>{formData.propertyType.split('/')[0].trim()}</strong></div>
                  <div>Date: <strong>{formData.date ? new Date(formData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</strong></div>
                  <div>Time: <strong>{formData.timeSlot ? formData.timeSlot.split('–')[0].trim() : '—'}</strong></div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── FOOTER ── */}
        <div className="bf-footer">
          {step > 1 && (
            <motion.button type="button" onClick={() => setStep(step - 1)} className="bf-back"
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}>
              <ArrowLeft />
            </motion.button>
          )}
          <motion.button type="submit" disabled={!valid || isSubmitting}
            className={`bf-submit ${valid && !isSubmitting ? 'enabled' : 'disabled'}`}
            whileHover={valid && !isSubmitting ? { scale: 1.015, y: -1 } : {}}
            whileTap={valid && !isSubmitting ? { scale: 0.985 } : {}}>
            {isSubmitting
              ? <div className="bf-spinner" />
              : step === 3
                ? <>Book & Pay {currencySymbol}{price} <ChevronRight /></>
                : <>Continue <ChevronRight /></>
            }
          </motion.button>
        </div>
      </form>
    </div>
  );
}
