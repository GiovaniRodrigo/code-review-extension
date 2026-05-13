import * as vscode from 'vscode';
import * as fs from 'node:fs';
import * as path from 'node:path';

export function getWebviewContent(
    extensionUri: vscode.Uri,
    webview: vscode.Webview
): string {

    const webviewPath = path.join(
        extensionUri.fsPath,
        'src',
        'views',
        'webview'
    );

    const htmlPath = path.join(
        webviewPath,
        'reviewView.html'
    );

    const cssUri =
        webview.asWebviewUri(
            vscode.Uri.file(
                path.join(
                    webviewPath,
                    'reviewView.css'
                )
            )
        );

    const jsUri =
        webview.asWebviewUri(
            vscode.Uri.file(
                path.join(
                    webviewPath,
                    'reviewView.js'
                )
            )
        );

    return fs
        .readFileSync(
            htmlPath,
            'utf8'
        )
        .replaceAll(
            '{{styleUri}}',
            cssUri.toString()
        )
        .replaceAll(
            '{{scriptUri}}',
            jsUri.toString()
        )
        .replaceAll(
            '{{cspSource}}',
            webview.cspSource
        );
}