import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

import { CodeChunk } from './CodeChunk';

export class ChunkCodeService {

    private readonly maxCharactersPerChunk = 800;

    private readonly maxCharactersPerLine = 400;

    private readonly maxFileSizeBytes = 1024 * 200;

    private readonly ignoredFolders = [
        'node_modules',
        '.git',
        'dist',
        'build',
        'coverage',
        '.next',
        '.turbo',
        '.idea',
        '.vscode'
    ];

    private readonly ignoredFilePatterns = [
        '.lock',
        '.log',
        '.min.js',
        'package-lock.json',
        'pnpm-lock.yaml',
        'yarn.lock'
    ];

    private readonly allowedExtensions = [
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.json',
        '.md'
    ];

    async chunkRepository(
        workspacePath: string
    ): Promise<CodeChunk[]> {

        const files =
            this.getFiles(workspacePath);

        const chunks: CodeChunk[] = [];

        for (const file of files) {

            try {

                const stat =
                    fs.statSync(file);

                if (
                    stat.size > this.maxFileSizeBytes
                ) {
                    continue;
                }

                const content =
                    fs.readFileSync(
                        file,
                        'utf8'
                    );

                const lines =
                    content.split('\n');

                let currentChunk = '';
                let startLine = 1;

                for (
                    let lineIndex = 0;
                    lineIndex < lines.length;
                    lineIndex++
                ) {

                    const sanitizedLine =
                        lines[lineIndex]
                            .slice(
                                0,
                                this.maxCharactersPerLine
                            );

                    if (
                        currentChunk.length + sanitizedLine.length
                        > this.maxCharactersPerChunk
                    ) {

                        if (currentChunk.trim()) {

                            chunks.push({
                                id: randomUUID(),
                                file,
                                content: currentChunk,
                                language: path.extname(file),
                                startLine,
                                endLine: lineIndex
                            });
                        }

                        currentChunk = '';
                        startLine = lineIndex + 1;
                    }

                    currentChunk +=
                        `${sanitizedLine}\n`;
                }

                if (currentChunk.trim()) {

                    chunks.push({
                        id: randomUUID(),
                        file,
                        content: currentChunk,
                        language: path.extname(file),
                        startLine,
                        endLine: lines.length
                    });
                }

            } catch (error) {

                console.error(
                    '[RAG] Failed to chunk file:',
                    file,
                    error
                );
            }
        }

        return chunks;
    }

    private getFiles(
        dir: string
    ): string[] {

        const files: string[] = [];

        if (!fs.existsSync(dir)) {
            return files;
        }

        let entries: string[] = [];

        try {
            entries = fs.readdirSync(dir);
        } catch {
            return files;
        }

        for (const entry of entries) {

            const fullPath =
                path.join(dir, entry);

            try {

                const stat =
                    fs.lstatSync(fullPath);

                if (stat.isSymbolicLink()) {
                    continue;
                }

                if (stat.isDirectory()) {

                    if (
                        this.ignoredFolders.includes(entry)
                    ) {
                        continue;
                    }

                    files.push(
                        ...this.getFiles(fullPath)
                    );

                    continue;
                }

                if (
                    this.ignoredFilePatterns.some(
                        pattern =>
                            fullPath.includes(pattern)
                    )
                ) {
                    continue;
                }

                const ext =
                    path.extname(fullPath);

                if (
                    !this.allowedExtensions.includes(ext)
                ) {
                    continue;
                }

                files.push(fullPath);

            } catch (error) {

                console.error(
                    '[RAG] Failed to process path:',
                    fullPath,
                    error
                );
            }
        }

        return files;
    }
}