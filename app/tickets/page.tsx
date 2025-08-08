"use client";

import TicketModal from "@/components/ticket-modal";

export default function TicketsPage() {
  // Simply show the modal - no other content needed
  return (
    <>
      <TicketModal isOpen={true} />
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-purple-900 via-purple-600 to-pink-500" />
      
    </>
  
  );
}