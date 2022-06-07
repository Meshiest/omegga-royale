# royale

An incomplete battle royale plugin

## Install

`omegga install gh:Meshiest/royale`

## Usage

- Click on a chest to open it.
- Read the information in `chest config.brs` to understand how map config works.

### Chest Testing

1. Load `acm map test.brs` (or `chest config.brs` to see demo map setup)
2. `/brconfig` (parse the save)
3. `/parsemap` to parse chests from the map
4. `/spawns` to load in new spawns for the map
5. `/testspawn` to test chest spawns for bricks you have selected

### Ring testing

1. Load `acm map test.brs`
2. `/brconfig` (parse the save)
3. `/testring` to test rings and `/clearring` to clear them

### Helper commands

- `/recomponent foo` - replace `ConsoleTag=foo` on every selected brick with an interact component (does not add new interact components)
- `/addcomponent foo` - adds `ConsoleTag=foo` to every selected brick without an interact component (does not replace existing interacts)
- `/replacecomponent foo bar` - replaces `ConsoleTag=afoob` with `ConsoleTag=abarb` on every selected brick
- `/rescale 1.5` - replaces resizes the item components on every selected brick
- `/fixpickup` - makes all elected bricks with item components have: pickup=true, disablePickup=true, respawnOnReset=false, respawnTime=0, resetDelay=0
