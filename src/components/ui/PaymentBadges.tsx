export function VisaBadge({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const w = size === 'sm' ? 44 : 52
  const h = size === 'sm' ? 28 : 34
  return (
    <svg viewBox="0 0 52 34" width={w} height={h} aria-label="Visa" role="img">
      <rect width="52" height="34" rx="5" fill="white" stroke="#D1D5DB" strokeWidth="1"/>
      {/* Blue stripe at bottom */}
      <rect y="26" width="52" height="8" rx="0" fill="#1A1F71"/>
      <rect y="26" width="52" height="8" rx="0" ry="0" fill="#1A1F71"/>
      <rect x="0" y="26" width="52" height="8" fill="#1A1F71"/>
      {/* Bottom rounded corners fix */}
      <rect x="0" y="26" width="5" height="8" fill="white"/>
      <rect x="47" y="26" width="5" height="8" fill="white"/>
      <rect y="29" width="52" height="5" rx="0" fill="#1A1F71"/>
      {/* VISA wordmark */}
      <text
        x="26" y="20"
        fontFamily="Arial Black, Arial, sans-serif"
        fontWeight="900"
        fontSize="13"
        fill="#1A1F71"
        textAnchor="middle"
        fontStyle="italic"
        letterSpacing="-0.5"
      >VISA</text>
    </svg>
  )
}

export function MastercardBadge({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const w = size === 'sm' ? 44 : 52
  const h = size === 'sm' ? 28 : 34
  return (
    <svg viewBox="0 0 52 34" width={w} height={h} aria-label="Mastercard" role="img">
      <rect width="52" height="34" rx="5" fill="white" stroke="#D1D5DB" strokeWidth="1"/>
      {/* Left red circle */}
      <circle cx="20" cy="17" r="10" fill="#EB001B"/>
      {/* Right orange circle */}
      <circle cx="32" cy="17" r="10" fill="#F79E1B"/>
      {/* Overlap - bright orange */}
      <path
        d="M26 9.3a10 10 0 0 1 0 15.4A10 10 0 0 1 26 9.3z"
        fill="#FF5F00"
      />
    </svg>
  )
}

export function PaypalBadge({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const w = size === 'sm' ? 52 : 62
  const h = size === 'sm' ? 28 : 34
  return (
    <svg viewBox="0 0 62 34" width={w} height={h} aria-label="PayPal" role="img">
      <rect width="62" height="34" rx="5" fill="white" stroke="#D1D5DB" strokeWidth="1"/>
      {/* P logo — dark blue */}
      <path
        d="M12 9h6.5c2.8 0 4.5 1.4 4.1 4-.5 3.1-2.8 4.4-5.4 4.4H15l-.9 5.6H11L12 9z"
        fill="#003087"
      />
      {/* P logo — light blue (offset) */}
      <path
        d="M15 11h5.5c2.4 0 3.8 1.2 3.5 3.4-.4 2.6-2.4 3.8-4.6 3.8h-1.7l-.8 4.8H14l1-12z"
        fill="#009CDE"
      />
      {/* "PayPal" text */}
      <text x="27" y="22" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="11" fill="#003087">Pay</text>
      <text x="45" y="22" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="11" fill="#009CDE">Pal</text>
    </svg>
  )
}

export function ApplePayBadge({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const w = size === 'sm' ? 52 : 62
  const h = size === 'sm' ? 28 : 34
  return (
    <svg viewBox="0 0 62 34" width={w} height={h} aria-label="Apple Pay" role="img">
      <rect width="62" height="34" rx="5" fill="#000000"/>
      {/* Apple logo path */}
      <path
        d="M18.5 11.2c.7-.9.6-2.1.6-2.1s-1.1.1-1.9.7c-.7.6-1.1 1.5-1 2.3 1 .1 1.6-.5 2.3-.9zm.7 1.3c-1.3-.1-2.4.7-3 .7-.6 0-1.6-.7-2.6-.7-1.3 0-2.5.8-3.2 2-.9 1.5-.2 3.8.6 5 .4.6.9 1.3 1.6 1.2.6 0 .9-.4 1.7-.4.8 0 1 .4 1.7.4.7 0 1.1-.6 1.5-1.2.5-.7.7-1.3.7-1.3s-1.5-.6-1.5-2.2c0-1.4 1.1-2 1.1-2s-.6-.9-1.6-1z"
        fill="white"
      />
      {/* "Pay" text */}
      <text x="33" y="22" fontFamily="-apple-system, SF Pro Display, Arial, sans-serif" fontWeight="500" fontSize="12" fill="white" letterSpacing="0">Pay</text>
    </svg>
  )
}

export function GooglePayBadge({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const w = size === 'sm' ? 56 : 66
  const h = size === 'sm' ? 28 : 34
  return (
    <svg viewBox="0 0 66 34" width={w} height={h} aria-label="Google Pay" role="img">
      <rect width="66" height="34" rx="5" fill="white" stroke="#D1D5DB" strokeWidth="1"/>
      {/* Google G */}
      <path d="M20 17c0-2.8 2-5 4.7-5 1.3 0 2.4.5 3.3 1.3l-1.3 1.3c-.5-.5-1.2-.9-2-.9-1.8 0-3.1 1.4-3.1 3.3s1.3 3.3 3.1 3.3c1.7 0 2.7-.9 2.9-2.2H24.7v-1.7h5.1c.1.4.1.7.1 1.1 0 3-1.9 4.8-5.2 4.8C22 23 20 20.8 20 17z" fill="#4285F4"/>
      <path d="M29.8 15.4h-2.1v1.7H29v2.2c-.2 1.3-1.2 2.2-2.9 2.2-1.8 0-3.1-1.4-3.1-3.3 0-1.9 1.3-3.3 3.1-3.3.8 0 1.5.4 2 .9l1.3-1.3c-.9-.8-2-.3-2-.3" fill="#34A853"/>
      {/* Pay text */}
      <text x="35" y="22" fontFamily="Arial, sans-serif" fontWeight="500" fontSize="12" fill="#3C4043" letterSpacing="0">Pay</text>
    </svg>
  )
}

export function PaymentBadgesRow({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap" aria-label="Moyens de paiement acceptés">
      <VisaBadge size={size} />
      <MastercardBadge size={size} />
      <PaypalBadge size={size} />
      <ApplePayBadge size={size} />
      <GooglePayBadge size={size} />
    </div>
  )
}
