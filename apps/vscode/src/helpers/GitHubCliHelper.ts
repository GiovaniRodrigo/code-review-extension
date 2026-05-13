import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync =
    promisify(execFile);

export class GitHubCliHelper {

    static async isInstalled(): Promise<boolean> {

        try {

            await execFileAsync(
                'gh',
                ['--version']
            );

            return true;

        } catch {

            return false;
        }
    }

    static async isAuthenticated(): Promise<boolean> {

        try {

            await execFileAsync(
                'gh',
                ['auth', 'status']
            );

            return true;

        } catch {

            return false;
        }
    }
}