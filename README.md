# DB CLI

> A command-line interface tool for managing PostgreSQL databases with a focus on simplicity, security, and user experience.
> Features interactive prompts, beautiful terminal output, and secure credential storage.

A JavaScript CLI tool that helps you configure database connections and create new databases with ease.

## Features

- 🔧 Interactive configuration system
- 🗄️ PostgreSQL database management
- 🎨 Beautiful terminal output with colors and boxes
- 🔐 Secure password storage using system keychain
- 💾 Connection string generation

## Prerequisites

- PostgreSQL server installed and running
- Node.js 16.x or higher
- npm or yarn package manager
- sudo access (for global installation)
- System keychain requirements:
  - Linux: `libsecret` and `gnome-keyring`
  - macOS: Keychain Access
  - Windows: Credential Manager

## Installation

You can install the CLI tool in two ways:

### 1. Via npm (Recommended)

```bash
npm install -g https://github.com/paulgeorge35/db-cli
```

### 2. From Source

```bash
# Clone the repository
git clone https://github.com/paulgeorge35/db-cli
cd db-cli

# Install dependencies
npm install

# Link the package globally
npm link
```

## Usage

### Configure Database Connection

```bash
db-cli config
```

This interactive command will help you set up your database connection:

```bash
? Enter database host: localhost
? Enter port: (5432)
? Enter username: (root)
? Enter password: [hidden]
```

### Create New Database

```bash
db-cli add db
```

Example output:
```bash
? Enter database name: myapp_development
✔ Database created successfully!
Connection string: postgresql://root:****@localhost:5432/myapp_development
```

### View Configuration

View your current database configuration:

```bash
# Hide password (default)
db-cli view

# Show password
db-cli view --show-password
```

### Reset Configuration

Remove all saved configuration:

```bash
db-cli reset
```

### Help

Get help on available commands:

```bash
db-cli --help
```

## Configuration Storage

The tool uses two secure storage mechanisms:

1. Non-sensitive configuration (host, port, username) is stored using the `conf` package in:
   - macOS: `~/Library/Preferences/db-cli-nodejs`
   - Windows: `%APPDATA%/db-cli-nodejs/Config`
   - Linux: `~/.config/db-cli-nodejs`

2. Passwords are securely stored in the system's native keychain:
   - macOS: Keychain Access
   - Windows: Credential Manager
   - Linux: Secret Service API (GNOME Keyring/KWallet)

## Dependencies

Core dependencies:
- `boxen` (^8.0.1): Create boxes in terminal
- `chalk` (^5.4.1): Terminal string styling
- `yargs` (^17.7.2): Command-line argument parsing
- `inquirer` (^9.2.15): Interactive command prompts
- `pg` (^8.11.3): PostgreSQL client
- `conf` (^12.0.0): Configuration storage


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Paul George - contact@paulgeorge.dev

Project Link: [https://github.com/paulgeorge35/db-cli](https://github.com/paulgeorge35/db-cli)
