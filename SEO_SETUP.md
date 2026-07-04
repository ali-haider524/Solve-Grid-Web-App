# SolveGrid SEO setup

Before launch, set these environment variables in your hosting provider:

```text
SITE_URL=https://www.your-domain.com
GOOGLE_SITE_VERIFICATION=verification-token-from-search-console
```

After deployment:

1. Open `https://www.your-domain.com/sitemap.xml` and confirm every live page uses the real domain.
2. Open `https://www.your-domain.com/robots.txt` and confirm it points to the same sitemap.
3. Add the domain to Google Search Console and verify it using a DNS TXT record or the verification token.
4. Submit `/sitemap.xml` in Google Search Console.
5. Only add a tool to the sitemap when its page is live and useful.
