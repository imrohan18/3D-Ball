<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🏏 Kookaburra 3D Cricket Ball Experience

A high-fidelity 3D interactive experience for exploring Kookaburra cricket balls, built with React, Three.js, and GSAP.

## ✨ Features

- **High-Fidelity 3D Model**: Custom [girdled sphere geometry](file:///d%3A/3D-Ball/src/utils/geometry.ts) that accurately represents the unique shape of a cricket ball.
- **4K Procedural Textures**: Realistic leather grain, pores, micro-scratches, and gold foil branding generated on the fly.
- **Dynamic Stitching**: 
  - Vertical (up-to-down) alignment.
  - Continuous clockwise animation along the seam.
  - Realistic normal and alpha mapping for depth and transparency.
- **Interactive Customization**:
  - Switch between **Red**, **White**, and **Pink** ball variants.
  - Smooth scale and material transitions using GSAP.
- **Responsive Interaction**: 
  - Mouse-parallax effect for ball rotation.
  - Fully responsive design that adapts to all screen sizes.
- **Advanced Lighting**: Environment mapping with PMREM generator and directional lighting for realistic reflections.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **3D Engine**: [Three.js](https://threejs.org/)
- **Animation**: [GSAP](https://gsap.com/) (GreenSock Animation Platform)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd 3D-Ball
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Build for production**:
    ```bash
    npm run build
    ```

## 📂 Project Structure

- `src/App.tsx`: Main entry point containing the 3D scene, UI, and animation logic.
- `src/utils/geometry.ts`: Custom geometry functions for the cricket ball's unique shape.
- `src/utils/textures.ts`: Procedural texture generation for leather, stitching, and branding.
- `src/index.css`: Global styles and Tailwind imports.

## 📝 License

This project is licensed under the Apache-2.0 License.
