declare namespace WUX {
    let global: WGlobal;
    function showMessage(m: string, title?: string, type?: string, dlg?: boolean): void;
    function showInfo(m: string, title?: string, dlg?: boolean, f?: () => void): void;
    function showSuccess(m: string, title?: string, dlg?: boolean): void;
    function showWarning(m: string, title?: string, dlg?: boolean): void;
    function showError(m: string, title?: string, dlg?: boolean): void;
    function confirm(m: string, f?: (response: any) => void): void;
    function getInput(m: string, f?: (response: any) => void, d?: any): void;
    function getPageTitle(): JQuery;
    function getBreadcrump(): JQuery;
    function getPageHeader(): JQuery;
    function getPageFooter(): JQuery;
    function getPageMenu(): JQuery;
    function getViewRoot(): JQuery;
    function sticky(c?: WUX.WComponent | JQuery): void;
    function stickyRefresh(): void;
    function formatDate(a: any, withDay?: boolean, e?: boolean): string;
    function formatDateTime(a: any, withSec?: boolean, withDay?: boolean, e?: boolean): string;
    function formatTime(a: any, withSec?: boolean): string;
    function formatNum2(a: any, nz?: string, z?: string, neg?: string): string;
    function formatNum(a: any, nz?: string, z?: string, neg?: string): string;
    function formatCurr(a: any, nz?: string, z?: string, neg?: string): string;
    function formatCurr5(a: any, nz?: string, z?: string, neg?: string): string;
    function formatBoolean(a: any): string;
    function format(a: any): string;
    function formatDay(d: number, e?: boolean): string;
    function formatMonth(m: number, e?: boolean, y?: any): string;
    function decodeMonth(m: any): number;
    function norm(t: any): string;
    function den(t: any): string;
    function text(t: any): string;
    function encrypt(a: any): string;
    function decrypt(a: any): string;
    enum BTN {
        PRIMARY = "btn btn-primary",
        SECONDARY = "btn btn-secondary",
        SUCCESS = "btn btn-success",
        DANGER = "btn btn-danger",
        WARNING = "btn btn-warning",
        INFO = "btn btn-info",
        LIGHT = "btn btn-light",
        DARK = "btn btn-dark",
        LINK = "btn btn-link",
        WHITE = "btn btn-white",
        SM_PRIMARY = "btn btn-sm btn-primary btn-block",
        SM_DEFAULT = "btn btn-sm btn-default btn-block",
        SM_SECONDARY = "btn btn-sm btn-secondary btn-block",
        SM_INFO = "btn btn-sm btn-info btn-block",
        SM_DANGER = "btn btn-sm btn-danger btn-block",
        SM_WHITE = "btn btn-sm btn-white btn-block",
        ACT_PRIMARY = "btn btn-sm btn-primary",
        ACT_DEFAULT = "btn btn-sm btn-default",
        ACT_SECONDARY = "btn btn-sm btn-secondary",
        ACT_INFO = "btn btn-sm btn-info",
        ACT_DANGER = "btn btn-sm btn-danger",
        ACT_WHITE = "btn btn-sm btn-white",
        ACT_OUTLINE_PRIMARY = "btn btn-sm btn-primary btn-outline",
        ACT_OUTLINE_DEFAULT = "btn btn-sm btn-default btn-outline",
        ACT_OUTLINE_INFO = "btn btn-sm btn-info btn-outline",
        ACT_OUTLINE_DANGER = "btn btn-sm btn-danger btn-outline"
    }
    class CSS {
        static readonly NORMAL: WStyle;
        static readonly ERROR: WStyle;
        static readonly WARNING: WStyle;
        static readonly SUCCESS: WStyle;
        static readonly INFO: WStyle;
        static readonly COMPLETED: WStyle;
        static readonly MARKED: WStyle;
        static readonly BTN_MED: WStyle;
        static readonly BTN_SMALL: WStyle;
        static readonly STACK_BTNS: WStyle;
        static readonly LINE_BTNS: WStyle;
        static readonly FORM_CTRL = "form-control";
        static readonly FORM_CTRL_SM = "form-control input-sm";
        static readonly FIELD_REQUIRED: WStyle;
        static readonly FIELD_CRITICAL: WStyle;
        static readonly FIELD_INTERNAL: WStyle;
        static readonly LABEL_NOTICE: WStyle;
        static readonly LABEL_INFO: WStyle;
    }
    enum WIcon {
        LARGE = "fa-lg ",
        ADDRESS_CARD = "fa-address-card",
        ANGLE_DOUBLE_LEFT = "fa-angle-double-left",
        ANGLE_DOUBLE_RIGHT = "fa-angle-double-right",
        ANGLE_LEFT = "fa-angle-left",
        ANGLE_RIGHT = "fa-angle-right",
        ARROW_CIRCLE_DOWN = "fa-arrow-circle-down",
        ARROW_CIRCLE_LEFT = "fa-arrow-circle-left",
        ARROW_CIRCLE_O_DOWN = "fa-arrow-circle-o-down",
        ARROW_CIRCLE_O_LEFT = "fa-arrow-circle-o-left",
        ARROW_CIRCLE_O_RIGHT = "fa-arrow-circle-o-right",
        ARROW_CIRCLE_O_UP = "fa-arrow-circle-o-up",
        ARROW_CIRCLE_RIGHT = "fa-arrow-circle-right",
        ARROW_CIRCLE_UP = "fa-arrow-circle-up",
        ARROW_DOWN = "fa-arrow-down",
        ARROW_LEFT = "fa-arrow-left",
        ARROW_RIGHT = "fa-arrow-right",
        ARROW_UP = "fa-arrow-up",
        BOLT = "fa-bolt",
        BACKWARD = "fa-backward",
        BOOKMARK = "fa-bookmark",
        BOOKMARK_O = "fa-bookmark-o",
        CALENDAR = "fa-calendar",
        CALCULATOR = "fa-calculator",
        CHAIN = "fa-chain",
        CHAIN_BROKEN = "fa-chain-broken",
        CHECK = "fa-check",
        CHECK_CIRCLE = "fa-check-circle",
        CHECK_CIRCLE_O = "fa-check-circle-o",
        CHECK_SQUARE = "fa-check-square",
        CHECK_SQUARE_O = "fa-check-square-o",
        CHEVRON_DOWN = "fa-chevron-down",
        CHEVRON_UP = "fa-chevron-up",
        CLOCK_O = "fa-clock-o",
        CLOSE = "fa-close",
        COG = "fa-cog",
        COMMENT = "fa-comment",
        COMMENTS_O = "fa-comments-o",
        COPY = "fa-copy",
        CUT = "fa-cut",
        DATABASE = "fa-database",
        EDIT = "fa-edit",
        ENVELOPE_O = "fa-envelope-o",
        EXCHANGE = "fa-exchange",
        FILE = "fa-file",
        FILE_O = "fa-file-o",
        FILE_CODE_O = "fa-file-code-o",
        FILE_PDF_O = "fa-file-pdf-o",
        FILE_TEXT_O = "fa-file-text-o",
        FILES = "fa-files-o",
        FILTER = "fa-filter",
        FOLDER = "fa-folder",
        FOLDER_O = "fa-folder-o",
        FOLDER_OPEN = "fa-folder-open",
        FOLDER_OPEN_O = "fa-folder-open-o",
        FORWARD = "fa-forward",
        GRADUATION_CAP = "fa-graduation-cap",
        INFO_CIRCLE = "fa-info-circle",
        LIFE_RING = "fa-life-ring",
        LINK = "fa-link",
        LEGAL = "fa-legal",
        LIST = "fa-list",
        MINUS = "fa-minus",
        MINUS_SQUARE_O = "fa-minus-square-o",
        PASTE = "fa-paste",
        PENCIL = "fa-pencil",
        PIE_CHART = "fa-pie-chart",
        PLUS = "fa-plus",
        PLUS_SQUARE_O = "fa-plus-square-o",
        PRINT = "fa-print",
        QUESTION_CIRCLE = "fa-question-circle",
        RANDOM = "fa-random",
        RECYCLE = "fa-recycle",
        REFRESH = "fa-refresh",
        SEARCH = "fa-search",
        SEARCH_MINUS = "fa-search-minus",
        SEARCH_PLUS = "fa-search-plus",
        SEND = "fa-send",
        SHARE_SQUARE_O = "fa-share-square-o",
        SHOPPING_CART = "fa-shopping-cart",
        SIGN_IN = "fa-sign-in",
        SIGN_OUT = "fa-sign-out",
        SQUARE = "fa-square",
        SQUARE_O = "fa-square-o",
        TH_LIST = "fa-th-list",
        THUMBS_O_DOWN = "fa-thumbs-o-down",
        THUMBS_O_UP = "fa-thumbs-o-up",
        TIMES = "fa-times",
        TIMES_CIRCLE = "fa-times-circle",
        TOGGLE_OFF = "fa-toggle-off",
        TOGGLE_ON = "fa-toggle-on",
        TRASH = "fa-trash",
        TRUCK = "fa-truck",
        UNDO = "fa-undo",
        UPLOAD = "fa-upload",
        USER = "fa-user",
        USER_O = "fa-user-o",
        USERS = "fa-users",
        WARNING = "fa-warning",
        WIFI = "fa-wifi",
        WRENCH = "fa-wrench"
    }
    class RES {
        static OK: string;
        static CLOSE: string;
        static CANCEL: string;
        static ERR_DATE: string;
    }
}
