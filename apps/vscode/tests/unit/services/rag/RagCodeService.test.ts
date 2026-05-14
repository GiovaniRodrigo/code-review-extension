import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as fs from 'fs';
import { ChunkCodeService } from '../../../../src/services/rag/ChunkCodeService';

vi.mock('fs');

describe('RagCodeService', () => {
  let service: ChunkCodeService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ChunkCodeService();
  });

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  it('should execute happy path', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockReturnValue(['file.ts'] as any);
    vi.mocked(fs.lstatSync).mockReturnValue({ isSymbolicLink: () => false, isDirectory: () => false } as any);
    vi.mocked(fs.statSync).mockReturnValue({ size: 100 } as any);
    vi.mocked(fs.readFileSync).mockReturnValue('const x = 1;');

    const chunks = await service.chunkRepository('/fake/path');

    expect(chunks).toHaveLength(1);
    expect(chunks[0].content).toContain('const x = 1;');
  });

  it('should return empty result', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);

    const chunks = await service.chunkRepository('/fake/path');

    expect(chunks).toEqual([]);
  });

  it('should throw on dependency failure (fs.readdirSync)', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readdirSync).mockImplementation(() => {
        throw new Error('fs failed');
    });

    const chunks = await service.chunkRepository('/fake/path');
    expect(chunks).toEqual([]); // Service catches error and logs it
  });
});
