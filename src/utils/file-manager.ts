import { OpenDialogReturnValue, SaveDialogReturnValue, dialog } from "electron";
import * as fs from 'fs';
import { SoliasNotifications } from "./notifications";

export class SoliasFileManager {

    notification = new SoliasNotifications();

    // Open File Dialog
    async openFile(): Promise<OpenDialogReturnValue> {
        const result = await dialog.showOpenDialog({
            filters: [{
                name: 'HTML Files',
                extensions: ['html', 'json']
            }],
            properties: ['openFile']
        });
        return result;
    }

    // Save file
    async saveFile(content: string, fileType: string): Promise<SaveDialogReturnValue> {
        const result = await dialog.showSaveDialog({
            filters: [{
                name: 'Solias Files',
                extensions: [fileType]
            }],
            properties: ['createDirectory']
        });

        if (!result.canceled) {
            try {
                fs.writeFileSync(result.filePath, content);
                this.notification.show({ title: 'File saved!', body: `File saved to ${result.filePath}` });
            } catch (err) {
                this.notification.show({ title: 'File saving error' ,body: err });
            }
        }

        return result;
    }
}