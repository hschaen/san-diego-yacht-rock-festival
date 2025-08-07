import HamburgerMenu from "@/components/hamburger-menu";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LineupPage() {
  const artists = [
    { name: "Yacht Rock Revue", time: "9:00 PM", category: "headliner" },
    { name: "Christopher Cross", time: "7:30 PM", category: "headliner" },
    { name: "Player", time: "6:30 PM", category: "featured" },
    { name: "Ambrosia", time: "5:45 PM", category: "featured" },
    { name: "The Doobie Brothers Tribute", time: "5:00 PM", category: "opener" },
  ];

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
            2025 LINEUP
          </h1>
          <p className="text-cyan-300 text-lg">Smooth sounds all day long</p>
        </div>

        <div className="max-w-4xl mx-auto w-full">
          <div className="space-y-6">
            {artists.map((artist, index) => (
              <div
                key={index}
                className={`
                  relative backdrop-blur-sm rounded-lg p-6 transition-all hover:scale-105
                  ${
                    artist.category === "headliner"
                      ? "bg-gradient-to-r from-yellow-400/30 to-orange-400/30 border-2 border-yellow-400"
                      : artist.category === "featured"
                      ? "bg-purple-800/40 border border-purple-400"
                      : "bg-purple-900/30 border border-purple-600"
                  }
                `}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2
                      className={`
                        font-bold drop-shadow-lg
                        ${
                          artist.category === "headliner"
                            ? "text-3xl sm:text-4xl text-yellow-400"
                            : artist.category === "featured"
                            ? "text-2xl sm:text-3xl text-cyan-300"
                            : "text-xl sm:text-2xl text-white"
                        }
                      `}
                    >
                      {artist.name}
                    </h2>
                    {artist.category === "headliner" && (
                      <p className="text-orange-300 text-sm mt-1">★ HEADLINER ★</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white text-lg sm:text-xl font-semibold">{artist.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-cyan-300 text-sm">
              More artists to be announced!
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
    </div>
  );
}