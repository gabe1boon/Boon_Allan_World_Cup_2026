CARDS_PER_PERSON = 2

# Firebase Realtime Database URL (e.g. "https://your-project-default-rtdb.firebaseio.com")
# Leave empty to use only the manual ASSIGNMENTS dict below.
FIREBASE_DB_URL = "https://boonallan-world-cup-default-rtdb.firebaseio.com/"

SCORING = {
    "win": 3,
    "draw": 1,
    "goal_scored": 1,
    "clean_sheet": 2,
    "yellow_card": -1,
    "red_card": -2,
    "knockout_advance": 2,
}

# Team → colleague assignments.
#
# HOW TO USE:
#   1. Run `python print_teams.py` (with APISPORTS_KEY set) to generate this
#      block pre-filled with every World Cup 2026 team ID and name.
#   2. Paste the output here.
#   3. After the draw, replace None with the colleague's name for each team.
#      Teams left as None will appear in the "still to be picked" list on the page.
#
# Example once populated:
#     6:    "Alice",   # Brazil
#     26:   "Bob",     # Argentina
#     9:    None,      # Spain — not yet picked
#
ASSIGNMENTS = {
    # team_id: "Name",  # Team name
}

# FIFA ranking groups for WC2026 (A = highest-ranked, D = lowest).
# Team names must match the API-Football names exactly.
# 48 teams split into 4 tiers of 12 by approximate FIFA World Ranking.
FIFA_GROUPS = {
    "A": [
        "Argentina", "France", "England", "Brazil", "Portugal", "Spain",
        "Belgium", "Netherlands", "Germany", "Croatia", "Morocco", "Colombia",
    ],
    "B": [
        "USA", "Mexico", "Japan", "Senegal", "Uruguay", "Switzerland",
        "South Korea", "Ecuador", "Canada", "Austria", "Norway", "Sweden",
    ],
    "C": [
        "Türkiye", "Scotland", "Ivory Coast", "Egypt", "Ghana", "Iran",
        "Czechia", "Tunisia", "Australia", "Iraq", "Saudi Arabia", "Panama",
    ],
    "D": [
        "Paraguay", "Algeria", "Congo DR", "Jordan", "South Africa", "Qatar",
        "Uzbekistan", "Cape Verde Islands", "Bosnia & Herzegovina",
        "New Zealand", "Curaçao", "Haiti",
    ],
}

# Bonus points for beating a team from a higher-ranked group.
# Index = number of tiers above: [same=0, 1 tier=+1, 2 tiers=+3, 3 tiers=+5]
UPSET_BONUS = [0, 1, 3, 5]
