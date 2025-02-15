import grapesjs, { Editor } from "grapesjs";
import { SOLIAS_BLOCKS } from "../shared/constants/blocks";
import { SOLIAS_STYLE_SELECTORS } from "../shared/constants/style-selectors";
import {
  OpenDialogReturnValue,
  SaveDialogReturnValue,
  ipcRenderer,
} from "electron";
import * as fs from "fs";
import { soliasDataValidations } from "../utils/validator";
import { BASE_HTML_TEMPLATE } from "../shared/constants/base-html";
import { ISoliasFileData } from "../shared/interfaces/file-data.interface";

export class SoliasGrapesJS {
  public editor: Editor;
  private savedFilePath: string;
  private savedProjectPath: string;

  init(): void {
    /* Initialize GrapeJS Editor */
    this.editor = grapesjs.init({
      // Indicate where to init the editor. You can also pass an HTMLElement
      container: "#gjs",
      // Get the content for the canvas directly from the element
      // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
      fromElement: true,
      // Size of the editor
      height: "auto",
      width: "auto",
      // Disable the storage manager for the moment
      storageManager: false,
      // Layers manager
      layerManager: {
        appendTo: "#layers-palette",
      },
      // Avoid any default panel
      panels: {
        defaults: [
          {
            id: "layers",
            el: "#right-panel",
            // Make the panel resizable
            resizable: {
              maxDim: 350,
              minDim: 200,
              tc: false, // Top handler
              cl: true, // Left handler
              cr: false, // Right handler
              bc: false, // Bottom handler
              // Being a flex child we need to change `flex-basis` property
              // instead of the `width` (default)
              keyWidth: "flex-basis",
            },
          },
        ],
      },
      // Block Manager
      blockManager: {
        appendTo: "#blocks-palette",
        blocks: SOLIAS_BLOCKS,
      },
      // The Selector Manager allows to assign classes and
      // different states (eg. :hover) on components.
      // Generally, it's used in conjunction with Style Manager
      // but it's not mandatory
      selectorManager: {
        appendTo: "#style-palette",
      },
      styleManager: {
        appendTo: "#style-palette",
        sectors: SOLIAS_STYLE_SELECTORS,
      },
      // Triats Manager
      traitManager: {
        appendTo: "#traits-palette",
      },
      // Device manager
      deviceManager: {
        devices: [
          {
            name: "Desktop",
            width: "", // default size
          },
          {
            name: "Mobile",
            width: "320px", // this value will be used on canvas width
            widthMedia: "480px", // this value will be used in CSS @media
          },
        ],
      },
      // Canvas settings
      canvas: {
        styles: [
          "https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap",
          "../assets/css/grapesjs-designer.css",
        ],
      },
      // color picker
      colorPicker: {
        preferredFormat: "hex",
        appendTo: "parent"
      },
    });

    /* Load Panels */
    // Top panel
    this.editor.Panels.addPanel({
      id: "panel-top",
      el: "#tool-bar",
    });
    // Actions panel
    this.editor.Panels.addPanel({
      id: "basic-actions",
      el: "#tool-actions",
      buttons: [
        {
          id: "visibility",
          active: true, // active by default
          className: "material-icons",
          label: "border_style",
          command: "sw-visibility", // Built-in command
        },
        {
          id: "export",
          className: "material-icons",
          label: "code",
          command: "export-template",
          context: "export-template", // For grouping context of buttons from the same panel
        },
        {
          id: "show-json",
          className: "material-icons",
          label: "data_object",
          context: "show-json",
          command: (() => {
            this.editor.Modal.setTitle("Components JSON")
              .setContent(
                `<textarea style="width:100%; height: 250px;">
                      ${JSON.stringify(this.editor.getComponents())}
                    </textarea>`
              )
              .open();
          }).bind(this),
        },
        {
          id: "clear",
          className: "material-icons",
          label: "backspace",
          command: "clear-html",
        },
        {
          id: "preview",
          className: "material-icons",
          label: "preview",
          command: "preview-window",
        },
      ],
    });
    // Switch device viewport
    this.editor.Panels.addPanel({
      id: "panel-devices",
      el: "#panel-devices",
      buttons: [
        {
          id: "device-desktop",
          command: "set-device-desktop",
          className: "material-icons",
          label: "desktop_windows",
          active: true,
          togglable: false,
        },
        {
          id: "device-mobile",
          className: "material-icons",
          label: "phone_android",
          command: "set-device-mobile",
          togglable: false,
        },
      ],
    });
    // Panel switcher
    this.editor.Panels.addPanel({
      id: "panel-switcher",
      el: "#panel-switcher",
      buttons: [
        {
          id: "show-blocks",
          active: true,
          command: "show-blocks",
          className: "material-icons",
          label: "interests",
          togglable: false,
        },
        {
          id: "show-layers",
          active: true,
          command: "show-layers",
          className: "material-icons",
          label: "layers",
          togglable: false,
        },
        {
          id: "show-style",
          active: true,
          command: "show-styles",
          className: "material-icons",
          label: "brush",
          togglable: false,
        },
        {
          id: "show-traits",
          active: true,
          command: "show-traits",
          className: "material-icons",
          label: "settings",
          togglable: false,
        },
      ],
    });

    /* GrapeJS Commands */
    // Show blocks
    this.editor.Commands.add("show-blocks", {
      getRowEl(editor: Editor) {
        return editor.getContainer().closest("#solias-workspace");
      },
      getLayersEl(row: HTMLDivElement) {
        return row.querySelector("#blocks-palette");
      },

      run(editor) {
        const elmt = this.getLayersEl(this.getRowEl(editor));
        elmt.style.display = "block";
      },
      stop(editor) {
        const elmt = this.getLayersEl(this.getRowEl(editor));
        elmt.style.display = "none";
      },
    });
    // Show layers
    this.editor.Commands.add("show-layers", {
      getRowEl(editor: Editor) {
        return editor.getContainer().closest("#solias-workspace");
      },
      getLayersEl(row: HTMLDivElement) {
        return row.querySelector("#layers-palette");
      },

      run(editor) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = "block";
      },
      stop(editor) {
        const lmEl = this.getLayersEl(this.getRowEl(editor));
        lmEl.style.display = "none";
      },
    });
    // Show styles
    this.editor.Commands.add("show-styles", {
      getRowEl(editor: Editor) {
        return editor.getContainer().closest("#solias-workspace");
      },
      getStyleEl(row: HTMLDivElement) {
        return row.querySelector("#style-palette");
      },

      run(editor) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = "block";
      },
      stop(editor) {
        const smEl = this.getStyleEl(this.getRowEl(editor));
        smEl.style.display = "none";
      },
    });
    // Show traits
    this.editor.Commands.add("show-traits", {
      getRowEl(editor: Editor) {
        return editor.getContainer().closest("#solias-workspace");
      },
      getLayersEl(row: HTMLDivElement) {
        return row.querySelector("#traits-palette");
      },

      run(editor) {
        const elmt = this.getLayersEl(this.getRowEl(editor));
        elmt.style.display = "block";
      },
      stop(editor) {
        const elmt = this.getLayersEl(this.getRowEl(editor));
        elmt.style.display = "none";
      },
    });
    // Clear designer
    this.editor.Commands.add("clear-html", {
      run: (editor) => editor.DomComponents.clear(),
    });
    // Preview
    this.editor.Commands.add("preview-window", {
      run: () => {
        if (this.savedFilePath) {
          ipcRenderer.invoke("load-preview", this.savedFilePath);
        } else {
          alert("Project not saved. Export the project as HTML to preview.");
        }
      },
    });
    // Set viewport to desktop
    this.editor.Commands.add("set-device-desktop", {
      run: (editor) => editor.setDevice("Desktop"),
    });
    // Set viewport to mobile
    this.editor.Commands.add("set-device-mobile", {
      run: (editor) => editor.setDevice("Mobile"),
    });
    // Change viewport trigger event
    this.editor.on("change:device", () =>
      console.log("Current device: ", this.editor.getDevice())
    );

    /* Add Traits to components */
    // Button Element
    this.editor.Components.addType("button", {
      isComponent: (el) => el.tagName === "BUTTON",
      model: {
        defaults: {
          traits: [
            "id",
            "title",
            {
              type: "select",
              name: "type",
              label: "Type",
              options: [
                { id: "button", label: "Button" },
                { id: "submit", label: "Submit" },
                { id: "reset", label: "Reset" },
              ],
            },
          ],
          attributes: { type: "button" },
        },
      },
    });
    // Input Element
    this.editor.Components.addType("input", {
      isComponent: (el) => el.tagName === "INPUT",
      model: {
        defaults: {
          tagName: "input",
          // draggable: 'form, form *', // Can be dropped only inside `form` elements
          droppable: false, // Can't drop other elements inside
          traits: [
            // Strings are automatically converted to text types
            "name", // Same as: { type: 'text', name: 'name' }
            "placeholder",
            {
              type: "select", // Type of the trait
              name: "type", // (required) The name of the attribute/property to use on component
              label: "Type", // The label you will see in Settings
              options: [
                { id: "text", label: "Text" },
                { id: "email", label: "Email" },
                { id: "checkbox", label: "Checkbox" },
                { id: "radio", label: "Radio" },
                { id: "range", label: "Range" },
                { id: "password", label: "Password" },
                { id: "number", label: "Number" },
                { id: "color", label: "Color" },
                { id: "date", label: "Date" },
                { id: "time", label: "Time" },
                { id: "datetime-local", label: "Date-time Local" },
                { id: "tel", label: "Telephone" },
                { id: "file", label: "File" },
                { id: "url", label: "URL" },
                { id: "search", label: "Search" },
                { id: "month", label: "Month" },
                { id: "week", label: "Week" },
              ],
            },
          ],
          // As by default, traits are bound to attributes, so to define
          // their initial value we can use attributes
          attributes: { type: "text" },
        },
      },
    });
    // Textarea
    this.editor.Components.addType("textarea", {
      isComponent: (el) => el.tagName === "TEXTAREA",
      model: {
        defaults: {
          traits: [
            "name",
            "placeholder",
            {
              type: "number",
              name: "cols",
              label: "Columns",
            },
            {
              type: "number",
              name: "rows",
              label: "Rows",
            },
          ],
        },
      },
    });
    // Headings
    this.editor.Components.addType("text", {
      isComponent: (el) =>
        el.tagName?.startsWith("H") &&
        Number.parseInt(el.tagName.slice(1)) <= 6,
      model: {
        defaults: {
          traits: [
            {
              type: "select",
              options: [
                { id: "h1", value: "h1", name: "Heading 1" },
                { id: "h2", value: "h2", name: "Heading 2" },
                { id: "h3", value: "h3", name: "Heading 3" },
                { id: "h4", value: "h4", name: "Heading 4" },
                { id: "h5", value: "h5", name: "Heading 5" },
                { id: "h6", value: "h6", name: "Heading 6" },
              ],
              label: "Size",
              name: "tagName",
              changeProp: true,
            },
          ],
        },
      },
    });
    // Anchor tag
    this.editor.Components.addType("links", {
      isComponent: (el) => el.tagName === "A",
      model: {
        defaults: {
          traits: [
            "href",
            {
              type: "select",
              options: [
                { id: "_self", value: "_self", name: "Self" },
                { id: "_blank", value: "_blank", name: "Blank" },
                { id: "_parent", value: "_parent", name: "Parent" },
                { id: "_top", value: "_top", name: "Top" },
                {
                  id: "_unfencedTop",
                  value: "_unfencedTop",
                  name: "Unfenced Top",
                },
              ],
              label: "Target",
              name: "target",
            },
            "download",
          ],
        },
      },
    });

    /* IPC Renderer Events */
    // Open file dialog event
    ipcRenderer.on("openfile", (_, args: OpenDialogReturnValue) => {
      if (!args.canceled) {
        fs.readFile(args.filePaths[0], "utf8", (err, data) => {
          if (soliasDataValidations.isValidJSON(data)) {
            this.editor.setComponents(JSON.parse(data));
            this.savedProjectPath = args.filePaths[0];
          } else {
            this.editor.setComponents(data);
            this.savedFilePath = args.filePaths[0];
          }
        });
      }
    });
    // Save file dialog event
    ipcRenderer.on("savefile-from-menu", async () => {
      const jsonData: ISoliasFileData = {
        data: JSON.stringify(this.editor.getComponents()),
        fileType: "json",
      };
      if (this.savedProjectPath) {
        jsonData.firstSave = false;
        jsonData.savedPath = this.savedProjectPath;
        ipcRenderer.invoke("savefile", jsonData);
        if (this.savedFilePath) {
          this.exportToHTML(false);
        }
      } else {
        jsonData.firstSave = true;
        const result: SaveDialogReturnValue = await ipcRenderer.invoke(
          "savefile",
          jsonData
        );
        if (!result.canceled) {
          this.savedProjectPath = result.filePath;
        }
      }
    });
    // Export HTML
    ipcRenderer.on("export-from-menu", () => {
      this.exportToHTML(true);
    });
  }

  // Export to HTML
  private async exportToHTML(firstSave: boolean) {
    const renderedHTML: ISoliasFileData = {
      data:
        BASE_HTML_TEMPLATE.start +
        this.editor.getHtml() +
        BASE_HTML_TEMPLATE.end,
      fileType: "html",
      firstSave: firstSave,
      savedPath: this.savedFilePath,
    };
    const result: SaveDialogReturnValue = await ipcRenderer.invoke(
      "savefile",
      renderedHTML
    );
    if (!result.canceled) {
      this.savedFilePath = result.filePath;
    }
  }
}
