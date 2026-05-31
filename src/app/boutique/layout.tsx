import { CartButton } from '@/components/boutique/CartButton'

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartButton />
    </>
  )
}
