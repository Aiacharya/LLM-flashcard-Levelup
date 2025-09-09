# LLM Flashcard App

A modern flashcard application built with Angular 18 for learning LLM (Large Language Model) concepts.

## Author

**Pankaj** - GenAI Guru  
LinkedIn: [https://www.linkedin.com/in/genai-guru-pankaj/](https://www.linkedin.com/in/genai-guru-pankaj/)

Created with passion for AI education and modern web development.

## Features

- **Study Mode**: Browse through flashcards with questions and answers
- **Quiz Mode**: Take interactive quizzes with multiple-choice questions
- **Category Filtering**: Filter content by topic categories
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with TailwindCSS for a clean, modern interface

## Tech Stack

- **Angular 18**: Latest Angular with standalone components
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first CSS framework
- **RxJS**: Reactive programming for data management

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd angular
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

## Available Scripts

- `npm start` - Start the development server
- `npm run build` - Build the app for production
- `npm test` - Run unit tests
- `npm run lint` - Run linting

## Deployment

### Firebase Hosting

To deploy this app to Firebase Hosting:

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init hosting
```

4. Build the project:
```bash
npm run build
```

5. Deploy to Firebase:
```bash
firebase deploy
```

### Other Hosting Options

The built files in `dist/llm-flashcard-angular` can be deployed to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── flashcard-app/     # Main app component
│   │   ├── study-mode/        # Study mode component
│   │   └── quiz-mode/         # Quiz mode component
│   ├── services/
│   │   └── flashcard.service.ts # Data service
│   ├── types/
│   │   └── flashcard.types.ts  # Type definitions
│   ├── app.component.ts       # Root component
│   ├── app.config.ts          # App configuration
│   └── app.routes.ts          # Routing configuration
├── assets/                    # Static assets
├── styles.scss               # Global styles
└── index.html                # Main HTML file
```

## Features Overview

### Study Mode
- Browse flashcards one by one
- Show/hide answers
- Navigate between cards
- Filter by category
- Visual difficulty indicators

### Quiz Mode
- Multiple-choice questions
- Progress tracking
- Timer functionality
- Detailed results with explanations
- Score calculation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Author

Created by **Pankaj** - GenAI Guru  
Connect with me on LinkedIn: [https://www.linkedin.com/in/genai-guru-pankaj/](https://www.linkedin.com/in/genai-guru-pankaj/)

## License

This project is licensed under the MIT License.

---

**Built with ❤️ for the AI learning community**
