"use client";

import HamburgerMenu from "@/components/hamburger-menu";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Music, Utensils } from "lucide-react";
import { useSchedulePage, fallbackContent } from "@/lib/hooks/useContent";

export default function SchedulePage() {
  const { content } = useSchedulePage();
  
  // Use content from database or fallback
  const pageContent = content || fallbackContent.schedule;
  const events = pageContent.events || [];
  const notes = pageContent.notes || [];

  // Icon mapping for backward compatibility
  const getIcon = (iconString?: string) => {
    switch(iconString) {
      case '📍': return MapPin;
      case '🎵': return Music;
      case '🍽️': return Utensils;
      case '🕐': return Clock;
      default: return Music;
    }
  };

  // Legacy hardcoded schedule for when no events in database
  const legacySchedule = [
    {
      time: "4:30 PM",
      title: "Gates Open",
      description: "Welcome aboard! Get your wristbands and explore the venue",
      icon: MapPin,
      category: "venue",
    },
    {
      time: "5:00 PM",
      title: "The Doobie Brothers Tribute",
      description: "Opening act kicks off the smooth sounds",
      icon: Music,
      category: "music",
    },
    {
      time: "5:45 PM",
      title: "Ambrosia",
      description: "Classic yacht rock vibes",
      icon: Music,
      category: "music",
    },
    {
      time: "6:30 PM",
      title: "Player",
      description: "Baby come back! Sing along to the hits",
      icon: Music,
      category: "music",
    },
    {
      time: "7:00 PM",
      title: "Food & Beverage Break",
      description: "Enjoy local food trucks and craft cocktails",
      icon: Utensils,
      category: "break",
    },
    {
      time: "7:30 PM",
      title: "Christopher Cross",
      description: "Sailing into the sunset with smooth classics",
      icon: Music,
      category: "music",
    },
    {
      time: "9:00 PM",
      title: "Yacht Rock Revue",
      description: "Headliner performance - The ultimate yacht rock experience!",
      icon: Music,
      category: "headliner",
    },
    {
      time: "10:00 PM",
      title: "Event Ends",
      description: "Thanks for sailing with us!",
      icon: Clock,
      category: "venue",
    },
  ];

  // Use database events if available, otherwise use legacy schedule
  const schedule = events.length > 0 ? events.map(event => ({
    time: event.time,
    title: event.title,
    description: event.description,
    icon: getIcon(event.icon),
    category: event.title.toLowerCase().includes('headliner') ? 'headliner' :
              event.title.toLowerCase().includes('gates') ? 'venue' :
              event.title.toLowerCase().includes('food') || event.title.toLowerCase().includes('break') ? 'break' :
              'music'
  })) : legacySchedule;

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
            {pageContent.title || 'EVENT SCHEDULE'}
          </h1>
          <p className="text-cyan-300 text-lg">{pageContent.date || 'Saturday, October 11, 2025'}</p>
        </div>

        <div className="max-w-4xl mx-auto w-full">
          <div className="space-y-4">
            {schedule.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`
                    relative backdrop-blur-sm rounded-lg p-4 sm:p-6 transition-all hover:scale-105
                    ${
                      item.category === "headliner"
                        ? "bg-gradient-to-r from-yellow-400/30 to-orange-400/30 border-2 border-yellow-400"
                        : item.category === "music"
                        ? "bg-purple-800/40 border border-purple-400"
                        : item.category === "break"
                        ? "bg-pink-600/30 border border-pink-400"
                        : "bg-purple-900/30 border border-purple-600"
                    }
                  `}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center
                          ${
                            item.category === "headliner"
                              ? "bg-yellow-400 text-purple-900"
                              : item.category === "music"
                              ? "bg-cyan-400 text-purple-900"
                              : item.category === "break"
                              ? "bg-pink-400 text-purple-900"
                              : "bg-purple-600 text-white"
                          }
                        `}
                      >
                        <Icon size={24} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3
                          className={`
                            font-bold text-xl sm:text-2xl
                            ${
                              item.category === "headliner"
                                ? "text-yellow-400"
                                : item.category === "music"
                                ? "text-cyan-300"
                                : "text-white"
                            }
                          `}
                        >
                          {item.title}
                        </h3>
                        <span className="text-white font-semibold text-lg">{item.time}</span>
                      </div>
                      <p className="text-purple-200 mt-1">{item.description}</p>
                      {item.category === "headliner" && (
                        <p className="text-orange-300 text-sm mt-2">★ MAIN EVENT ★</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notes section from database or fallback */}
          {(notes.length > 0 || legacySchedule === schedule) && (
            <div className="mt-12 bg-purple-900/50 backdrop-blur-sm rounded-lg p-6 border border-purple-400">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">Important Notes:</h3>
              <ul className="space-y-2 text-purple-200">
                {notes.length > 0 ? (
                  notes.map((note, index) => (
                    <li key={index}>• {note}</li>
                  ))
                ) : (
                  <>
                    <li>• Schedule is subject to change</li>
                    <li>• Food trucks and bars open throughout the event</li>
                    <li>• VIP area access available with special tickets</li>
                    <li>• Free parking at Liberty Station</li>
                  </>
                )}
              </ul>
            </div>
          )}
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
    </div>
  );
}