class HelloWorld extends WUX.WComponent {

    constructor() {
        super('', 'HelloWorld');
    }

    protected render() {
        return '<span class="hello">Hello World!</span>';
    }

}
