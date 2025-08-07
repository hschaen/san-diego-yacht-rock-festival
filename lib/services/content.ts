import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  SiteMetadata,
  HomePage,
  LineupPage,
  SchedulePage,
  TicketsPage,
  Navigation,
  ContentVersion
} from '@/lib/types/content';

const COLLECTIONS = {
  CONTENT: 'content',
  VERSIONS: 'content_versions'
};

const CONTENT_IDS = {
  METADATA: 'site_metadata',
  HOME: 'home_page',
  LINEUP: 'lineup_page',
  SCHEDULE: 'schedule_page',
  TICKETS: 'tickets_page',
  NAVIGATION: 'navigation'
};

export class ContentService {
  private static cache = new Map<string, { data: unknown; timestamp: number }>();
  private static CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private static getCached<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    return null;
  }

  private static setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  static clearCache(): void {
    this.cache.clear();
  }

  // Site Metadata
  static async getSiteMetadata(): Promise<SiteMetadata | null> {
    const cached = this.getCached<SiteMetadata>(CONTENT_IDS.METADATA);
    if (cached) return cached;

    try {
      const docRef = doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.METADATA);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as SiteMetadata;
        this.setCache(CONTENT_IDS.METADATA, data);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching site metadata:', error);
      return null;
    }
  }

  static async updateSiteMetadata(data: Partial<SiteMetadata>, userId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.METADATA);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    await this.saveVersion(CONTENT_IDS.METADATA, 'metadata', data, userId);
    this.clearCache();
  }

  // Home Page
  static async getHomePage(): Promise<HomePage | null> {
    const cached = this.getCached<HomePage>(CONTENT_IDS.HOME);
    if (cached) return cached;

    try {
      const docRef = doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.HOME);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as HomePage;
        this.setCache(CONTENT_IDS.HOME, data);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching home page:', error);
      return null;
    }
  }

  static async updateHomePage(data: Partial<HomePage>, userId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.HOME);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    await this.saveVersion(CONTENT_IDS.HOME, 'home', data, userId);
    this.clearCache();
  }

  // Lineup Page
  static async getLineupPage(): Promise<LineupPage | null> {
    const cached = this.getCached<LineupPage>(CONTENT_IDS.LINEUP);
    if (cached) return cached;

    try {
      const docRef = doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.LINEUP);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as LineupPage;
        this.setCache(CONTENT_IDS.LINEUP, data);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching lineup page:', error);
      return null;
    }
  }

  static async updateLineupPage(data: Partial<LineupPage>, userId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.LINEUP);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    await this.saveVersion(CONTENT_IDS.LINEUP, 'lineup', data, userId);
    this.clearCache();
  }

  // Schedule Page
  static async getSchedulePage(): Promise<SchedulePage | null> {
    const cached = this.getCached<SchedulePage>(CONTENT_IDS.SCHEDULE);
    if (cached) return cached;

    try {
      const docRef = doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.SCHEDULE);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as SchedulePage;
        this.setCache(CONTENT_IDS.SCHEDULE, data);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching schedule page:', error);
      return null;
    }
  }

  static async updateSchedulePage(data: Partial<SchedulePage>, userId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.SCHEDULE);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    await this.saveVersion(CONTENT_IDS.SCHEDULE, 'schedule', data, userId);
    this.clearCache();
  }

  // Tickets Page
  static async getTicketsPage(): Promise<TicketsPage | null> {
    const cached = this.getCached<TicketsPage>(CONTENT_IDS.TICKETS);
    if (cached) return cached;

    try {
      const docRef = doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.TICKETS);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as TicketsPage;
        this.setCache(CONTENT_IDS.TICKETS, data);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching tickets page:', error);
      return null;
    }
  }

  static async updateTicketsPage(data: Partial<TicketsPage>, userId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.TICKETS);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    await this.saveVersion(CONTENT_IDS.TICKETS, 'tickets', data, userId);
    this.clearCache();
  }

  // Navigation
  static async getNavigation(): Promise<Navigation | null> {
    const cached = this.getCached<Navigation>(CONTENT_IDS.NAVIGATION);
    if (cached) return cached;

    try {
      const docRef = doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.NAVIGATION);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as Navigation;
        this.setCache(CONTENT_IDS.NAVIGATION, data);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching navigation:', error);
      return null;
    }
  }

  static async updateNavigation(data: Partial<Navigation>, userId: string): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.NAVIGATION);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    await this.saveVersion(CONTENT_IDS.NAVIGATION, 'navigation', data, userId);
    this.clearCache();
  }

  // Version History
  private static async saveVersion(
    contentId: string, 
    contentType: ContentVersion['contentType'],
    data: unknown,
    userId: string
  ): Promise<void> {
    await addDoc(collection(db, COLLECTIONS.VERSIONS), {
      contentType,
      contentId,
      data,
      changedBy: userId,
      changedAt: serverTimestamp()
    });
  }

  static async getVersionHistory(contentId: string): Promise<ContentVersion[]> {
    const q = query(
      collection(db, COLLECTIONS.VERSIONS),
      orderBy('changedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as ContentVersion))
      .filter(version => version.contentId === contentId);
  }

  // Initialize Default Content
  static async initializeDefaultContent(): Promise<void> {
    const metadata: SiteMetadata = {
      id: CONTENT_IDS.METADATA,
      title: "San Diego Yacht Rock Festival 2025 | Liberty Station",
      description: "San Diego's Premier Yacht Rock Festival - October 11, 2025 at Liberty Station. Featuring Yacht Rock Revue, Christopher Cross, and more smooth sailing sounds!",
      keywords: ["yacht rock", "festival", "san diego", "liberty station", "music festival", "2025", "christopher cross", "yacht rock revue", "smooth music"],
      updatedAt: new Date()
    };

    const homePage: HomePage = {
      id: CONTENT_IDS.HOME,
      headline: "Get Priority Access to San Diego Yacht Rock Festival Tickets",
      subheadline: "Get On Board for San Diego's Smoothest Summer Festival",
      description: "First access to tickets, lineup drops, and VIP upgrades — straight to your inbox.",
      formLabels: {
        name: "Name",
        email: "Email ✅",
        phone: "Cell Number 📱"
      },
      formPlaceholders: {
        name: "Captain Smooth",
        email: "smooth@sailing.com",
        phone: "(619) 555-YACHT"
      },
      submitButton: "🚢 Join the Captain's List",
      successMessage: {
        title: "Welcome Aboard, Captain! ⛵",
        description: "You're on the list! Check your inbox for exclusive updates."
      },
      trustBuilders: [
        "✨ No spam. Just smooth sailing.",
        "🎯 You'll hear from us before the general public."
      ],
      eventDetails: {
        date: "SAT OCT 11 • 2025",
        time: "5PM - 10PM",
        venue: "LIBERTY STATION : INGRAM PLAZA",
        address: "2751 DEWEY RD SAN DIEGO CA 92106"
      },
      updatedAt: new Date()
    };

    const lineupPage: LineupPage = {
      id: CONTENT_IDS.LINEUP,
      title: "2025 LINEUP",
      subtitle: "Smooth sounds all day long",
      artists: [
        { id: "1", name: "Yacht Rock Revue", time: "9:00 PM", category: "headliner", order: 1 },
        { id: "2", name: "Christopher Cross", time: "7:30 PM", category: "headliner", order: 2 },
        { id: "3", name: "Player", time: "6:30 PM", category: "featured", order: 3 },
        { id: "4", name: "Ambrosia", time: "5:45 PM", category: "featured", order: 4 },
        { id: "5", name: "The Doobie Brothers Tribute", time: "5:00 PM", category: "opener", order: 5 }
      ],
      footerText: "More artists to be announced!",
      updatedAt: new Date()
    };

    const schedulePage: SchedulePage = {
      id: CONTENT_IDS.SCHEDULE,
      title: "EVENT SCHEDULE",
      date: "Saturday, October 11, 2025",
      events: [
        { id: "1", time: "4:00 PM", title: "Gates Open", description: "Welcome aboard! Get your wristbands and explore the festival grounds", icon: "🚪", order: 1 },
        { id: "2", time: "4:30 PM", title: "Food & Drink Service Begins", description: "Tropical cocktails, craft beer, and delicious food from local vendors", icon: "🍹", order: 2 },
        { id: "3", time: "5:00 PM", title: "The Doobie Brothers Tribute", description: "Opening act takes the stage", icon: "🎸", order: 3 },
        { id: "4", time: "5:45 PM", title: "Ambrosia", description: "Smooth sounds continue", icon: "🎵", order: 4 },
        { id: "5", time: "6:30 PM", title: "Player", description: "Keep the party going", icon: "🎤", order: 5 },
        { id: "6", time: "7:30 PM", title: "Christopher Cross", description: "Sailing into the sunset", icon: "⛵", order: 6 },
        { id: "7", time: "9:00 PM", title: "Yacht Rock Revue", description: "Headliner performance", icon: "🌟", order: 7 },
        { id: "8", time: "10:00 PM", title: "Festival Ends", description: "Until next year, smooth sailors!", icon: "🌙", order: 8 }
      ],
      notes: [
        "Schedule subject to change",
        "Re-entry allowed with wristband",
        "VIP areas open all day",
        "Merch booth open until 9:30 PM"
      ],
      updatedAt: new Date()
    };

    const ticketsPage: TicketsPage = {
      id: CONTENT_IDS.TICKETS,
      title: "GET YOUR TICKETS",
      subtitle: "Limited availability - Book now!",
      tiers: [
        {
          id: "1",
          name: "General Admission",
          price: 75,
          features: [
            "Festival entry",
            "Access to all performances",
            "Food & drink vendors",
            "Festival merchandise"
          ],
          order: 1
        },
        {
          id: "2",
          name: "VIP Experience",
          price: 150,
          features: [
            "Everything in General Admission",
            "VIP viewing area",
            "Premium bar access",
            "VIP restrooms",
            "Commemorative laminate"
          ],
          popular: true,
          order: 2
        },
        {
          id: "3",
          name: "Captain's Table",
          price: 250,
          features: [
            "Everything in VIP",
            "Meet & greet opportunities",
            "Complimentary drinks",
            "Exclusive merch package",
            "Premium parking"
          ],
          order: 3
        }
      ],
      infoSection: {
        title: "Ticket Information",
        items: [
          "All sales are final",
          "Must be 21+ to purchase alcohol",
          "Children 12 and under free with adult ticket",
          "Group discounts available for 10+ tickets"
        ]
      },
      contactEmail: "tickets@sdyachtrockfest.com",
      updatedAt: new Date()
    };

    const navigation: Navigation = {
      id: CONTENT_IDS.NAVIGATION,
      title: "YACHT ROCK FESTIVAL",
      items: [
        { id: "1", label: "Lineup", href: "/lineup", order: 1, active: true },
        { id: "2", label: "Schedule", href: "/schedule", order: 2, active: true },
        { id: "3", label: "Tickets", href: "/tickets", order: 3, active: true }
      ],
      ctaButton: {
        label: "Buy Tickets",
        href: "/tickets"
      },
      eventInfo: {
        date: "SAT OCT 11, 2025 • 5PM - 10PM",
        venue: "Liberty Station • Ingram Plaza"
      },
      updatedAt: new Date()
    };

    // Save all content to Firestore
    const batch = [
      setDoc(doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.METADATA), metadata),
      setDoc(doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.HOME), homePage),
      setDoc(doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.LINEUP), lineupPage),
      setDoc(doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.SCHEDULE), schedulePage),
      setDoc(doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.TICKETS), ticketsPage),
      setDoc(doc(db, COLLECTIONS.CONTENT, CONTENT_IDS.NAVIGATION), navigation)
    ];

    await Promise.all(batch);
  }
}