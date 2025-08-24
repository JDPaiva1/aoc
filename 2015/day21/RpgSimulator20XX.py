# [NAME, COST, DAMAGE, ARMOR]
WEAPONS = [
    ["Dagger", 8, 4, 0],
    ["Shortsword", 10, 5, 0],
    ["Warhammer", 25, 6, 0],
    ["Longsword", 40, 7, 0],
    ["Greataxe", 74, 8, 0]
]

ARMOR = [
    ["none", 0, 0, 0],
    ["Leather", 13, 0, 1],
    ["Chainmail", 31, 0, 2],
    ["Splintmail", 53, 0, 3],
    ["Bandedmail", 75, 0, 4],
    ["Platemail", 102, 0, 5]
]

RINGS = [
    ["none", 0, 0, 0],
    ["none 2", 0, 0, 0],
    ["Damage +1", 25, 1, 0],
    ["Damage +2", 50, 2, 0],
    ["Damage +3", 100, 3, 0],
    ["Defense +1", 20, 0, 1],
    ["Defense +2", 40, 0, 2],
    ["Defense +3", 80, 0, 3]
]

# [HIT POINTS, DAMAGE, ARMOR]
PlayerStats = [100, 0, 0]
BossStats = [103, 9, 2]
# PlayerStats = [8, 5, 5]
# BossStats = [12, 7, 2]

def simulateBattle(player, boss):
    turn = 0
    print(f"Player {player[0]} HP, {player[1]} damage, {player[2]} armor")
    print(f"Boss {boss[0]} HP, {boss[1]} damage, {boss[2]} armor")
    print("Battle begins!")

    while player[0] > 0 and boss[0] > 0:
        if(turn % 2 == 0):
            # Player's turn
            damage = player[1] - boss[2]
            boss[0] -= damage if damage > 0 else 1
            # print(f"The player deals {damage if damage > 0 else 1} damage; the boss goes down to {boss[0]} hit points.")
        else:
            # Boss's turn
            damage = boss[1] - player[2]
            player[0] -= damage if damage > 0 else 1
            # print(f"The boss deals {damage if damage > 0 else 1} damage; the player goes down to {player[0]} hit points.")
        turn += 1

    return "Player" if player[0] > 0 else "Boss"

# print(f"The winner is {simulateBattle(PlayerStats.copy(), BossStats.copy())}")

def leastAmountOfGoldToWin():
    minCost = int()
    RINGS.sort(key=lambda x: x[1])
    for weapon in WEAPONS:
        for armor in ARMOR:
            for ring1 in RINGS:
                for ring2 in RINGS:
                    if ring1 != ring2:
                        player = PlayerStats.copy()
                        boss = BossStats.copy()

                        cost = sum([weapon[1], armor[1], ring1[1], ring2[1]])
                        damage = sum([weapon[2], ring1[2], ring2[2]])
                        playerArmor = sum([armor[3], ring1[3], ring2[3]])

                        player[1] += damage
                        player[2] += playerArmor

                        result = simulateBattle(player, boss)

                        if result == "Player":
                            minCost = min(minCost, cost) if minCost > 0 else cost
    return minCost

print(f"The least amount of gold to win: {leastAmountOfGoldToWin()}")
