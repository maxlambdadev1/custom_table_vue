# Custom Table Vue

A Vue 3 application for custom table management with clean, reusable code architecture.

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd custom_table_vue
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```
Or manually create `.env` file with:
```
VITE_BASE_URL=https://srv03.nopcoders.com
VITE_ENV=Testing
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── TopBar.vue      # Sticky header with title and navigation
│   ├── Sidebar.vue     # Left navigation sidebar
│   └── MainContent.vue # Main content area with search and actions
├── App.vue             # Root component
├── main.js             # Application entry point
└── style.css           # Global styles with Tailwind imports
```

## Features

- **Responsive Layout**: Mobile-friendly design with Tailwind CSS
- **Environment Configuration**: Configurable base URL and environment settings
- **Component Architecture**: Clean, reusable Vue 3 components
- **No Third-party Dependencies**: Custom implementation without external table libraries