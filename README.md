# Azure Run — Three.js Boat Game

A lightweight 3D checkpoint racing game built with [Three.js](https://threejs.org/) and Vite. Everything in the scene is generated with code, so there are no model downloads or asset licenses to manage.

## Features

- Procedural low-poly ocean, speedboat, islands, buoys, clouds, and checkpoints
- Boat acceleration, reverse, steering, wake, bobbing, and collision feedback
- Eight-checkpoint time trial with hull health and persistent best time
- Responsive HUD plus keyboard and touchscreen controls
- Static production build ready for GitHub Pages

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite. Use `WASD` or the arrow keys to drive. On touch devices, use the on-screen controls.

## Production build

```bash
npm run build
npm run preview
```

## Deploy

The included GitHub Actions workflow builds and deploys the game to GitHub Pages whenever `main` is updated. In the repository's **Settings → Pages**, choose **GitHub Actions** as the source if it is not selected automatically.

## Contributing

Issues and pull requests are welcome. Please keep dependencies lean and make sure `npm run build` succeeds before opening a pull request.

## License

MIT © 2026
