# SolveGrid launch checklist

## Before deployment
- [ ] `npm run check` succeeds.
- [ ] Test every tool on 320px, 375px, 390px, 412px, 768px, and desktop widths.
- [ ] Check numeric examples and error messages for each calculator.
- [ ] Confirm each calculator route appears in `lib/tools.ts`.
- [ ] Confirm `/sitemap.xml` lists all public tools.
- [ ] Confirm `/robots.txt` allows public routes and references the sitemap.
- [ ] Set `SITE_URL` to the final HTTPS domain.
- [ ] Add `GOOGLE_SITE_VERIFICATION` after Search Console provides a token.
- [ ] Create an original favicon, Open Graph image, privacy page, and contact page before public launch.

## After deployment
- [ ] Add the domain to Google Search Console.
- [ ] Verify ownership through the preferred method.
- [ ] Submit `https://your-domain.example/sitemap.xml`.
- [ ] Use URL Inspection for the home page, `/tools`, and the most important calculator pages.
- [ ] Track mobile usability, indexing, performance, and search queries.
- [ ] Improve content based on actual user searches, not guesswork alone.
