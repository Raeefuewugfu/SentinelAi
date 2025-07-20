# PowerShell script om te deployen naar GitHub Pages
# Zorg dat gh-pages package is geïnstalleerd: npm install --save-dev gh-pages

# Build de site
npm run build

# Deploy de dist map naar gh-pages branch
npx gh-pages -d dist
