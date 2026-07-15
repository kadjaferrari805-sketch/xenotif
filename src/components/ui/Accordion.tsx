'use client'

import * as RadixAccordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Accordion = RadixAccordion.Root

export function AccordionItem({ className, ...props }: React.ComponentPropsWithoutRef<typeof RadixAccordion.Item>) {
  return <RadixAccordion.Item className={cn('border-b border-sport-border', className)} {...props} />
}

export function AccordionTrigger({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof RadixAccordion.Trigger>) {
  return (
    <RadixAccordion.Header>
      <RadixAccordion.Trigger
        className={cn(
          'group flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-bold text-sport-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sport-orange/50 rounded',
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown size={16} aria-hidden="true" className="shrink-0 text-sport-orange transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  )
}

export function AccordionContent({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof RadixAccordion.Content>) {
  return (
    <RadixAccordion.Content
      className={cn(
        'accordion-content overflow-hidden text-sm text-sport-gray leading-relaxed data-[state=open]:animate-[accordion-down_0.25s_ease-out] data-[state=closed]:animate-[accordion-up_0.25s_ease-out]',
        className,
      )}
      {...props}
    >
      <div className="pb-4">{children}</div>
    </RadixAccordion.Content>
  )
}
