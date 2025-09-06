const fs = require('fs');

// RPG System Library
class RPGSystem {
    constructor() {
        this.rpgFile = './database/rpg.json';
        this.economyFile = './database/economy.json';
        this.inventoryFile = './database/inventory.json';
        this.questsFile = './database/quests.json';
        this.gamesFile = './database/games.json';
    }

    // Load database files
    loadDatabase(file) {
        try {
            if (fs.existsSync(file)) {
                return JSON.parse(fs.readFileSync(file));
            }
            return {};
        } catch (err) {
            return {};
        }
    }

    // Save database files
    saveDatabase(file, data) {
        try {
            fs.writeFileSync(file, JSON.stringify(data, null, 2));
            return true;
        } catch (err) {
            console.error('Error saving database:', err);
            return false;
        }
    }

    // Get or create player profile
    getPlayer(userId) {
        const rpgData = this.loadDatabase(this.rpgFile);
        if (!rpgData[userId]) {
            rpgData[userId] = {
                name: '',
                level: 1,
                xp: 0,
                hp: 100,
                maxHp: 100,
                mp: 50,
                maxMp: 50,
                strength: 10,
                defense: 10,
                agility: 10,
                intelligence: 10,
                luck: 10,
                class: 'Newbie',
                title: 'Beginner',
                lastAdventure: 0,
                lastWork: 0,
                lastDaily: 0,
                totalBattles: 0,
                wins: 0,
                losses: 0,
                questsCompleted: 0,
                achievements: [],
                createdAt: Date.now()
            };
            this.saveDatabase(this.rpgFile, rpgData);
        }
        return rpgData[userId];
    }

    // Get or create economy profile
    getEconomy(userId) {
        const economyData = this.loadDatabase(this.economyFile);
        if (!economyData[userId]) {
            economyData[userId] = {
                money: 1000,
                bank: 0,
                job: 'Unemployed',
                jobLevel: 1,
                lastWork: 0,
                totalEarned: 0,
                totalSpent: 0,
                investments: {},
                businesses: []
            };
            this.saveDatabase(this.economyFile, economyData);
        }
        return economyData[userId];
    }

    // Get or create inventory
    getInventory(userId) {
        const inventoryData = this.loadDatabase(this.inventoryFile);
        if (!inventoryData[userId]) {
            inventoryData[userId] = {
                weapons: { 'Wooden Sword': 1 },
                armor: { 'Cloth Shirt': 1 },
                potions: { 'Health Potion': 3 },
                materials: {},
                tools: {},
                equipped: {
                    weapon: 'Wooden Sword',
                    armor: 'Cloth Shirt',
                    accessory: null
                }
            };
            this.saveDatabase(this.inventoryFile, inventoryData);
        }
        return inventoryData[userId];
    }

    // Add XP and handle level up
    addXP(userId, amount) {
        const rpgData = this.loadDatabase(this.rpgFile);
        const player = this.getPlayer(userId);
        
        player.xp += amount;
        const newLevel = Math.floor(player.xp / 100) + 1;
        
        let leveledUp = false;
        if (newLevel > player.level) {
            leveledUp = true;
            const levels = newLevel - player.level;
            player.level = newLevel;
            player.maxHp += levels * 10;
            player.maxMp += levels * 5;
            player.hp = player.maxHp;
            player.mp = player.maxMp;
            player.strength += levels * 2;
            player.defense += levels * 2;
            player.agility += levels * 1;
            player.intelligence += levels * 1;
            player.luck += levels * 1;
        }
        
        rpgData[userId] = player;
        this.saveDatabase(this.rpgFile, rpgData);
        
        return { leveledUp, newLevel: player.level, xpGained: amount };
    }

    // Add money
    addMoney(userId, amount) {
        const economyData = this.loadDatabase(this.economyFile);
        const economy = this.getEconomy(userId);
        
        economy.money += amount;
        economy.totalEarned += amount;
        
        economyData[userId] = economy;
        this.saveDatabase(this.economyFile, economyData);
        
        return economy.money;
    }

    // Subtract money
    subtractMoney(userId, amount) {
        const economyData = this.loadDatabase(this.economyFile);
        const economy = this.getEconomy(userId);
        
        if (economy.money < amount) return false;
        
        economy.money -= amount;
        economy.totalSpent += amount;
        
        economyData[userId] = economy;
        this.saveDatabase(this.economyFile, economyData);
        
        return true;
    }

    // Add item to inventory
    addItem(userId, category, item, quantity = 1) {
        const inventoryData = this.loadDatabase(this.inventoryFile);
        const inventory = this.getInventory(userId);
        
        if (!inventory[category]) inventory[category] = {};
        if (!inventory[category][item]) inventory[category][item] = 0;
        
        inventory[category][item] += quantity;
        
        inventoryData[userId] = inventory;
        this.saveDatabase(this.inventoryFile, inventoryData);
        
        return true;
    }

    // Battle system
    battle(player1Id, enemy) {
        const player = this.getPlayer(player1Id);
        const inventory = this.getInventory(player1Id);
        
        // Calculate player stats with equipment
        let playerAttack = player.strength;
        let playerDefense = player.defense;
        
        if (inventory.equipped.weapon) {
            playerAttack += this.getWeaponDamage(inventory.equipped.weapon);
        }
        if (inventory.equipped.armor) {
            playerDefense += this.getArmorDefense(inventory.equipped.armor);
        }
        
        // Battle simulation
        let playerHp = player.hp;
        let enemyHp = enemy.hp;
        let turn = 1;
        let battleLog = [];
        
        while (playerHp > 0 && enemyHp > 0) {
            if (turn % 2 === 1) {
                // Player turn
                const damage = Math.max(1, playerAttack - enemy.defense + Math.floor(Math.random() * 5));
                enemyHp -= damage;
                battleLog.push(`⚔️ Kamu menyerang ${enemy.name} sebesar ${damage} damage!`);
                if (enemyHp <= 0) {
                    battleLog.push(`🏆 ${enemy.name} telah dikalahkan!`);
                    break;
                }
            } else {
                // Enemy turn
                const damage = Math.max(1, enemy.attack - playerDefense + Math.floor(Math.random() * 3));
                playerHp -= damage;
                battleLog.push(`💥 ${enemy.name} menyerang kamu sebesar ${damage} damage!`);
                if (playerHp <= 0) {
                    battleLog.push(`💀 Kamu telah dikalahkan oleh ${enemy.name}!`);
                    break;
                }
            }
            turn++;
        }
        
        // Update player stats
        const rpgData = this.loadDatabase(this.rpgFile);
        player.hp = Math.max(1, playerHp);
        player.totalBattles++;
        
        if (playerHp > 0) {
            // Player wins
            player.wins++;
            const xpGain = enemy.xpReward || 25;
            const moneyGain = enemy.moneyReward || 50;
            
            this.addXP(player1Id, xpGain);
            this.addMoney(player1Id, moneyGain);
            
            battleLog.push(`💰 Kamu mendapat ${moneyGain} gold dan ${xpGain} XP!`);
            
            // Random item drop
            if (Math.random() < 0.3 && enemy.itemDrops) {
                const randomItem = enemy.itemDrops[Math.floor(Math.random() * enemy.itemDrops.length)];
                this.addItem(player1Id, randomItem.category, randomItem.name, 1);
                battleLog.push(`🎁 Kamu mendapat ${randomItem.name}!`);
            }
        } else {
            // Player loses
            player.losses++;
            const moneyLost = Math.floor(this.getEconomy(player1Id).money * 0.1);
            this.subtractMoney(player1Id, moneyLost);
            battleLog.push(`💸 Kamu kehilangan ${moneyLost} gold...`);
        }
        
        rpgData[player1Id] = player;
        this.saveDatabase(this.rpgFile, rpgData);
        
        return {
            won: playerHp > 0,
            battleLog: battleLog,
            playerHp: playerHp,
            enemyHp: enemyHp
        };
    }

    // Get weapon damage
    getWeaponDamage(weapon) {
        const weapons = {
            'Wooden Sword': 5,
            'Iron Sword': 12,
            'Steel Sword': 20,
            'Magic Sword': 35,
            'Dragon Sword': 50,
            'Legendary Blade': 80
        };
        return weapons[weapon] || 0;
    }

    // Get armor defense
    getArmorDefense(armor) {
        const armors = {
            'Cloth Shirt': 2,
            'Leather Armor': 8,
            'Iron Armor': 15,
            'Steel Armor': 25,
            'Magic Robe': 30,
            'Dragon Armor': 45,
            'Legendary Armor': 70
        };
        return armors[armor] || 0;
    }

    // Get enemies list
    getEnemies() {
        return {
            'Goblin': {
                name: 'Goblin',
                hp: 30,
                attack: 8,
                defense: 3,
                xpReward: 15,
                moneyReward: 25,
                itemDrops: [
                    { category: 'materials', name: 'Goblin Ear' },
                    { category: 'potions', name: 'Health Potion' }
                ]
            },
            'Orc': {
                name: 'Orc',
                hp: 60,
                attack: 15,
                defense: 8,
                xpReward: 30,
                moneyReward: 50,
                itemDrops: [
                    { category: 'weapons', name: 'Iron Sword' },
                    { category: 'materials', name: 'Orc Tusk' }
                ]
            },
            'Skeleton': {
                name: 'Skeleton Warrior',
                hp: 45,
                attack: 12,
                defense: 6,
                xpReward: 25,
                moneyReward: 40,
                itemDrops: [
                    { category: 'materials', name: 'Bone Fragment' },
                    { category: 'armor', name: 'Leather Armor' }
                ]
            },
            'Dragon': {
                name: 'Young Dragon',
                hp: 200,
                attack: 40,
                defense: 25,
                xpReward: 100,
                moneyReward: 200,
                itemDrops: [
                    { category: 'weapons', name: 'Dragon Sword' },
                    { category: 'materials', name: 'Dragon Scale' }
                ]
            }
        };
    }
}

module.exports = { RPGSystem };