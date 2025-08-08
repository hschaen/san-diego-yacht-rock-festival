"use client";

import HamburgerMenu from "@/components/hamburger-menu";
import Link from "next/link";
import { ArrowLeft, Check, Star, Users, Wine, X } from "lucide-react";
import { useTicketsPage, fallbackContent } from "@/lib/hooks/useContent";
import { useState, useEffect } from "react";

export default function TicketsPage() {
  const { content } = useTicketsPage();
  const [showModal, setShowModal] = useState(false);
  
  // Use content from database or fallback
  const pageContent = content || fallbackContent.tickets;
  const tiers = pageContent.tiers || [];
  const infoSection = pageContent.infoSection || { title: '', items: [] };
  const ticketsEnabled = pageContent.ticketsEnabled ?? false;

  useEffect(() => {
    // Show modal if tickets are not enabled
    if (!ticketsEnabled && content) {
      setShowModal(true);
    }
  }, [ticketsEnabled, content]);

  // Icon mapping for tiers
  const getIcon = (tierName: string) => {
    if (tierName.toLowerCase().includes('general')) return Users;
    if (tierName.toLowerCase().includes('vip')) return Star;
    if (tierName.toLowerCase().includes('captain') || tierName.toLowerCase().includes('premium')) return Wine;
    return Users;
  };

  // Legacy hardcoded tickets for when no tiers in database
  const legacyTicketTypes = [
    {
      id: "general",
      name: "General Admission",
      price: "$75",
      icon: Users,
      features: [
        "Festival entry",
        "Access to all performances",
        "Food truck access",
        "Cash bar available",
      ],
      popular: false,
      soldOut: false,
    },
    {
      id: "vip",
      name: "VIP Experience",
      price: "$150",
      icon: Star,
      features: [
        "Festival entry",
        "VIP viewing area",
        "Complimentary welcome drink",
        "Private bar access",
        "VIP restrooms",
        "Meet & greet opportunities",
      ],
      popular: true,
      soldOut: false,
    },
    {
      id: "captain",
      name: "Captain's Table",
      price: "$250",
      icon: Wine,
      features: [
        "All VIP benefits",
        "Premium open bar",
        "Exclusive lounge access",
        "Complimentary food",
        "Artist meet & greets",
        "Commemorative merchandise",
        "Priority parking",
      ],
      popular: false,
      soldOut: false,
    },
  ];

  // Use database tiers if available, otherwise use legacy tickets
  const ticketTypes = tiers.length > 0 ? tiers.map(tier => ({
    id: tier.id,
    name: tier.name,
    price: `$${tier.price}`,
    icon: getIcon(tier.name),
    features: tier.features,
    popular: tier.popular || false,
    soldOut: tier.soldOut || false
  })) : legacyTicketTypes;

  const handlePurchase = (ticketId: string) => {
    const ticket = ticketTypes.find(t => t.id === ticketId);
    if (ticket && 'soldOut' in ticket && ticket.soldOut) {
      alert('This ticket tier is sold out!');
    } else {
      // Show RSVP message with option to go to homepage
      if (window.confirm('RSVP to be notified when Tickets go on Sale\n\nClick OK to go to the homepage and RSVP')) {
        window.location.href = '/';
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-purple-900 via-purple-600 to-pink-500">
      <HamburgerMenu />
      
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-purple-600/30 to-pink-500/50" />
        
        <div className="absolute bottom-0 left-0 right-0 h-1/2">
          <div className="grid-lines absolute inset-0" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-cyan-300 hover:text-yellow-400 transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-semibold">Back</span>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-yellow-400 drop-shadow-lg mb-2">
            {pageContent.title || 'GET YOUR TICKETS'}
          </h1>
          <p className="text-cyan-300 text-lg">{pageContent.subtitle || 'Be the first to know when tickets go on sale!'}</p>
        </div>

        <div className="max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ticketTypes.map((ticket) => {
              const Icon = ticket.icon;
              return (
                <div
                  key={ticket.id}
                  className={`
                    relative backdrop-blur-sm rounded-lg p-6 transition-all hover:scale-105
                    ${
                      ticket.popular
                        ? "bg-gradient-to-b from-yellow-400/30 to-orange-400/30 border-2 border-yellow-400"
                        : "bg-purple-800/40 border border-purple-400"
                    }
                  `}
                >
                  {ticket.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-yellow-400 text-purple-900 px-4 py-1 rounded-full text-sm font-bold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div
                      className={`
                        w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center
                        ${
                          ticket.popular
                            ? "bg-yellow-400 text-purple-900"
                            : "bg-cyan-400 text-purple-900"
                        }
                      `}
                    >
                      <Icon size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{ticket.name}</h3>
                    <p className="text-4xl font-bold text-yellow-400">{ticket.price}</p>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {ticket.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check size={20} className="text-cyan-300 flex-shrink-0 mt-0.5" />
                        <span className="text-white text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePurchase(ticket.id)}
                    disabled={ticket.soldOut}
                    className={`
                      w-full py-3 px-4 rounded-lg font-bold transition-colors
                      ${
                        ticket.soldOut
                          ? "bg-gray-600 cursor-not-allowed text-gray-400"
                          : ticket.popular
                          ? "bg-yellow-400 hover:bg-yellow-300 text-purple-900"
                          : "bg-purple-600 hover:bg-purple-500 text-white"
                      }
                    `}
                  >
                    {ticket.soldOut ? 'Sold Out' : 'Get Notified'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Info section from database or fallback */}
          {(infoSection.items.length > 0 || legacyTicketTypes === ticketTypes) && (
            <div className="mt-12 bg-purple-900/50 backdrop-blur-sm rounded-lg p-6 border border-purple-400">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">
                {infoSection.title || 'Ticket Information:'}
              </h3>
              <ul className="space-y-2 text-purple-200">
                {infoSection.items.length > 0 ? (
                  infoSection.items.map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))
                ) : (
                  <>
                    <li>• All sales are final - no refunds</li>
                    <li>• Must be 21+ with valid ID</li>
                    <li>• Gates open at 4:30 PM</li>
                    <li>• Free parking available at Liberty Station</li>
                    <li>• Group discounts available for 10+ tickets</li>
                  </>
                )}
              </ul>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-cyan-300 text-sm">
              Having trouble? Contact us at {pageContent.contactEmail || 'tickets@sdyachtrockfest.com'}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-900/60 backdrop-blur-sm px-4 py-2 rounded-full">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
              <span className="text-purple-900 text-xs font-bold">LS</span>
            </div>
            <span className="text-yellow-400 font-semibold">LIBERTY STATION</span>
          </div>
        </div>
      </div>

      {/* Modal for when tickets are not on sale */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-gradient-to-b from-purple-900 to-pink-900 rounded-xl p-8 max-w-md w-full border-2 border-yellow-400 shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="text-center">
              <div className="mb-4">
                <span className="text-6xl">🎵</span>
              </div>
              <h2 className="text-3xl font-bold text-yellow-400 mb-3">
                Tickets aren't on sale yet!
              </h2>
              <p className="text-cyan-300 mb-6">
                Be the first to know when tickets become available for the smoothest yacht rock experience in San Diego!
              </p>
              
              <div className="space-y-3">
                <Link
                  href="/"
                  className="block w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-purple-900 font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
                >
                  Get Notified When Tickets Go On Sale
                </Link>
                
                <button
                  onClick={() => setShowModal(false)}
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Browse Ticket Options Anyway
                </button>
              </div>
              
              <p className="text-white/60 text-sm mt-4">
                Join our Captain's List for exclusive early access
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}