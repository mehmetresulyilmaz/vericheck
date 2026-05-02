# VeriCheck - AI Content Detector

VeriCheck is a professional-grade web application designed to detect AI-generated content across various formats, including text, images, videos, and academic documents. Using advanced heuristic scanning and neural artifact analysis, it provides detailed likelihood scores and technical breakdowns.

## 🚀 Live Demo
The application is designed to be deployed on **Vercel** and integrated with **GitHub**.

## ✨ Features
- **Multi-format Support**: Analyze Text, Images, Videos, and Documents (PDF, DOCX).
- **Academic Deep-Scan**: Specialized heuristics for research papers and essays.
- **Visual Forensics**: Detects GAN artifacts and pixel diffusion patterns.
- **Multilingual UI**: Full support for English and Turkish.
- **Modern UI/UX**: Professional, clean dark-themed interface built with Tailwind CSS and Framer Motion.
- **Detailed Analytics**: Provides confidence scores and specific parameter matches (Syntactic Patterning, Metadata, etc.).

## 🛠️ Technology Stack
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4.0
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Development**: Vite
- **Detection Engine**: Simulated Heuristic Classifier (Expandable via API)

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/vericheck.git
   cd vericheck
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment to Vercel

1. Push your code to a GitHub repository.
2. Connect your GitHub account to [Vercel](https://vercel.com).
3. Select the `vericheck` repository.
4. Vercel will automatically detect Vite settings. Click **Deploy**.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
Distributed under the Apache-2.0 License. See `LICENSE` for more information.
