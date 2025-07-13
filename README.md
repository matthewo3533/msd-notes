# MSD Notes App

A modern, animated React TypeScript application for the Ministry of Social Development (MSD) to streamline client grant application processes. The app features a guided question flow with real-time note generation for various services including Food and Clothing payments.

## Features

- **Modern UI/UX**: Stripe-inspired design with smooth animations and dark mode support
- **Service Grid**: Interactive grid of service options with animated cards
- **Guided Question Flow**: Step-by-step form process with skip/restore functionality
- **Real-time Note Generation**: Live preview of formatted notes as you fill out forms
- **Multiple Services**: Support for Food and Clothing payment applications
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Toggle**: Switch between light and dark themes

## Services Available

- **Food Payment** 🍽️: Complete food grant application with income assessment
- **Clothing Payment** 👕: Clothing grant application with supplier details
- **Other Emergency Payment** 💰: Emergency payment processing
- **ADSD** 💵: Additional support services

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with CSS Variables and animations
- **State Management**: React hooks (useState, useEffect)
- **Development**: Hot Module Replacement (HMR)

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/msd-notes-app.git
cd msd-notes-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/
│   ├── ServiceGrid.tsx          # Service selection grid
│   ├── FoodQuestions.tsx        # Food service form
│   ├── ClothingQuestions.tsx    # Clothing service form
│   ├── IncomeSection.tsx        # Reusable income component
│   ├── DecisionSection.tsx      # Reusable decision component
│   ├── PaymentSection.tsx       # Reusable payment component
│   ├── NoteOutput.tsx           # Note preview component
│   ├── DarkModeToggle.tsx       # Dark mode toggle
│   └── CostInput.tsx            # Cost input with suggestions
├── App.tsx                      # Main application component
├── main.tsx                     # Application entry point
└── index.css                    # Global styles and animations
```

## Key Features Explained

### Form Sections
The app uses a modular approach with reusable components:
- **General Questions**: Client identification and basic information
- **Income Section**: Income assessment with cost calculations
- **Decision Section**: Approval/decline decision with reasoning

### Animation System
- Scroll-triggered animations for form sections
- Staggered animations for form groups
- Smooth transitions between service selection and forms

### Note Generation
Real-time note formatting that includes:
- Client information
- Service-specific details
- Income calculations
- Decision reasoning

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for the Ministry of Social Development
- Inspired by modern web application design patterns
- Uses React best practices and TypeScript for type safety 