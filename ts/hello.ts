class HelloWorld extends WUX.WComponent {

    constructor() {
        super('', 'HelloWorld');
    }

    protected render() {
        return '<div class="hello">Hello World!</div>';
    }

}
