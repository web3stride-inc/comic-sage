# ComicSage

ComicSage is an educational platform that transforms complex topics into engaging, easy-to-understand comics. Perfect for visual learners and students of all ages.

![ComicSage Logo](public/images/logo.png)

## Overview

ComicSage uses AI to generate educational comics that break down difficult concepts into digestible visual stories. Whether you're studying science, history, math, or any other subject, our comics help you grasp and remember information more effectively.

## Features

- **Topic to Comic Conversion**: Turn any educational topic into a visually engaging comic
- **Difficulty Adjustment**: Set the complexity level to match your learning needs
- **Tone Selection**: Choose between humorous, serious, or analogy-based approaches
- **Personal Library**: Save and organize your generated comics
- **Real-time Generation**: Watch as your comic is created panel by panel

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/comic-sage.git
   cd comic-sage
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your API credentials.

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_API_URL`: URL for the ComicSage API
- `NEXT_PUBLIC_WS_URL`: WebSocket URL for real-time comic generation

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Radix UI, shadcn/ui
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **HTTP Client**: Axios
- **Real-time Communication**: WebSockets

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape ComicSage
- Special thanks to the educational community for feedback and support
