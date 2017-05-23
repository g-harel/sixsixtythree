const colors = [
    {name: 'NONE', color: 'transparent'},
    {name: 'RED', color: '#ffcdbf'},
    {name: 'YELLOW', color: '#fffac1'},
    {name: 'GREEN', color: '#c7ffbf'},
    {name: 'BLUE', color: '#bfffeb'},
    {name: 'PURPLE', color: '#e9bfff'},
];

const contextMenu = ({app, isCompleted, toggleComplete, addChild, changeColor, edit, remove}) => {
    let contextMenuAddress = null;

    let setContextMenuAddress = (address = null) => {
        contextMenuAddress = Array.isArray(address)?address.slice():null;
        app.update();
    };

    let contextMenuIsActive = (address) => {
        return contextMenuAddress && contextMenuAddress.toString() === address.toString();
    };

    let toggleContextMenu = (address) => {
        console.log('>>', contextMenuIsActive(address)?null:address);
        contextMenuIsActive(address)
            ? setContextMenuAddress(null)
            : setContextMenuAddress(address);
    };

    let builder = (address) => {
        if (!contextMenuIsActive(address)) {
            return null;
        }
        address = address.slice();
        return (
            ['div.context-menu', {onclick: toggleContextMenu.bind(null, address)}, [
                ['div.item', {onclick: toggleComplete(address)}, [
                    isCompleted(address)?'NOT DONE':'DONE',
                ]],
                ['div.item', {onclick: addChild(address)}, [
                    'ADD',
                ]],
                ['div.item', {}, [
                    'COLOR',
                    ['div.submenu', {},
                        colors.map((color) => (
                            ['div.item', {onclick: changeColor(address, color.color)}, [
                                [`span | background-color:${color.color};`, {}, [
                                    color.name,
                                ]],
                            ]]
                        )),
                    ],
                ]],
                ['div.item', {onclick: () => edit(address)}, [
                    'EDIT',
                ]],
                ['div.item', {onclick: () => remove(address)}, [
                    'REMOVE',
                ]],
            ]]
        );
    };

    return {builder, setContextMenuAddress, contextMenuIsActive, toggleContextMenu};
};

module.exports = contextMenu;
