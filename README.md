# Robot for ASD children

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/6209tanvir-gmailcoms-projects/v0-robot-for-asd-children)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/UdvhhaIfYO6)

## Overview

An assistive and educational robot interface designed specifically for Level 1 ASD (Autism Spectrum Disorder) children. This application uses PECS (Picture Exchange Communication System) cards with Bangla voice synthesis to help children communicate their needs, learn through interactive stories, and engage in meaningful conversations.

### Features

- **PECS Card Interface**: Large, touch-friendly cards for basic needs, emotions, activities, and educational content
- **Bangla Voice Synthesis**: Natural-sounding Bangla text-to-speech for all interactions
- **Educational Content**: Interactive storytelling with cartoon-style presentations
- **Conversation Engine**: Contextual responses and continuous dialogue capability
- **Progress Tracking**: Analytics and monitoring for caregivers and therapists
- **Admin Dashboard**: Content management and user progress monitoring

## Local Development Setup

### Prerequisites

Before running this project locally, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **PHP** (version 8.0 or higher) for backend scripts
- **MySQL** or **SQLite** database (optional, for data persistence)

### Installation Steps

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/for-asd-children.git
   cd for-asd-children
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   # Database configuration (optional)
   DATABASE_URL="your-database-connection-string"
   
   # For production deployment
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   \`\`\`

4. **Initialize the database** (optional)
   If you want to use the progress tracking features:
   \`\`\`bash
   php scripts/database-setup.php
   php scripts/data-manager.php
   \`\`\`

5. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes for backend functionality
│   ├── admin/             # Admin dashboard
│   └── page.tsx           # Main PECS interface
├── components/            # React components
│   ├── pecs-card.tsx      # PECS card component
│   ├── voice-system.tsx   # Voice synthesis system
│   └── conversation-*.tsx # Conversation engine components
├── scripts/               # PHP backend scripts
│   ├── database-setup.php # Database initialization
│   └── data-manager.php   # Data management utilities
└── public/               # Static assets and images
\`\`\`

### Usage

1. **Main Interface**: The home page displays PECS cards organized by categories
2. **Voice Interaction**: Click any card to hear Bangla pronunciation
3. **Educational Content**: Access stories and learning materials through the Educational category
4. **Admin Panel**: Visit `/admin` to monitor usage and manage content
5. **Conversation**: Use the conversation panel to engage in continuous dialogue

### Browser Compatibility

- **Chrome/Edge**: Full support including voice synthesis
- **Firefox**: Full support with voice synthesis
- **Safari**: Limited voice synthesis support (may require user interaction)
- **Mobile browsers**: Optimized for touch interactions

### Troubleshooting

- **Voice not working**: Ensure your browser supports Web Speech API and has audio permissions
- **Database errors**: Check PHP configuration and database connection settings
- **Slow loading**: Verify all image assets are properly optimized

## Deployment

Your project is live at:

**[https://vercel.com/6209tanvir-gmailcoms-projects/v0-robot-for-asd-children](https://vercel.com/6209tanvir-gmailcoms-projects/v0-robot-for-asd-children)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/UdvhhaIfYO6](https://v0.app/chat/projects/UdvhhaIfYO6)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Contributing

This project is designed to help children with autism spectrum disorder. When contributing, please ensure:

- All text content includes Bangla translations
- UI elements are large and touch-friendly
- Color choices follow accessibility guidelines
- New features are tested with the target user group in mind

## License

This project is created for educational and assistive purposes for children with ASD.
