export class AppConst {
    public static trimPattern = /^\s+|\s+$/gm; // pattern for trimming
    public static pageSize = 10;
    public static pageSizeOptions: number[] = [1, 2, 5, 10, 25, 100];

    public static modelOpenFunctionality: object = {
        size: 'lg',
        backdrop: 'static',
        centered: true,
        keyboard: false
    };

    public static questionTypeArray = [
        {
            value: "checkbox",
            name: "Checkbox"
        },
        {
            value: "textbox",
            name: "Textbox"
        },
        {
            value: "radio",
            name: "Radio Button"
        },
        {
            value: "dropdown",
            name: "Dropdown"
        },
    ];

    public static answerTypeArray = [
        {
            value: "string",
            name: "String"
        },
        {
            value: "number",
            name: "Number"
        },
    ];

    public static periodList = [
        {
            label: "TODAY",
            value: "1"
        },
        {
            label: "Yesterday",
            value: "2"
        },
        {
            label: "This Week",
            value: "3"
        },
        {
            label: "This Month",
            value: "4"
        },
        {
            label: "Custom",
            value: "5"
        }
    ];

    public static statusList = [
        {
            value: 'false',
            name: 'Active'
        },
        {
            value: 'true',
            name: 'Deactive'
        }
    ]

    public static emailValidationPattern = /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*(\+[a-zA-Z0-9-]+)?@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;  // email validation pattern
    public static mobileValidationPatter = /^((\+){0,1}91(\s){0,1}(\-){0,1}(\s){0,1}){0,1}98(\s){0,1}(\-){0,1}(\s){0,1}[1-9]{1}[0-9]{7}$/;
    public static mobilePattern = /^[0]?[6789]\d{9}$/;
    public static pngiconx = 19;
    public static pngicony = 35;
    public static stageWidth = 700;
    public static stageHeight = 600;
}
