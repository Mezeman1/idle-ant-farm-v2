# Google Analytics Setup

This project uses Google Analytics 4 (GA4) for tracking user interactions with GDPR compliance. Follow these steps to set up Google Analytics for your deployment.

## Local Development Setup

1. Create a Google Analytics 4 property in your [Google Analytics account](https://analytics.google.com/).
2. Get your Measurement ID (starts with "G-").
3. Update the `.env` file with your Measurement ID:

```
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

## GitHub Pages Deployment Setup

For GitHub Pages deployment, you need to set up a secret in your GitHub repository:

1. Go to your GitHub repository.
2. Navigate to Settings > Secrets and variables > Actions.
3. Click on "New repository secret".
4. Create a secret with the name `GOOGLE_ANALYTICS_ID` and set the value to your Measurement ID (e.g., `G-XXXXXXXXXX`).

The GitHub Actions workflow will automatically use this secret during the build process.

## GDPR Compliance

The application includes a GDPR consent banner that allows users to accept or decline analytics tracking. Analytics tracking is only enabled if the user explicitly accepts it.

### How it works

1. When a user visits the site for the first time, they'll see a consent banner at the bottom of the page.
2. If they click "Accept", Google Analytics will be enabled and their preference will be saved.
3. If they click "Decline", Google Analytics will remain disabled and their preference will be saved.
4. The user's preference is stored in localStorage and persists between sessions.

### Implementation Details

- The GDPR consent functionality is implemented in `src/composables/useGdprConsent.ts`.
- The consent banner UI is in `src/components/GdprConsentBanner.vue`.
- Analytics tracking with consent management is in `src/composables/useAnalytics.ts`.
- Google Analytics is initialized in `src/main.ts` with the appropriate consent settings.

## Testing Analytics

To verify that analytics are working correctly:

1. Open your site in a browser.
2. Accept the GDPR consent.
3. Navigate to different pages.
4. Check the Google Analytics Real-Time reports to see if your activity is being tracked.

## Debugging

If you're having issues with analytics:

1. Set `VITE_DEBUG_MODE=true` in your `.env` file to enable debug mode.
2. Open your browser's developer console to see debug messages from Google Analytics.
3. Verify that the consent banner is showing and functioning correctly.
4. Check that your Measurement ID is correctly set in the environment variables.
