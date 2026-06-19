CARDS_PER_PERSON = 4
FIREBASE_DB_URL = "https://boonallan-world-cup-default-rtdb.firebaseio.com"

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
    2:    "Gabe",    # France
    5:    "Gabe",    # Sweden
    8:    "Gabe",    # Colombia
    4673: "Gabe",    # New Zealand
    13:   "DB",      # Senegal
    1568: "DB",      # Uzbekistan
    1569: "DB",      # Qatar
    15:   "Stuart",  # Switzerland
    1113: "Stuart",  # Bosnia & Herzegovina
    5530: "Stuart",  # Curaçao
    23:   "Messy",   # Saudi Arabia
    32:   "Messy",   # Egypt
    5529: "Messy",   # Canada
    27:   "Adam",    # Portugal
    1533: "Adam",    # Cape Verde Islands
    2380: "Adam",    # Paraguay
    31:   "Mark",    # Morocco
    1532: "Mark",    # Algeria
    2382: "Mark",    # Ecuador
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
