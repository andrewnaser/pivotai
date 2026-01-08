# Pivot AI - AI-Powered Engagement System

A premium, futuristic, dark-mode MMO SaaS web application built with Next.js 16. Pivot AI is a powerful automated system that helps users hijack attention from viral social media posts by generating smart, copy-paste-ready comments that redirect attention to their profile bio links.

## 🚀 Features

### Core Features
- **Access Gateway** - Secure login/signup system
- **Pivot AI Dashboard** - Comprehensive dashboard with stats and activity feed
- **Bot Campaigns** - Create and manage automated comment campaigns
- **Target Scanner** - Find viral posts across multiple platforms
- **Comment Deployment Engine** - Generate smart, customizable comments
- **Target Queue** - Daily execution queue for organized deployment
- **Bio Link Engine** - Create high-converting bridge pages
- **Pivot AI Training Hub** - Step-by-step training modules and guides

### Premium Modules
- **Automated Profits Module** - DFY viral targets, comment packs, and content generators
- **Instant Profits Module** - Influencer finder, outreach automation, and scaling playbooks

## 🎨 Design Philosophy

- **Dark Mode First** - Premium futuristic aesthetic
- **Bot/System Vibe** - Over-communicates automation and power
- **Zero Complexity** - Built for users who want results, not confusion
- **Mobile Responsive** - Works seamlessly on all devices
- **Instant Wow Factor** - Feels powerful from first glance

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Font:** Inter (Google Fonts)

## 📦 Installation

1. Clone or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
Pivot AI/
├── app/
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Dashboard layout with sidebar
│   │   ├── dashboard/              # Main control panel
│   │   ├── campaigns/              # Bot campaigns management
│   │   ├── scanner/                # Viral target scanner
│   │   ├── comments/               # Comment generation engine
│   │   ├── queue/                  # Target execution queue
│   │   ├── bio-links/              # Bio link bridge pages
│   │   ├── training/               # Training hub
│   │   └── premium/
│   │       ├── automated-profits/  # Premium module 1
│   │       └── instant-profits/    # Premium module 2
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing/auth page
├── components/
│   ├── ui/                         # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   └── badge.tsx
│   ├── sidebar.tsx                 # Navigation sidebar
│   ├── top-nav.tsx                 # Top navigation bar
│   └── copy-button.tsx             # Copy to clipboard component
└── lib/
    └── utils.ts                    # Utility functions
```

## 🎯 Key Pages

### 1. Access Gateway (/)
- Login/signup interface
- Premium branding and value proposition
- Gated access to control panel

### 2. Control Panel (/dashboard)
- Real-time stats dashboard
- Bot activity feed
- Daily execution plan
- Training video placeholder

### 3. Bot Campaigns (/campaigns)
- Create/edit/duplicate campaigns
- Multi-platform targeting
- Custom comment tones
- Performance tracking

### 4. Target Scanner (/scanner)
- Niche and keyword search
- Platform filtering (TikTok, Instagram, YouTube, etc.)
- Viral score calculation
- Save targets to queue

### 5. Comment Engine (/comments)
- 5 bot tones: Curious, Relatable, Authority, Question, Shock
- 3 CTA intents: Pull to Profile, Check Bio, Start Conversation
- Reply chain mode
- One-click copy functionality

### 6. Target Queue (/queue)
- Daily execution queue
- Mark targets as completed
- Copy comments per target
- Track deployment progress

### 7. Bio Link Engine (/bio-links)
- 4 high-converting templates
- Custom headlines and bullets
- Preview and publish
- Click tracking

### 8. Training Hub (/training)
- Progressive training modules
- Quick start guides
- Pro tips and best practices
- Video training placeholders

### 9. Automated Profits (/premium/automated-profits)
- 200+ pre-researched viral targets
- DFY comment packs
- Profile content generator
- Weekly intelligence updates

### 10. Instant Profits (/premium/instant-profits)
- Influencer finder
- Outreach message templates
- Mini CRM for partnership tracking
- Scaling playbooks

## 🎨 Design System

### Colors
- **Primary:** Cyan/Teal (#2dd4bf) - Represents automation and tech
- **Background:** Deep black (#0d0d0d)
- **Card:** Dark gray (#141414)
- **Accent:** Primary with opacity variations
- **Success:** Green (#22c55e)
- **Warning:** Yellow (#eab308)
- **Destructive:** Red (#ef4444)

### Typography
- **Font:** Inter (system font fallback)
- **Hierarchy:** Clear heading sizes, readable body text
- **Line Height:** Optimized for readability

### Components
- **Glass Effect:** Subtle transparency and blur
- **Animations:** Smooth transitions and micro-interactions
- **Spacing:** Large, breathable layouts
- **Borders:** Subtle borders with primary accent on hover

## 🔧 Customization

### Adding New Pages
1. Create a new folder in `app/(dashboard)/`
2. Add `page.tsx` with your content
3. Update sidebar navigation in `components/sidebar.tsx`

### Styling
- Modify `app/globals.css` for global styles
- Use Tailwind utility classes for component styling
- Leverage the `cn()` utility for conditional classes

### Mock Data
- All data is currently mocked for demonstration
- Replace mock data with real API calls when ready
- API integration stubs are prepared in components

## 📱 Responsive Design

- **Mobile:** Optimized layouts, stacked components
- **Tablet:** Balanced grid layouts
- **Desktop:** Full sidebar navigation, multi-column layouts

## ⚡ Performance

- Next.js 16 with Turbopack for fast builds
- Server components by default
- Client components marked with "use client"
- Optimized bundle sizes

## 🚧 Future Enhancements

- Real authentication system
- Database integration
- External API connections (RabbitAPI, etc.)
- Real-time notifications
- Advanced analytics
- Payment processing
- User settings and preferences

## 📄 License

Private project - All rights reserved

## 🤝 Support

This is a premium SaaS application built for MMO users. The interface is designed to be intuitive and self-explanatory, with built-in training and guidance.

---

**Built with ⚡ by Pivot AI Team**
