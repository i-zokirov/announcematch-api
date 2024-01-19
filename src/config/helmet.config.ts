import { HelmetOptions } from 'helmet';

export const helperConfigOptions: HelmetOptions = {
  // Content Security Policy helps prevent unwanted content being injected into your webpages;
  // This can help mitigate cross-site scripting (XSS) attacks and other forms of injection attacks.
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // Limits where resources can be loaded from; here, only from the same origin
      styleSrc: ["'self'", 'https://fonts.googleapis.com'], // Defines valid sources for stylesheets
      imgSrc: ["'self'", 'data:', 'https://cdn.example.com'], // Defines valid sources for images
      objectSrc: ["'none'"], // Defines valid sources for plugins, like <object>, <embed>, or <applet>
      upgradeInsecureRequests: [], // Upgrades insecure requests to HTTPS
    },
  },
  // Controls the browser’s DNS prefetching feature, which can improve performance but may have privacy implications
  dnsPrefetchControl: {
    allow: false, // Disables DNS prefetching
  },
  // Prevents your site from being framed (clickjacking protection)
  frameguard: {
    action: 'deny', // Denies any domain from framing your site
  },
  // Strict-Transport-Security enforces secure (HTTPS) connections to the server
  hsts: {
    maxAge: 31536000, // Time, in seconds, that the browser should remember that the site is only accessed using HTTPS
    includeSubDomains: true, // Applies HSTS to all subdomains
    preload: true, // Allows the domain to be included in browsers' preload list
  },
  // Restricts Adobe Flash and PDFs from loading data from your domain
  permittedCrossDomainPolicies: {
    permittedPolicies: 'none', // No policy file is allowed anywhere on the target server
  },
  // Governs which referrer information sent in the Referer header should be included with requests made
  referrerPolicy: {
    policy: 'no-referrer', // Omits the Referer header entirely. No referrer information is sent along with requests.
  },
};
