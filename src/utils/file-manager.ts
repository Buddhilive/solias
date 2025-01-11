import { OpenDialogReturnValue, SaveDialogReturnValue, dialog } from "electron";
import * as fs from 'fs';
import { SoliasNotifications } from "./notifications";

export class SoliasFileManager {

    notification = new SoliasNotifications();

    /**
     * Opens a file dialog and returns the selected file path.
     * The file dialog is set to open HTML and JSON files.
     * @returns The selected file path or an empty object if the user cancelled the dialog.
     */
    async openFile(): Promise<OpenDialogReturnValue> {
        const result = await dialog.showOpenDialog({
            filters: [{
                name: 'HTML Files',
                extensions: ['html', 'json']
            }],
            properties: ['openFile'],
        });
        return result;
    }

    /**
     * Opens a save file dialog and returns the selected file path.
     * The file dialog is set to save files of a specific type.
     * @param content The content of the file to be saved.
     * @param fileType The type of the file to be saved (e.g. 'html', 'json').
     * @returns The selected file path or an empty object if the user cancelled the dialog.
     */
    async saveFile(content: string, fileType: string): Promise<SaveDialogReturnValue> {
        const result = await dialog.showSaveDialog({
            filters: [{
                name: 'Solias Files',
                extensions: [fileType]
            }],
            properties: ['createDirectory']
        });

        if (!result.canceled) {
            await this.writeFile(result.filePath, content);
        }

        return result;
    }

    /**
     * Writes the given content to the given file path.
     * Shows a notification on success or failure.
     * @param filePath The path of the file to write to.
     * @param content The content to write to the file.
     * @throws {Error} If the file could not be written.
     */
    async writeFile(filePath: string, content: string): Promise<void> {
        try {
            await fs.writeFileSync(filePath, content);
            this.notification.show({
                title: 'File saved!',
                body: `File saved to ${filePath}`
            });
        } catch (err) {
            this.notification.show({
                title: `File saving error ${filePath}:`,
                body: err
            });
        }
    }
}