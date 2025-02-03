# Bholenium
This extension is developed for replicating pre-recorded user interaction in web browser.

# Setting Up a Vite-Powered Chrome Extension Project

## Prerequisites
Before proceeding, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (comes with Node.js)
- [Google Chrome](https://www.google.com/chrome/) (or a Chromium-based browser)

## Installation
1. **Clone the repository** (if applicable):
   ```sh
   git clone https://github.com/MrBhola/Bholenium.git
   cd <your-project-directory>
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```
   or if using Yarn:
   ```sh
   yarn install
   ```

## Development Mode
1. **Start the development build**:
   ```sh
   npm run dev
   ```
   or using Yarn:
   ```sh
   yarn dev
   ```
   This will generate the latest build inside the `dist/` directory.

2. **Load the unpacked extension in Chrome**:
    - Open Chrome and go to `chrome://extensions/`
    - Enable **Developer mode** (toggle in the top-right corner)
    - Click **Load unpacked**
    - Select the `dist/` folder of your project

3. The extension should now be loaded in Chrome and available for testing.

## Production Build
When you're ready to create a production-ready build, run:
```sh
npm run build
```
or using Yarn:
```sh
yarn build
```
This will create an optimized version of your extension inside the `dist/` directory, which you can package and submit to the Chrome Web Store.

## Additional Notes
- If you make changes during development, restart the `npm run dev` command to regenerate the `dist/` folder.
- Any manifest file or background scripts should be properly configured in `vite.config.js` to ensure correct compilation.
- If using HMR (Hot Module Replacement), make sure the extension reloads properly.
