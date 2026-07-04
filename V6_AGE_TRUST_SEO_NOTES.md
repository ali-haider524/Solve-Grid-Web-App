# SolveGrid V6: Age calculator, trust pages, and crawling checklist

## Added public routes
- `/age-calculator`
- `/guides/calculate-age-from-date-of-birth`
- `/about`
- `/contact`
- `/privacy-policy`
- `/terms-of-use`
- `/disclaimer`

## Before deployment
1. Set `SITE_URL` to the final HTTPS domain.
2. Set `NEXT_PUBLIC_CONTACT_EMAIL` to a real monitored support address.
3. Set `GOOGLE_SITE_VERIFICATION` after Search Console gives you a token.
4. Check `/sitemap.xml`, `/robots.txt`, `/about`, `/contact`, and every policy page on the live domain.
5. Submit `https://your-domain/sitemap.xml` in Google Search Console.
6. Do not add `ads.txt` until an advertising provider gives you its exact publisher line.

## Age calculator notes
- Date of birth is not saved by the calculator.
- A share URL is only generated after the user selects Copy link.
- The reference date defaults to today after the page loads.
- For a 29 February birthday, non-leap-year next birthdays use the last day of February.
