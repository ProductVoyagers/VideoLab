# Virtual Production Client Portal

## Overview

This is a full-stack web application that serves as a client portal for Virtual Media Production services. The application allows clients to submit creative briefs through a step-by-step wizard, select from different production packages (Virtual Ad Lite, Signature Scene, Immersive Experience), and track their project status. It features an admin dashboard for internal team members to manage submissions and update project statuses. The application is built with a modern React frontend, Express.js backend, and PostgreSQL database, designed to streamline the virtual production workflow from client intake to project delivery.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

**Frontend Architecture**
- Built with React 18 using TypeScript for type safety
- Uses Vite as the build tool and development server for fast compilation
- Implements Wouter for lightweight client-side routing instead of React Router
- Utilizes Tailwind CSS for styling with a custom cinema-themed design system
- Incorporates shadcn/ui component library for consistent UI components
- Implements React Hook Form with Zod validation for form management
- Uses TanStack Query for server state management and API caching
- Features a responsive design optimized for both desktop and mobile devices

**Backend Architecture**
- Express.js server providing RESTful API endpoints
- In-memory storage system (MemStorage) for development with interface abstraction for future database integration
- Modular route handling with centralized error management
- File upload support with metadata tracking
- CORS and request logging middleware for development debugging
- Environment-based configuration for development and production modes

**Database Design**
- PostgreSQL database with Drizzle ORM for type-safe database operations
- Single submissions table storing project details, package selection, file metadata, and status tracking
- Schema includes fields for project name, brand, goals, package type, timeline, notes, files, and submission date
- Status field supports workflow states: received, in-production, delivered
- Uses Neon Database as the PostgreSQL provider for cloud hosting

**UI/UX Design**
- Cinema-themed design with dark background and gold accents
- Three-step submission wizard: package selection, project details, confirmation
- Package cards with visual hierarchy highlighting popular options
- Progress indicators showing current step in the submission process
- Admin dashboard with filtering, sorting, and status update capabilities
- Toast notifications for user feedback on actions
- Responsive layout adapting to different screen sizes

**External API Integration**
- File upload system supporting multiple file types with size validation
- Submission tracking with unique ID generation (VP-YEAR-XXXXXX format)
- Export functionality for CSV download of submissions
- Real-time status updates through optimistic UI updates

## External Dependencies

**Core Framework Dependencies**
- React 18 with TypeScript for the frontend application
- Express.js for the backend server
- Vite for build tooling and development server
- Node.js runtime environment

**Database and ORM**
- PostgreSQL as the primary database
- Neon Database (@neondatabase/serverless) for cloud PostgreSQL hosting
- Drizzle ORM for type-safe database operations and migrations
- drizzle-zod for automatic schema validation

**UI and Styling**
- Tailwind CSS for utility-first styling
- shadcn/ui component library built on Radix UI primitives
- Lucide React for consistent iconography
- class-variance-authority for component variant management

**Form and Validation**
- React Hook Form for form state management
- Zod for runtime type validation and schema definition
- @hookform/resolvers for Zod integration with React Hook Form

**State Management and Data Fetching**
- TanStack Query (React Query) for server state management
- Wouter for lightweight client-side routing

**Development and Build Tools**
- TypeScript for static type checking
- ESBuild for fast JavaScript bundling
- PostCSS with Autoprefixer for CSS processing
- Replit-specific plugins for development environment integration

**Session and File Handling**
- connect-pg-simple for PostgreSQL session storage
- Built-in file upload handling with metadata extraction
- Date-fns for date formatting and manipulation