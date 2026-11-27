export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum CourseCategory {
  ALGEBRA = 'algebra',
  CALCULUS = 'calculus',
  GEOMETRY = 'geometry',
  STATISTICS = 'statistics',
  TRIGONOMETRY = 'trigonometry',
  ARITHMETIC = 'arithmetic',
}

export class Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: CourseCategory;
  level: CourseLevel;
  price: number;
  originalPrice: number;
  currency: string;
  thumbnailUrl: string;
  previewVideoUrl?: string;
  instructorId: string;
  instructorName: string;
  instructorAvatarUrl?: string;
  topics: string[];
  requirements: string[];
  whatYouLearn: string[];
  totalLessons: number;
  totalExercises: number;
  totalVideos: number;
  totalHours: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  isPublished: boolean;
  isFeatured: boolean;
  stripePriceId?: string;
  stripeProductId?: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
