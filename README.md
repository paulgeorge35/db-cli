# DB CLI

> A command-line interface tool for managing PostgreSQL databases with a focus on simplicity and user experience.
> Features interactive prompts and beautiful terminal output using chalk and boxen.

A Bun-based CLI tool that helps you configure database connections and create new databases with ease.

## Features

- 🔧 Interactive configuration system
- 🗄️ PostgreSQL database management
- 🎨 Beautiful terminal output with colors and boxes
- 🔐 Secure configuration storage
- 💾 Connection string generation

## Prerequisites

- PostgreSQL server
- sudo access (for global installation)
- unzip (for bun installation)

## Installation

1. Install Bun runtime:
```bash
# Install unzip if not already installed
sudo apt-get update && sudo apt-get install -y unzip

# Install bun
curl -fsSL https://bun.sh/install | bash

# Add bun to PATH (you might want to add this to your .bashrc)
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
```

2. Clone and install the CLI:
```bash
# Clone the repository
git clone https://github.com/paulgeorge35/db-cli
cd db-cli

# Install dependencies
bun install

# Build and install globally
bun run install:global
```
This will:
- Build the project using TypeScript and Bun
- Create a global symlink using `bun link`
- Make the CLI globally accessible as `db-cli`

## Usage

### Configure Database Connection

```bash
db-cli config
```

This command manages your database connection settings:

1. If an existing configuration is found:
   - You'll be asked if you want to overwrite it
   - Selecting 'No' will keep the existing configuration
   - Selecting 'Yes' will proceed with new configuration

2. You'll be prompted for:
   - Database host (required)
   - Port (default: 5432)
   - Username (default: root)
   - Password (hidden input)

3. After entering all values:
   - The tool will attempt to connect to the database
   - If connection fails:
     - An error message will be displayed
     - The configuration will not be saved
     - You'll need to run the command again with correct credentials
   - If connection succeeds:
     - Any existing configuration will be removed
     - The new configuration will be saved
     - A success message will be displayed

### Create New Database

```bash
db-cli add db
```

This will:
- Check for existing configuration
- Prompt for database name
- Create the database
- Display the connection string

### View Configuration

```bash
# View with hidden password
db-cli view

# View with visible password
db-cli view -p
```

This command displays the current configuration:
- Shows the connection string with password hidden by default
- Use the `-p` or `--show-password` flag to reveal the password
- Displays an error if no configuration exists

### Reset Configuration

```bash
db-cli reset
```

This command removes all saved configuration:

1. If no configuration exists:
   - Shows an info message and exits

2. If configuration exists:
   - Asks for confirmation with default 'No'
   - Selecting 'No' cancels the operation
   - Selecting 'Yes' removes all saved configuration
   - Shows a success message when complete

### Help

```bash
db-cli --help
```

## Configuration Storage

The tool securely stores your database configuration using the `conf` package, which saves the data in:
- macOS: ~/Library/Preferences/db-cli-nodejs
- Windows: %APPDATA%/db-cli-nodejs/Config
- Linux: ~/.config/db-cli-nodejs

## Development

To run in development mode:
```bash
bun run dev
```

For type checking:
```bash
bun run type-check
```

## Dependencies

- yargs: Command-line argument parsing
- inquirer: Interactive command prompts
- chalk: Terminal string styling
- boxen: Create boxes in terminal
- pg: PostgreSQL client
- conf: Configuration storage

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Contact

Paul George - contact@paulgeorge.dev

Project Link: https://github.com/paulgeorge35/db-cli
