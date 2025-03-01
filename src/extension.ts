import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Tableify JSON extension is now active!');

    // Register the custom sidebar view provider
    const provider = new JsonTableViewProvider(context.extensionUri);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('tableify-json-view', provider)
    );
}

class JsonTableViewProvider implements vscode.WebviewViewProvider {
    constructor(private readonly _extensionUri: vscode.Uri) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'convertJsonToTable':
                        try {
                            const jsonObject = JSON.parse(message.jsonContent);
                            webviewView.webview.postMessage({ command: 'showTable', jsonObject });
                        } catch (error) {
                            vscode.window.showErrorMessage('Invalid JSON format.');
                        }
                        break;
                }
            }
        );
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Tableify JSON</title>
                <style>
                    body {
                        font-family: var(--vscode-font-family);
                        padding: 10px;
                        color: var(--vscode-editor-foreground);
                        background-color: var(--vscode-editor-background);
                    }
                    textarea {
                        width: 100%;
                        height: 150px;
                        padding: 8px;
                        font-family: var(--vscode-editor-font-family);
                        font-size: var(--vscode-editor-font-size);
                        background-color: var(--vscode-input-background);
                        color: var(--vscode-input-foreground);
                        border: 1px solid var(--vscode-input-border);
                        margin-bottom: 10px;
                    }
                    button {
                        padding: 8px 12px;
                        background-color: var(--vscode-button-background);
                        color: var(--vscode-button-foreground);
                        border: none;
                        cursor: pointer;
                        width: 100%;
                    }
                    button:hover {
                        background-color: var(--vscode-button-hoverBackground);
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                    }
                    th, td {
                        padding: 6px;
                        text-align: left;
                        border: 1px solid var(--vscode-panel-border);
                        font-size: var(--vscode-editor-font-size);
                    }
                    th {
                        background-color: var(--vscode-editor-lineHighlightBackground);
                    }
                    .nested-table {
                        margin: 0;
                        padding: 0;
                        border: none;
                    }
                </style>
            </head>
            <body>
                <textarea id="jsonInput" placeholder="Paste your JSON here..."></textarea>
                <button onclick="convertJson()">Convert to Table</button>
                <div id="tableContainer"></div>

                <script>
                    const vscode = acquireVsCodeApi();

                    function convertJson() {
                        const jsonContent = document.getElementById('jsonInput').value;
                        if (jsonContent) {
                            vscode.postMessage({
                                command: 'convertJsonToTable',
                                jsonContent: jsonContent
                            });
                        }
                    }

                    window.addEventListener('message', event => {
                        const message = event.data;
                        if (message.command === 'showTable') {
                            const tableContainer = document.getElementById('tableContainer');
                            tableContainer.innerHTML = generateTable(message.jsonObject);
                        }
                    });

                    function generateTable(jsonObject) {
                        if (Array.isArray(jsonObject)) {
                            return generateArrayTable(jsonObject);
                        } else if (typeof jsonObject === 'object' && jsonObject !== null) {
                            return generateObjectTable(jsonObject);
                        } else {
                            // Handle primitive values (string, number, boolean, null)
                            return \`<p>\${jsonObject}</p>\`;
                        }
                    }

                    function generateObjectTable(jsonObject) {
                        const keys = Object.keys(jsonObject);
                        if (keys.length === 0) return '<p>Empty object</p>';

                        let tableHtml = '<table><thead><tr><th>Key</th><th>Value</th></tr></thead><tbody>';
                        keys.forEach(key => {
                            let value = jsonObject[key];
                            if (typeof value === 'object' && value !== null) {
                                value = generateTable(value); // Recursively handle nested objects or arrays
                                tableHtml += \`<tr><td>\${key}</td><td class="nested-table">\${value}</td></tr>\`;
                            } else {
                                tableHtml += \`<tr><td>\${key}</td><td>\${value}</td></tr>\`;
                            }
                        });
                        tableHtml += '</tbody></table>';
                        return tableHtml;
                    }

                    function generateArrayTable(jsonArray) {
                        if (jsonArray.length === 0) return '<p>Empty array</p>';

                        // Check if the array contains objects
                        if (typeof jsonArray[0] === 'object' && jsonArray[0] !== null && !Array.isArray(jsonArray[0])) {
                            const keys = Object.keys(jsonArray[0]);
                            let tableHtml = '<table><thead><tr>';
                            keys.forEach(key => {
                                tableHtml += \`<th>\${key}</th>\`;
                            });
                            tableHtml += '</tr></thead><tbody>';

                            jsonArray.forEach(item => {
                                tableHtml += '<tr>';
                                keys.forEach(key => {
                                    let value = item[key];
                                    if (typeof value === 'object' && value !== null) {
                                        value = generateTable(value); // Recursively handle nested objects or arrays
                                        tableHtml += \`<td class="nested-table">\${value}</td>\`;
                                    } else {
                                        tableHtml += \`<td>\${value}</td>\`;
                                    }
                                });
                                tableHtml += '</tr>';
                            });
                            tableHtml += '</tbody></table>';
                            return tableHtml;
                        } else {
                            // Handle arrays of primitives or arrays of arrays
                            let tableHtml = '<table><tbody>';
                            jsonArray.forEach(item => {
                                tableHtml += '<tr><td>';
                                if (typeof item === 'object' && item !== null) {
                                    tableHtml += generateTable(item); // Recursively handle nested arrays or objects
                                } else {
                                    tableHtml += item; // Handle primitive values
                                }
                                tableHtml += '</td></tr>';
                            });
                            tableHtml += '</tbody></table>';
                            return tableHtml;
                        }
                    }
                </script>
            </body>
            </html>
        `;
    }
}

export function deactivate() {}