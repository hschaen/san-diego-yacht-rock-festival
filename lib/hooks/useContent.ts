import { useState, useEffect, useCallback } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ContentService } from '@/lib/services/content';
import {
  SiteMetadata,
  HomePage,
  LineupPage,
  SchedulePage,
  TicketsPage,
  Navigation
} from '@/lib/types/content';

interface UseContentResult<T> {
  content: T | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

function useContent<T>(
  contentId: string,
  fetcher: () => Promise<T | null>
): UseContentResult<T> {
  const [content, setContent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetcher();
      setContent(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    fetchContent();

    // Set up real-time listener only if db is available
    if (!db) return;
    
    const unsubscribe = onSnapshot(
      doc(db, 'content', contentId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = { id: snapshot.id, ...snapshot.data() } as T;
          setContent(data);
          ContentService.clearCache(); // Clear cache on update
        }
      },
      (err) => {
        console.error('Realtime update error:', err);
        setError(err as Error);
      }
    );

    return () => unsubscribe();
  }, [contentId, fetchContent]);

  return {
    content,
    loading,
    error,
    refresh: fetchContent
  };
}

export function useSiteMetadata(): UseContentResult<SiteMetadata> {
  return useContent('site_metadata', ContentService.getSiteMetadata);
}

export function useHomePage(): UseContentResult<HomePage> {
  return useContent('home_page', ContentService.getHomePage);
}

export function useLineupPage(): UseContentResult<LineupPage> {
  return useContent('lineup_page', ContentService.getLineupPage);
}

export function useSchedulePage(): UseContentResult<SchedulePage> {
  return useContent('schedule_page', ContentService.getSchedulePage);
}

export function useTicketsPage(): UseContentResult<TicketsPage> {
  return useContent('tickets_page', ContentService.getTicketsPage);
}

export function useNavigation(): UseContentResult<Navigation> {
  return useContent('navigation', ContentService.getNavigation);
}

// Fallback content for when Firestore is unavailable
export const fallbackContent = {
  metadata: {
    id: 'site_metadata',
    title: "San Diego Yacht Rock Festival 2025 | Liberty Station",
    description: "San Diego's Premier Yacht Rock Festival",
    keywords: ["yacht rock", "festival", "san diego"],
    updatedAt: new Date()
  } as SiteMetadata,
  
  home: {
    id: 'home_page',
    headline: "Get Priority Access to San Diego Yacht Rock Festival Tickets",
    subheadline: "Get On Board for San Diego's Smoothest Summer Festival",
    description: "First access to tickets, lineup drops, and VIP upgrades",
    formLabels: {
      name: "Name",
      email: "Email",
      phone: "Phone"
    },
    formPlaceholders: {
      name: "Your name",
      email: "your@email.com",
      phone: "(619) 555-0000"
    },
    submitButton: "Join the Captain's List",
    successMessage: {
      title: "Welcome Aboard!",
      description: "You're on the list!"
    },
    trustBuilders: [
      "No spam. Just smooth sailing.",
      "You'll hear from us before the general public."
    ],
    eventDetails: {
      date: "SAT OCT 11 • 2025",
      time: "5PM - 10PM",
      venue: "LIBERTY STATION",
      address: "2751 DEWEY RD SAN DIEGO CA"
    },
    updatedAt: new Date()
  } as HomePage,
  
  lineup: {
    id: 'lineup_page',
    title: "2025 LINEUP",
    subtitle: "Smooth sounds all day long",
    artists: [],
    footerText: "More artists to be announced!",
    updatedAt: new Date()
  } as LineupPage,
  
  schedule: {
    id: 'schedule_page',
    title: "EVENT SCHEDULE",
    date: "Saturday, October 11, 2025",
    events: [],
    notes: [],
    updatedAt: new Date()
  } as SchedulePage,
  
  tickets: {
    id: 'tickets_page',
    title: "GET YOUR TICKETS",
    subtitle: "Limited availability",
    tiers: [],
    infoSection: {
      title: "Ticket Information",
      items: []
    },
    contactEmail: "tickets@sdyachtrockfest.com",
    updatedAt: new Date()
  } as TicketsPage,
  
  navigation: {
    id: 'navigation',
    title: "YACHT ROCK FESTIVAL",
    items: [],
    ctaButton: {
      label: "Buy Tickets",
      href: "/tickets"
    },
    eventInfo: {
      date: "SAT OCT 11, 2025",
      venue: "Liberty Station"
    },
    updatedAt: new Date()
  } as Navigation
};

// Helper hook for loading state
export function useContentLoading() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const initializeContent = async () => {
    try {
      setIsInitializing(true);
      setInitError(null);
      await ContentService.initializeDefaultContent();
      ContentService.clearCache();
    } catch (error) {
      console.error('Failed to initialize content:', error);
      setInitError('Failed to initialize content. Please try again.');
    } finally {
      setIsInitializing(false);
    }
  };

  return {
    isInitializing,
    initError,
    initializeContent
  };
}