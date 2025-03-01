# Tableify JSON - Quick Start Guide

Welcome to **Tableify JSON**, a Visual Studio Code extension that helps you visualize JSON data in a tabular format. Follow these steps to get started quickly.

---

## 1. Install the Extension

1. Open **Visual Studio Code**.
2. Go to the **Extensions** view by clicking on the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
3. Search for **Tableify JSON**.
4. Click **Install** to install the extension.

---

## 2. Open the Tableify JSON View

1. Open the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. Type **Tableify JSON: Open View** and select it to open the extension's sidebar.

---

## 3. Paste Your JSON Data

1. In the sidebar, you will see a text area labeled **Paste your JSON here...**.
2. Paste your JSON data into the text area.

---

## 4. Convert JSON to Table

1. Click the **Convert to Table** button below the text area.
2. The JSON data will be displayed in a structured table format.

---

## 5. Explore Nested Data

- If your JSON contains nested objects or arrays, they will be displayed as `[Object]` or `[Array]`.
- Click on `[Object]` or `[Array]` to expand and view the nested data.

---

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