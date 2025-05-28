# MyCareerCompass - Your AI-Powered Career Guide

Welcome to MyCareerCompass! This is a web application designed to help you explore career paths, get job advice, and understand your professional strengths through an interactive quiz and an AI-powered chat.

## What is this app for?

Imagine having a personal career advisor available anytime. MyCareerCompass aims to be just that! You can:

*   **Chat with an AI:** Ask questions about careers, job searching, skill development, and more.
*   **Take a Quiz:** Answer questions about your interests, skills, and personality to get personalized career suggestions.
*   **Get Insights:** Receive an analysis of your quiz results to understand which careers might be a good fit for you.

## How was this app built? (The Tech Stuff)

We used modern web technologies to create a smooth and intelligent experience:

*   **Main Framework:** **Next.js** - This is a popular and powerful system for building fast and user-friendly websites with **React** (a library for building user interfaces).
*   **Programming Language:** **TypeScript** - This is a version of JavaScript that helps catch errors early and makes the code easier to manage as the project grows.
*   **Styling:**
    *   **Tailwind CSS:** A utility-first CSS framework that allows for rapid styling of components.
    *   **Shadcn/ui:** A collection of beautifully designed and accessible UI components that we can re-use.
*   **Artificial Intelligence (AI):**
    *   **Google Gemini:** This is the AI brain behind our chat and quiz analysis. It understands your questions and provides intelligent responses.
    *   **Vercel AI SDK:** A toolkit that helps us easily connect our application to AI models like Gemini.
*   **Backend & Database (Likely):**
    *   **Supabase:** While not explicitly detailed in our current task, applications like this often use Supabase (or similar services like Firebase) to handle user accounts, save chat history, or store quiz results. Your `.env.local` file has Supabase keys, suggesting its use.
*   **Other Important Tools:**
    *   **Zod:** Used for making sure the data (like quiz answers or AI responses) is in the correct format.
    *   **Framer Motion:** Helps create smooth animations and transitions in the app.
    *   **Lucide React:** Provides a nice set of icons used throughout the app.
    *   **Sonner:** Used for showing pop-up notifications (toasts).

## Core Features

*   **AI Career Chatbot:** Get instant advice on your career questions.
*   **Interactive Career Quiz:** Discover career paths tailored to you.
*   **Personalized Quiz Analysis:** Understand your strengths and how they map to different professions.
*   **Chat History:** (Likely, if Supabase is fully integrated) Save and revisit your conversations.
*   **User Session Management:** Keeps you logged in and remembers your session.

## How It Works (Simplified)

1.  **You Use the Website:** You open MyCareerCompass in your web browser. The website pages are built using Next.js and React.
2.  **AI Features:**
    *   When you chat or submit a quiz, your browser sends a request to special API routes within our Next.js application (like `/api/chat` or `/api/analyze-quiz`).
    *   These API routes then securely talk to the Google Gemini API using the Vercel AI SDK.
    *   Gemini processes the information and sends back an intelligent response or analysis.
    *   The API route sends this response back to your browser to be displayed.
3.  **Data Storage (Likely with Supabase):** If you have an account or if chat history is saved, this information is likely stored securely in a Supabase database.

## Project Structure Overview

The code is organized into several main folders:

*   `app/`: This is where most of the application's core logic lives, including:
    *   `app/api/`: Handles backend requests, like talking to the AI.
    *   `app/(routes)/page.tsx`: Defines the different pages you see (e.g., chat page, quiz page).
*   `components/`: Contains reusable building blocks for the user interface (like buttons, cards, etc.).
*   `hooks/`: Custom helper functions for React components (e.g., managing user sessions).
*   `public/`: Stores static files like images or fonts.
*   `.env.local`: A crucial file (that you don't share publicly) where secret API keys and other configuration settings are stored.

## Getting Started (For Developers)

If you want to run this project on your own computer:

1.  **Clone the Repository:** Download the project files.
    ```bash
    git clone <repository_url>
    cd mycareercompass
    ```
2.  **Install Dependencies:** This will download all the necessary software packages the project needs.
    ```bash
    npm install
    ```
3.  **Set Up Environment Variables:**
    *   Create a file named `.env.local` in the main project folder.
    *   Copy the contents of `.env.example` (if one exists) or add the necessary keys like:
        ```env
        NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
        NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
        SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key # If needed for backend operations
        GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
        # Add any other keys like RESEND_API_KEY if used
        ```
    *   Replace `your_..._key` with your actual API keys.
4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
5.  Open your browser and go to `http://localhost:3000`.

---

This README provides a general overview. Enjoy using MyCareerCompass!
