import React from 'react'
import ReactDOM from 'react-dom/client'
import ServiceBooking from './components/ServiceBooking'

ReactDOM.createRoot(document.getElementById('react-booking-root') as HTMLElement).render(
  <React.StrictMode>
    <ServiceBooking 
      price={499} 
      currencySymbol="₹"
      onSuccess={(data) => {
        console.log("Booking completed!", data);
        // We will integrate Google Sheets here later as requested.
      }} 
    />
  </React.StrictMode>,
)
