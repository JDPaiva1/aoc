from collections import deque

SPELLS = {
    "MagicMissile": {
        "name": "Magic Missile",
        "cost": 53,
        "duration": None,
        "damage": 4,
        "hp": 0,
        "armor": 0,
        "mana": 0
    },
    "Drain": {
        "name": "Drain",
        "cost": 73,
        "duration": None,
        "damage": 2,
        "hp": 2,
        "armor": 0,
        "mana": 0
    },
    "Shield": {
        "name": "Shield",
        "cost": 113,
        "duration": 6,
        "damage": 0,
        "hp": 0,
        "armor": 7,
        "mana": 0
    },
    "Poison": {
        "name": "Poison",
        "cost": 173,
        "duration": 6,
        "damage": 3,
        "hp": 0,
        "armor": 0,
        "mana": 0
    },
    "Recharge": {
        "name": "Recharge",
        "cost": 229,
        "duration": 5,
        "damage": 0,
        "hp": 0,
        "armor": 0,
        "mana": 101
    }
}
PLAYER_STATS = {
    "hp": 50,
    "armor": 0,
    "mana": 500
}
BOSS_STATS = {
    "hp": 71,
    "damage": 10
}

class GameState:
    def __init__(self, hardMode):
        self.player = PLAYER_STATS.copy()
        self.boss = BOSS_STATS.copy()
        self.activeEffects = {}
        self.totalManaSpent = 0
        self.hardMode = hardMode

    def copy(self):
        newState = GameState(self.hardMode)
        newState.player = self.player.copy()
        newState.boss = self.boss.copy()
        newState.activeEffects = self.activeEffects.copy()
        newState.totalManaSpent = self.totalManaSpent
        return newState

    def applyEffects(self):
        """Apply all active effects at the start of a turn"""
        self.player["armor"] = 0  # Reset armor, shield will reapply if active
        effectsToRemove = []
        for spellName, turnsRemaining in self.activeEffects.items():
            spell = SPELLS[spellName]
            # Apply effect
            if spellName == "Shield":
                self.player["armor"] += spell["armor"]
            elif spellName == "Poison":
                self.boss["hp"] -= spell["damage"]
            elif spellName == "Recharge":
                self.player["mana"] += spell["mana"]
            # Decrease timer
            self.activeEffects[spellName] -= 1
            if self.activeEffects[spellName] <= 0:
                effectsToRemove.append(spellName)
                # del self.activeEffects[spellName]
        # Remove expired effects
        for spellName in effectsToRemove:
            del self.activeEffects[spellName]

    def canCastSpell(self, spellName):
        """Check if player can cast a spell"""
        spell = SPELLS[spellName]
        # Check mana cost
        if self.player["mana"] < spell["cost"]:
            return False
        # Check if effect is already active
        if spell["duration"] is not None and spellName in self.activeEffects:
            return False
        return True

    def castSpell(self, spellName):
        """Cast a spell and apply its immediate effects"""
        if not self.canCastSpell(spellName):
            return False
        spell = SPELLS[spellName]
        # Pay mana cost
        self.player["mana"] -= spell["cost"]
        self.totalManaSpent += spell["cost"]
        # Apply immediate effects
        if spell["duration"] is None:
            # Instant spell
            self.boss["hp"] -= spell["damage"]
            self.player["hp"] += spell["hp"]
        else:
            # Effect spell - add to active effects
            self.activeEffects[spellName] = spell["duration"]
        return True

    def bossAttack(self):
        """Boss attacks the player"""
        damage = max(1, self.boss["damage"] - self.player["armor"])
        self.player["hp"] -= damage

    def isGameOver(self):
        """Check if game is over and return winner"""
        if self.boss["hp"] <= 0:
            return "player"
        elif self.player["hp"] <= 0:
            return "boss"
        else:
            return None

def leastAmountOfManaToWin(hardMode=False):
    """Find the minimum mana needed to win using BFS"""
    initialState = GameState(hardMode)
    queue = deque([initialState])
    minMana = float('inf')

    while queue:
        state = queue.popleft()
        # Pruning: if we've already spent more mana than our best solution, skip
        if state.totalManaSpent >= minMana:
            continue

        # Player turn - hard mode damage first
        if state.hardMode:
            state.player["hp"] -= 1
        # Player turn - apply effects first
        state.applyEffects()
        # Check if boss died from effects
        winner = state.isGameOver()
        if winner == "player":
            minMana = min(minMana, state.totalManaSpent)
            continue
        elif winner == "boss":
            continue
        # Try each spell
        for spellName in SPELLS:
            if state.canCastSpell(spellName):
                newState = state.copy()
                if newState.castSpell(spellName):
                    # Check if boss died from spell
                    winner = newState.isGameOver()
                    if winner == "player":
                        minMana = min(minMana, newState.totalManaSpent)
                        continue
                    elif winner == "boss":
                        continue
                    # Boss turn - apply effects first
                    newState.applyEffects()
                    # Check if boss died from effects
                    winner = newState.isGameOver()
                    if winner == "player":
                        minMana = min(minMana, newState.totalManaSpent)
                        continue
                    elif winner == "boss":
                        continue
                    # Boss attacks
                    newState.bossAttack()
                    # Check if player died
                    winner = newState.isGameOver()
                    if winner != "boss":
                        queue.append(newState)
    return minMana

print(f"Least amount of mana to win: {leastAmountOfManaToWin()}")
print(f"Least amount of mana to win in hard mode: {leastAmountOfManaToWin(True)}")
