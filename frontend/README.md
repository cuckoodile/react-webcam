# React Webcam App with Camera Context Controls

This project is a simple React app using `react-webcam` and Vite, featuring advanced camera context controls such as mirroring, vertical flipping, rotation, and camera facing mode switching. It also integrates with a backend (e.g., Django) for uploading captured images.

## Features

- Live webcam preview
- Switch between front and back cameras
- Mirror (horizontal flip) the camera feed
- Flip the camera feed vertically
- Rotate the camera feed (0°, 90°, 180°, 270°)
- Capture images with all transformations applied
- Cooldown between captures
- Upload captured images to a backend
- View a gallery of recent captures

## Getting Started

### Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn

### Installation

1. Clone the repository or copy the project files.
2. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

3. Start the development server:

   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser to the local server URL (usually `http://localhost:5173`).

## Usage

### Main Interface

- The webcam feed is displayed in the center of the page.
- Camera context controls are available above the webcam view:
  - **Front/Back**: Switch between the device's front and back cameras (if available).
  - **Mirror**: Toggle horizontal mirroring of the camera feed.
  - **Flip Vertically**: Toggle vertical flipping of the camera feed.
  - **Rotate**: Rotate the camera feed in 90° increments.
  - **Rotation Indicator**: Shows the current rotation angle.

### Capturing Images

- Click the **Capture 📸** button to take a snapshot.
- The captured image will reflect all current camera settings (mirror, flip, rotation, facing mode).
- After capture, the image is uploaded to the backend and added to the gallery below.
- A cooldown prevents rapid consecutive captures.

### Gallery

- The most recent captured images are displayed in a horizontal scrollable gallery.
- Images are shown as thumbnails with the applied transformations.

## Code Overview

### Key Components

- **App.jsx**: Main React component containing all logic and UI.
- **react-webcam**: Library used for webcam access and image capture.
- **Camera Controls**: State variables and buttons for context configuration.
- **Canvas Transformation**: Captured images are processed in a canvas to apply mirror, flip, and rotation before upload.

### Example: Camera Controls State

```jsx
const [facingMode, setFacingMode] = useState("user"); // 'user' or 'environment'
const [isMirrored, setIsMirrored] = useState(true);
const [isFlipped, setIsFlipped] = useState(false);
const [rotate, setRotate] = useState(0); // 0, 90, 180, 270
```

### Example: Applying Transformations on Capture

```jsx
const captureImage = () => {
  // ...
  const img = new window.Image();
  img.onload = function () {
    const canvas = document.createElement("canvas");
    // Set canvas size based on rotation
    // ...
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotateRad);
    ctx.scale(isMirrored ? -1 : 1, isFlipped ? -1 : 1);
    ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
    ctx.restore();
    // ...
  };
  img.src = imageSrc;
};
```

## Customization

- You can adjust the default camera settings by changing the initial state values.
- The UI can be styled further using Tailwind CSS or your preferred CSS framework.
- Backend integration is handled via custom hooks (e.g., `usePostAttendanceApi`).

## Troubleshooting

- **Camera not accessible**: Ensure your browser has permission to access the camera.
- **Back camera not available**: Not all devices support the `environment` facing mode.
- **Image not rotated/mirrored**: All transformations are applied via canvas before upload; ensure you are using the provided capture logic.

## Dependencies

- [react-webcam](https://www.npmjs.com/package/react-webcam)
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)

## License

This project is provided as-is for educational and demonstration purposes.
