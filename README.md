# Crop health dashboard


## Deployment

Your project is live at:

**[https://crop-health-dashboard-ten.vercel.app/](https://crop-health-dashboard-ten.vercel.app/)**

## Local Setup Instructions (Windows & macOS)

Follow these steps to run the project locally:

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **pnpm** (recommended package manager)
  - Install globally: `npm install -g pnpm`
  - Verify installation: `pnpm --version`
- **Git** (for cloning the repository)
  - Download from [git-scm.com](https://git-scm.com/)

### Installation Steps

1. **Clone the Repository**
   \`\`\`bash
   git clone https://github.com/Amnsngh0904/crop-health-dashboard.git
   cd crop-health-dashboard
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   pnpm install
   \`\`\`

3. **Start the Development Server**
   \`\`\`bash
   pnpm dev
   \`\`\`

4. **Open in Browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The application should now be running locally

### Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint to check for code issues

### Project Structure

\`\`\`
crop-health-dashboard/
├── app/                    # Next.js App Router pages
├── components/            # Reusable React components
├── lib/                   # Utility functions
├── public/               # Static assets
├── package.json          # Project dependencies
└── README.md            # This file
\`\`\`

### Features

- **Multilingual Support**: Hindi and English language options
- **Audio Input**: Voice recognition for chatbot interactions
- **Interactive Dashboard**: Real-time crop health monitoring
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Theme switching capability

### Troubleshooting

**Common Issues:**

1. **Port 3000 already in use**
   - Kill the process: `lsof -ti:3000 | xargs kill -9` (macOS/Linux)
   - Or use a different port: `pnpm dev -- -p 3001`

2. **Dependencies installation fails**
   - Clear cache: `pnpm store prune`
   - Delete node_modules: `rm -rf node_modules`
   - Reinstall: `pnpm install`

3. **Build errors**
   - Check Node.js version: `node --version` (should be 18+)
   - Clear Next.js cache: `rm -rf .next`

### Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request
