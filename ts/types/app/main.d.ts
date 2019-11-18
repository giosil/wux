declare function _showMessage(msg: string, title?: string, type?: string, dlg?: boolean);

declare function _showInfo(msg: string, title?: string, dlg?: boolean, f?: () => void);

declare function _showSuccess(msg: string, title?: string, dlg?: boolean);

declare function _showWarning(msg: string, title?: string, dlg?: boolean);

declare function _showError(msg: string, title?: string, dlg?: boolean);

declare function _confirm(msg: string, f?: (response: any) => void);

declare function _getInput(msg: string, f?: (response: any) => void, d?: any);

 