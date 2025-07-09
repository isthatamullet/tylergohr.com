import { PhotoAsset } from "./types";

// Sample professional photography data
export const samplePhotos: PhotoAsset[] = [
  {
    id: "prof-1",
    title: "Professional Headshot",
    description: "Emmy Award-winning developer with 16+ years Fox Corporation experience",
    category: "professional",
    filename: "tyler-professional-1.jpg",
    alt: "Professional headshot of Tyler Gohr in business attire",
    width: 800,
    height: 1000,
    caption: "Professional business portrait for enterprise presentations",
    tags: ["headshot", "business", "professional", "portrait"],
    featured: true,
    dateTaken: "2024-12-15",
    location: "Professional Studio",
    camera: "Canon EOS R5",
    settings: {
      aperture: "2.8",
      shutterSpeed: "1/125",
      iso: 200,
      focalLength: "85mm"
    }
  },
  {
    id: "proj-1",
    title: "Invoice Chaser Architecture",
    description: "Behind the scenes of building the Emmy Award-winning streaming platform integration",
    category: "projects",
    filename: "invoice-chaser-dev.jpg",
    alt: "Developer working on Invoice Chaser architecture with multiple monitors",
    width: 1200,
    height: 800,
    caption: "Real development environment for Invoice Chaser project",
    tags: ["development", "architecture", "streaming", "emmy"],
    featured: true,
    dateTaken: "2024-11-20",
    location: "Home Office",
    settings: {
      aperture: "4.0",
      shutterSpeed: "1/60",
      iso: 800,
      focalLength: "35mm"
    }
  },
  {
    id: "behind-1",
    title: "Development Workspace",
    description: "The technical environment where Emmy Award-winning solutions are crafted",
    category: "behind-scenes",
    filename: "workspace-setup.jpg",
    alt: "Modern development workspace with multiple monitors and professional lighting",
    width: 1200,
    height: 900,
    caption: "Professional development environment optimized for enterprise software development",
    tags: ["workspace", "development", "setup", "professional"],
    featured: false,
    dateTaken: "2024-12-01",
    location: "Home Office",
    settings: {
      aperture: "5.6",
      shutterSpeed: "1/30",
      iso: 1600,
      focalLength: "24mm"
    }
  },
  {
    id: "proj-2",
    title: "Network Infrastructure Design",
    description: "Documenting the cloud architecture for scalable enterprise solutions",
    category: "projects",
    filename: "network-design.jpg",
    alt: "Hand-drawn network architecture diagrams on whiteboard",
    width: 1000,
    height: 750,
    caption: "Enterprise network architecture planning session",
    tags: ["architecture", "network", "design", "enterprise"],
    featured: false,
    dateTaken: "2024-10-15",
    location: "Meeting Room",
    settings: {
      aperture: "3.5",
      shutterSpeed: "1/80",
      iso: 400,
      focalLength: "50mm"
    }
  },
  {
    id: "prof-2",
    title: "Business Presentation",
    description: "Presenting technical solutions to enterprise stakeholders",
    category: "professional",
    filename: "presentation-mode.jpg",
    alt: "Tyler presenting technical architecture to business stakeholders",
    width: 1200,
    height: 800,
    caption: "Enterprise presentation demonstrating technical expertise",
    tags: ["presentation", "business", "enterprise", "leadership"],
    featured: true,
    dateTaken: "2024-09-30",
    location: "Conference Room",
    settings: {
      aperture: "2.8",
      shutterSpeed: "1/100",
      iso: 320,
      focalLength: "70mm"
    }
  },
  {
    id: "behind-2",
    title: "Code Review Session",
    description: "Collaborative development process ensuring enterprise-grade code quality",
    category: "behind-scenes",
    filename: "code-review.jpg",
    alt: "Team code review session with multiple developers",
    width: 1100,
    height: 825,
    caption: "Enterprise code quality assurance process",
    tags: ["code-review", "collaboration", "quality", "team"],
    featured: false,
    dateTaken: "2024-11-05",
    location: "Development Office",
    settings: {
      aperture: "4.0",
      shutterSpeed: "1/60",
      iso: 640,
      focalLength: "35mm"
    }
  }
];

// Helper functions for photo management
export const getPhotosByCategory = (category: PhotoAsset['category']): PhotoAsset[] => {
  return samplePhotos.filter(photo => photo.category === category);
};

export const getFeaturedPhotos = (): PhotoAsset[] => {
  return samplePhotos.filter(photo => photo.featured);
};

export const getPhotosByTag = (tag: string): PhotoAsset[] => {
  return samplePhotos.filter(photo => 
    photo.tags?.some(photoTag => 
      photoTag.toLowerCase().includes(tag.toLowerCase())
    )
  );
};

export const getRecentPhotos = (limit: number = 6): PhotoAsset[] => {
  return samplePhotos
    .sort((a, b) => {
      if (!a.dateTaken || !b.dateTaken) return 0;
      return new Date(b.dateTaken).getTime() - new Date(a.dateTaken).getTime();
    })
    .slice(0, limit);
};