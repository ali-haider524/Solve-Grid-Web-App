# SolveGrid Launch Runbook — solvegrid.online

This runbook prepares the website for a public launch. It does not guarantee Search ranking, indexing, or advertising approval.

## 1. Verify the domain registration

1. In Hostinger, correct and verify the registrant email for `solvegrid.online`.
2. Keep domain privacy enabled and auto-renewal on.
3. Wait for the domain status to become **Active** before connecting public hosting.

## 2. Choose one canonical domain

SolveGrid uses this canonical URL:

```text
https://solvegrid.online
```

At your hosting provider, make sure the `www.solvegrid.online` version redirects permanently to the canonical non-www URL. Do not serve the same site independently from two domains.

## 3. Configure hosting environment variables

Set these in the production hosting dashboard:

```env
SITE_URL=https://solvegrid.online
GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_CONTACT_EMAIL=
NEXT_PUBLIC_SITE_OPERATOR=SolveGrid
```

Only set `NEXT_PUBLIC_CONTACT_EMAIL` after you create and test that mailbox. Do not publish an address that cannot receive support requests.

## 4. Deploy and perform public checks

After deployment, open the exact public URLs:

```text
https://solvegrid.online/
https://solvegrid.online/tools
https://solvegrid.online/guides
https://solvegrid.online/sitemap.xml
https://solvegrid.online/robots.txt
https://solvegrid.online/privacy-policy
https://solvegrid.online/terms-of-use
https://solvegrid.online/disclaimer
https://solvegrid.online/contact
```

Check that links, forms, calculator outputs, the mobile navigation drawer, and legal/trust pages work on the deployed HTTPS domain.

## 5. Add Google Search Console

1. Create a **Domain property** for `solvegrid.online` in Google Search Console.
2. Complete the DNS TXT verification supplied by Search Console.
3. Put the provided token into `GOOGLE_SITE_VERIFICATION` only if you choose the HTML-tag method instead.
4. Submit `https://solvegrid.online/sitemap.xml`.
5. Use URL Inspection on the home page, `/tools`, a calculator page, and a guide page after launch.

## 6. Validate search presentation and performance

- Run the public tool and guide URLs through Google Rich Results Test.
- Run PageSpeed Insights for mobile and desktop.
- Test 320px, 360px, 375px, 390px, 412px, tablet, and desktop viewports.
- Keep the calculator result, not a long explanation, near the top of each mobile tool page.

## 7. Build links ethically

Do not buy spam links or publish copied comparison pages. Publish useful calculators, method guides, worked examples, and reference sheets that teachers, students, and engineers can cite naturally. Reach out only to relevant educational or technical communities with a specific useful resource.

## 8. Ads or analytics later

Do not add `ads.txt`, advertising scripts, cookie banners, or analytics claims until you have selected and configured those services. Update the Privacy Policy before enabling a service that processes additional data.
