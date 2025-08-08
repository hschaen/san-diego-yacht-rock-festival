export interface SiteMetadata {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  updatedAt: Date;
}

export interface HomePage {
  id: string;
  headline: string;
  subheadline: string;
  description: string;
  formTitle?: string;
  formLabels: {
    name: string;
    email: string;
    phone: string;
  };
  formPlaceholders: {
    name: string;
    email: string;
    phone: string;
  };
  submitButton: string;
  successMessage: {
    title: string;
    description: string;
  };
  trustBuilders: string[];
  eventDetails: {
    date: string;
    time: string;
    venue: string;
    address: string;
  };
  updatedAt: Date;
}

export interface Artist {
  id: string;
  name: string;
  time: string;
  category: 'headliner' | 'featured' | 'opener';
  image?: string;
  description?: string;
  order: number;
}

export interface LineupPage {
  id: string;
  title: string;
  subtitle: string;
  artists: Artist[];
  footerText: string;
  updatedAt: Date;
}

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  icon?: string;
  order: number;
}

export interface SchedulePage {
  id: string;
  title: string;
  date: string;
  events: ScheduleEvent[];
  notes: string[];
  updatedAt: Date;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
  soldOut?: boolean;
  order: number;
}

export interface TicketsPage {
  id: string;
  title: string;
  subtitle: string;
  ticketsEnabled: boolean;
  tiers: TicketTier[];
  infoSection: {
    title: string;
    items: string[];
  };
  contactEmail: string;
  updatedAt: Date;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
  active: boolean;
}

export interface Navigation {
  id: string;
  title: string;
  items: NavigationItem[];
  ctaButton: {
    label: string;
    href: string;
  };
  eventInfo: {
    date: string;
    venue: string;
  };
  updatedAt: Date;
}

export interface ContentVersion {
  id: string;
  contentType: 'metadata' | 'home' | 'lineup' | 'schedule' | 'tickets' | 'navigation';
  contentId: string;
  data: unknown;
  changedBy: string;
  changedAt: Date;
  changeNote?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  createdAt: Date;
  lastLogin?: Date;
}