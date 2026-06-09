# LaunchFolio 🚀

LaunchFolio is a comprehensive AI-powered portfolio and resume builder designed to help professionals showcase their work and skills with ease. Built with modern web technologies, it offers a seamless experience from creation to deployment.

## ✨ Features

-   **AI Template Builder**: Generate personalized resume and portfolio templates using artificial intelligence.
-   **Portfolio Editor**: A feature-rich editor to customize every detail of your professional profile.
-   **Multiple Layouts**: Choose from a variety of aesthetically pleasing layouts like Architect, Artisan, CodeCraft, Corporate, and more.
-   **Razorpay Integration**: Seamless payment processing for premium features.
-   **Authentication**: Secure user authentication and account management.
-   **Responsive Design**: Optimized for all devices, from mobile to desktop.
-   **SEO & Analytics**: Built-in support for SEO meta tags and analytics tracking.

## 🛠️ Built With

-   **Frontend**: React, Vite, Tailwind CSS
-   **Backend**: Cloudflare Functions (Nitro/H3)
-   **Database**: SQLite (via D1/Wrangler)
-   **API Integration**: Razorpay for payments
-   **Deployment**: Cloudflare Pages

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   Wrangler CLI (for Cloudflare deployment)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/dhairyakumar018/LaunchFolio.git
    cd LaunchFolio
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Local Development**:
    ```bash
    npm run dev
    ```

4.  **Database Setup**:
    Initialize your local database using the provided `schema.sql`:
    ```bash
    npx wrangler d1 execute launchfolio-db --local --file=./schema.sql
    ```

## 📂 Project Structure

-   `functions/`: Cloudflare Pages Functions for backend logic.
-   `src/components/`: Reusable React components.
-   `src/contexts/`: React context providers (e.g., AuthContext).
-   `src/lib/`: Utility libraries and API clients.
-   `public/previews/`: Preview images for various resume/portfolio layouts.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ by [Dhairya Kumar](https://github.com/dhairyakumar018)
