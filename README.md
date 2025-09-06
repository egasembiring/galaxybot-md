# galaxy bot WhatsApp yang merupakan Neo Flare WhatsApp Bot - Project Setup

## Overview
This is a WhatsApp bot project called "Neo Flare v4.0" developed by Zass Desuta. The bot is built using Node.js and uses the Baileys library for WhatsApp connectivity.

## Project Architecture
- **Main Entry Point**: `all/system/index.js`
- **Core Bot Logic**: `all/system/main.js`
- **Command Handler**: `all/system/neo-z.js`
- **Premium System**: `all/library/premiun.js`
- **Auto-Delete Library**: `all/library/autodelete.js`
- **Settings**: `settings.js`
- **Database**: JSON files in the `database/` directory
- **Libraries**: Custom functions in `all/library/`

## Current Setup (Replit Environment)
- **Node.js Version**: 20.19.3
- **Dependencies**: All npm packages installed successfully
- **Workflow**: Configured as "WhatsApp Bot" running `npm start`
- **Status**: Bot is running with auto-delete processor initialized

## Recent Changes
- September 6, 2025: Enhanced with premium auto-delete chat system
- Added auto-delete functionality exclusive to premium users and owners
- Implemented message tracking and automatic deletion from sender's side
- Added premium user verification with expiration checking
- Created comprehensive auto-delete configuration system
- Added premium analytics, backup, and quick message features

## Key Features
### Core Bot Features:
- Control commands (owner, self, public modes)
- AI integration (GPT, Gemini, Lumina AI)
- Media downloading (YouTube, TikTok, Instagram)
- Panel management for hosting services
- Group management features
- Sticker creation and manipulation
- Broadcasting capabilities
- Store/payment integration

### Premium Auto-Delete System:
- **Commands**: `.autodelete`, `.autodelconfig`, `.autodel-status`, `.autodel-clear`
- **Exclusive Access**: Premium users and bot owners only
- **Customizable Timing**: 5s, 10s, 30s, 1m, 5m, 10m, 30m, 1h, 24h
- **Message Types**: Text, image, video, audio, document, sticker support
- **Smart Configuration**: Separate settings for groups and private chats
- **Automatic Tracking**: Messages automatically tracked and deleted from sender's side

### Additional Premium Features:
- **Analytics Dashboard**: `.analytics` - User statistics and auto-delete metrics
- **Data Backup**: `.backup` - Export user configuration and data
- **Quick Messages**: `.quickmsg` - Save and send frequently used messages

### 🎮 RPG & Gaming System:
#### RPG Features:
- **Character System**: Level progression, XP, HP/MP, stats (strength, defense, agility, intelligence, luck)
- **Battle System**: Combat with various enemies (Goblin, Orc, Skeleton, Dragon)
- **Inventory Management**: Weapons, armor, potions, materials with equipment system
- **Economy System**: Gold currency, jobs, daily rewards, work system
- **Adventure Mode**: Random encounters with cooldown system
- **Dungeon System**: Multi-battle challenges for level 5+ players
- **Shop System**: Buy weapons, armor, and potions
- **Leaderboards**: Top players by level and money

#### Mini Games:
- **Suit Game**: Rock-paper-scissors with stats tracking
- **Casino Slot**: Betting system with various multipliers and jackpots
- **Tebak Kata**: Word guessing game with hints
- **Math Quiz**: Mathematical challenges with time limits
- **Trivia Quiz**: General knowledge questions
- **Daily Challenges**: Special objectives for extra rewards

#### Game Commands:
- `.rpg` / `.profile` - View character profile and stats
- `.adventure` - Go on adventures and fight enemies
- `.inventory` / `.inv` - View items and equipment
- `.work` / `.kerja` - Work to earn money (1 hour cooldown)
- `.daily` - Claim daily rewards (24 hour cooldown)
- `.suit <choice>` - Play rock-paper-scissors
- `.casino <bet>` - Play slot machine
- `.tebakkata` - Start word guessing game
- `.mathquiz` - Start math quiz
- `.trivia` - Start trivia quiz
- `.shop` - View and buy items
- `.heal` - Use health potions
- `.equip <item>` - Equip weapons/armor
- `.dungeon` - Enter dungeon (level 5+ required)
- `.leaderboard` / `.lb` - View top players
- `.gamestats` - View personal game statistics

## Premium System
- Users can purchase premium access through bot owner
- Premium status includes expiration dates
- Auto-delete features exclusive to premium users
- Enhanced analytics and productivity tools

## Current State
The bot is successfully running with all premium features implemented. Auto-delete processor is initialized and ready for use. The system automatically tracks messages from premium users and deletes them according to their configured settings.

## User Preferences
Auto-delete system designed for premium users who want enhanced privacy and message management capabilities.
