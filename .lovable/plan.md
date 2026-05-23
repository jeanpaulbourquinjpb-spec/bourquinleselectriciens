# Scheduled article scraper for Actualité

## What we'll build

A background job that runs every 10 days, scrapes `e-tec.swiss` (the e-tec member portal feeding your news), stores new articles in the database, and renders them on `/actualite` — newest first, with the most recent one featured "À la une".

## Steps

1. **Database** — create `articles` table:
   - `url` (unique), `title`, `excerpt`, `category`, `published_at`, `scraped_at`, `featured`
   - RLS: public read, no public write (writes via server only)

2. **Connect Firecrawl** — needed to reliably scrape the site + extract structured article data (title, date, category, excerpt). I'll prompt you to link it.

3. **Scraping logic** (`src/lib/scrape-articles.server.ts`):
   - Map e-tec.swiss to discover category/article URLs (`?member=1108` appended)
   - Scrape each article page, extract title/date/category/excerpt with Firecrawl's JSON format
   - Insert only URLs not already in DB (dedup by URL)
   - Mark the single newest article as `featured = true`, unmark others

4. **Public cron endpoint** — `src/routes/api/public/hooks/scrape-articles.ts` (POST). Calls the scraping logic. Secured by Supabase anon `apikey` header (default `/api/public/*` pattern).

5. **pg_cron schedule** — every 10 days at 03:00 UTC, calls the endpoint via `pg_net`.

6. **Actualité page** — replace the hard-coded `news` array with a loader that reads from the `articles` table, sorted by `published_at DESC`. Featured article rendered in a larger "À la une" card on top, rest in the existing grid grouped/labeled by category.

## Notes

- Categories will be inferred from the site's own category taxonomy (e.g. "Installation de base", "Énergies alternatives", "Sécurité", etc.) — same ones e-tec uses.
- First run populates the table; subsequent runs only add deltas.
- No articles are ever deleted automatically.

## Confirm before I start

- OK to **link the Firecrawl connector** (free tier is enough for a 10-day cadence)?
- OK to **replace the current static news list** on `/actualite` with DB-backed content? (The 5 existing entries will be re-scraped from e-tec on first run.)
