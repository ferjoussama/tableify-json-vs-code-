# Tableify JSON - VS Code Extension

**Tableify JSON** is a Visual Studio Code extension that allows you to visualize JSON data in a tabular format directly within the editor. This extension is particularly useful for developers who work with JSON data and want a quick way to view and analyze it in a structured table format.

## Features

- **Convert JSON to Table**: Paste your JSON data into the extension's sidebar, and it will automatically convert it into a readable table.
- **Nested JSON Support**: Handles nested JSON objects and arrays, displaying them in a hierarchical table structure.
- **VS Code Integration**: Seamlessly integrates with VS Code's UI, using the same theme and styling for consistency.

## Installation

1. Open **Visual Studio Code**.
2. Go to the **Extensions** view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
3. Search for **Tableify JSON**.
4. Click **Install** to install the extension.
5. After installation, the extension will be ready to use.

## Usage

1. Open the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. Type **Tableify JSON: Open View** and select it to open the extension's sidebar.
3. In the sidebar, paste your JSON data into the provided text area.
4. Click the **Convert to Table** button to visualize the JSON data in a table format.

## Example

### Input JSON
```json
{
    "name": "John Doe",
    "age": 30,
    "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA"
    },
    "hobbies": ["Reading", "Hiking", "Coding"]
}