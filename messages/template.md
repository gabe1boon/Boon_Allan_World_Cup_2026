# Group Message Template — World Cup 2026 Sweepstake

## Purpose
This file defines the structure and rules for every update message sent to the group.
When Gabe says "make a message", use this file plus the latest `docs/data.json` and
the API (for match events since the last message) to draft the next one.

---

## Participants & their teams

**Do not use a hardcoded list.** Before every draft, read `config.py` and derive
the current participant list from the `ASSIGNMENTS` dict. New people may have been
added since the last message, and every name currently in `ASSIGNMENTS` must appear
in the message.

To build the list, group entries by colleague name — each person owns the teams
mapped to their name. Example of what to derive:

```
Gabe  → [France, Sweden, Colombia, New Zealand]
DB    → [Senegal, Uzbekistan, Qatar, Uruguay]
Jack  → [Panama, Spain, Scotland, Czechia]
...and so on for any new names that have been added
```

If a name appears in `ASSIGNMENTS` that was not in the previous approved message,
call them out with a **"welcome to the party"** shout-out somewhere in the message.

---

## Message rules (apply every time)

1. **Name coverage:** Every person currently in `config.py`'s `ASSIGNMENTS` dict
   must appear at least once. Derive this list fresh from `config.py` each time —
   do not assume the list is static.

2. **Structure (always in this order):**
   - **Cold open / hook** — one punchy line about the most dramatic moment since the
     last message (a shock result, a red card, a last-minute winner, etc.).
   - **Bottom of the leaderboard** — cover whoever is at the bottom (~bottom third).
     At least 2–3 people mentioned. Mock them lovingly; suggest they should have a
     word with their manager, their players, the referee, etc.
   - **Middle of the leaderboard** — cover whoever is in the middle (~middle third).
     At least 2–3 people. These are the "dark horses" or the "nearly men". Tease
     them about being average but hint they could still turn it around.
   - **Top of the leaderboard** — cover whoever is at the top (~top third). At least
     2–3 people. Wind them up about early lead meaning nothing, call them lucky, etc.
   - **Closing gag** — one-liner to sign off. Reference the next round/fixtures or
     something coming up that will shake things up.

3. **Tone:**
   - Always lighthearted, jokey, banter-forward.
   - No one is actually insulted — it's playful ribbing between colleagues.
   - Use football clichés and punditry language ironically (e.g. "game of two halves",
     "work rate", "they gave 110%").
   - Personalise jokes to the team's actual stats from the data, e.g.:
     - Too many yellow cards → "X needs to have a word with the [team] coach — they
       seem to think it's a contact sport."
     - Goals galore → "Y's [team] are absolutely bingeing on goals — someone's
       going to have a very good week."
     - Clean sheet → "Z's [team] are running a monastery back there — nothing gets in."
     - Red card → "A's [team] now playing with 10 men... and still looking like 9."
   - Reference upsets/scores from actual matches since the last message.

4. **Data sources to use before drafting:**
   - `docs/data.json` → current full leaderboard (points, wins, goals, cards, etc.).
   - API call: `GET /fixtures?league=1&season=2026` to identify matches finished
     since the last message's timestamp (stored in `approved/<date>_message.md`).
   - API call: `GET /fixtures/events?fixture={id}` for notable events (cards, big
     scorelines) from those matches — use `cache/` to avoid re-fetching.
   - Compare to the last approved message to identify what has changed.

5. **Reference previous messages:** Before drafting, read the most recent file in
   `messages/approved/` to:
   - Know what was already said (don't repeat the same jokes).
   - Know the leaderboard positions at the time of the last message, so you can
     call out who has moved up/down since.

6. **After approval:** When Gabe approves a draft, save it to
   `messages/approved/YYYY-MM-DD_message.md` with the metadata header below.
   This becomes the reference for the next message.

---

## Approved message file format

Each approved message is saved as `messages/approved/YYYY-MM-DD_message.md` with
this header followed by the message body:

```
---
date: YYYY-MM-DD
leaderboard_snapshot:
  1. Person — Team — X pts
  2. ...
matches_covered:
  - "Team A 2–1 Team B (date)"
  - ...
---

[message body here]
```

---

## Draft checklist (verify before presenting to Gabe)

- [ ] Read `config.py` and derived the current participant list (not hardcoded)
- [ ] Every name currently in `config.py` ASSIGNMENTS appears at least once
- [ ] Any new names (not in the last approved message) got a "welcome to the party" mention
- [ ] Bottom section covers at least 2 people in the bottom third
- [ ] Middle section covers at least 2 people in the middle third
- [ ] Top section covers at least 2 people in the top third
- [ ] At least 3 specific match results/events referenced
- [ ] Tone is jokey and banter-forward throughout
- [ ] Closing gag is present
- [ ] No joke was used in a previous approved message
- [ ] Leaderboard positions compared to last message (who moved up/down)
