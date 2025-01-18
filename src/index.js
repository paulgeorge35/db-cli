#!/usr/bin/env node
import boxen from 'boxen';
import chalk from 'chalk';
import Conf from 'conf';
import inquirer from 'inquirer';
import pg from 'pg';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const { Client } = pg;

const config = new Conf({
    projectName: 'db-cli',
    schema: {
        host: {
            type: 'string'
        },
        port: {
            type: 'number',
            default: 5432
        },
        user: {
            type: 'string',
            default: 'root'
        },
        password: {
            type: 'string'
        }
    }
});

function getConnectionString(dbName = 'postgres', showPassword = false) {
    const dbConfig = config.store;
    const password = showPassword ? dbConfig.password : '********';
    return `postgresql://${dbConfig.user}:${password}@${dbConfig.host}:${dbConfig.port}/${dbName}`;
}

async function viewConfig(showPassword) {
    if (!config.has('host') || !config.has('password')) {
        console.log(boxen(
            chalk.red('No configuration found. Use "db-cli config" to set up the database connection.'),
            { padding: 1, borderColor: 'red', title: 'Error' }
        ));
        return;
    }

    const connectionString = getConnectionString('postgres', showPassword);

    console.log(boxen(
        chalk.blue('Current Configuration:\n\n') +
        chalk.yellow(connectionString) +
        (showPassword ? '' : '\n\n' + chalk.gray('Use -p flag to show password')),
        { padding: 1, borderColor: 'blue', title: 'Connection Info' }
    ));
}

async function testConnection(config) {
    try {
        const client = new Client({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: 'postgres'
        });

        await client.connect();
        await client.end();
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

async function configureDatabase() {
    // Check if configuration exists
    const hasExistingConfig = config.has('host') && config.has('password');

    if (hasExistingConfig) {
        const { shouldOverwrite } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'shouldOverwrite',
                message: 'Existing configuration found. Do you want to overwrite it?',
                default: false
            }
        ]);

        if (!shouldOverwrite) {
            console.log(boxen(
                chalk.yellow('Configuration unchanged'),
                { padding: 1, borderColor: 'yellow', title: 'Info' }
            ));
            return;
        }
    }

    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'host',
            message: 'Enter database host:',
            validate: (input) => input.length > 0 || 'Host is required'
        },
        {
            type: 'number',
            name: 'port',
            message: 'Enter database port:',
            default: 5432
        },
        {
            type: 'input',
            name: 'user',
            message: 'Enter database user:',
            default: 'root'
        },
        {
            type: 'password',
            name: 'password',
            message: 'Enter database password:',
            mask: '*'
        }
    ]);

    console.log(boxen(
        chalk.blue('Testing connection...'),
        { padding: 1, borderColor: 'blue', title: 'Info' }
    ));

    const testResult = await testConnection(answers);

    if (!testResult.success) {
        console.log(boxen(
            chalk.red(`Connection failed: ${testResult.error}\n\n`) +
            chalk.yellow('Configuration was not saved. Please try again with correct credentials.'),
            { padding: 1, borderColor: 'red', title: 'Error' }
        ));
        return;
    }

    // Clear existing config before setting new one
    if (hasExistingConfig) {
        config.clear();
    }

    config.set(answers);

    console.log(boxen(
        chalk.green('Connection successful!\n\n') +
        chalk.green('Configuration saved successfully!'),
        { padding: 1, borderColor: 'green', title: 'Success' }
    ));
}

async function addDatabase() {
    if (!config.has('host') || !config.has('password')) {
        console.log(boxen(
            chalk.red('Please configure the database connection first using "db-cli config"'),
            { padding: 1, borderColor: 'red', title: 'Error' }
        ));
        return;
    }

    const { dbName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'dbName',
            message: 'Enter the database name:',
            validate: (input) => input.length > 0 || 'Database name is required'
        }
    ]);

    const dbConfig = config.store;

    try {
        // Connect to postgres database to create new database
        const client = new Client({
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password,
            database: 'postgres'
        });

        await client.connect();
        await client.query(`CREATE DATABASE ${dbName}`);
        await client.end();

        console.log(boxen(
            chalk.green('Database created successfully!\n\n') +
            chalk.blue('Connection string:\n') +
            chalk.yellow(getConnectionString(dbName, true)),
            { padding: 1, borderColor: 'green', title: 'Success' }
        ));
    } catch (error) {
        console.log(boxen(
            chalk.red(`Failed to create database: ${error.message}`),
            { padding: 1, borderColor: 'red', title: 'Error' }
        ));
    }
}

async function resetConfig() {
    if (!config.has('host') && !config.has('password')) {
        console.log(boxen(
            chalk.yellow('No configuration found to reset'),
            { padding: 1, borderColor: 'yellow', title: 'Info' }
        ));
        return;
    }

    const { confirmReset } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmReset',
            message: 'Are you sure you want to remove all saved configuration?',
            default: false
        }
    ]);

    if (!confirmReset) {
        console.log(boxen(
            chalk.yellow('Reset cancelled'),
            { padding: 1, borderColor: 'yellow', title: 'Info' }
        ));
        return;
    }

    config.clear();
    console.log(boxen(
        chalk.green('Configuration successfully removed'),
        { padding: 1, borderColor: 'green', title: 'Success' }
    ));
}

void yargs(hideBin(process.argv))
    .scriptName('db-cli')
    .command('config', 'Configure database connection', {}, configureDatabase)
    .command('view', 'View database connection', {
        p: {
            alias: 'show-password',
            type: 'boolean',
            description: 'Show password in clear text',
            default: false
        }
    }, (argv) => viewConfig(argv.p))
    .command('add db', 'Add a new database', {}, addDatabase)
    .command('reset', 'Remove all saved configuration', {}, resetConfig)
    .demandCommand(1, 'You need to specify a command')
    .strict()
    .help()
    .argv; 