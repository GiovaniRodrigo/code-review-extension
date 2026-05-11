export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  contributes: Array<'ai' | 'analyzer' | 'workflow' | 'diagnostic'>;
}

export interface ReviewPlugin {
  manifest: PluginManifest;
  activate(): Promise<void>;
  deactivate?(): Promise<void>;
}
