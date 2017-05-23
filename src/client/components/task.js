const Task = ({completed, collapsed, color, description, address, children}, showCompleted, toggleCollapsed, ContextMenu) => {
    const isDisplayed = completed && !showCompleted;
    const textColor = completed?'rgba(0,0,0,0.2)':'inherit';
    const hasChildren = !!children.length;
    const symbol = hasChildren?collapsed?'+ ':'- ':'~ ';
    address = address.slice();
    return (
        [`li | display:${isDisplayed?'none':'block'}; color:${textColor};`, {}, [
            ['span', {}, [
                ['span.symbol', {
                    style: `pointer-events:${hasChildren?'all':'none'};
                            color:${hasChildren?'inherit':'rgba(0,0,0,0.2)'};`,
                    onclick: toggleCollapsed(address),
                }, [
                    symbol,
                ]],
                [`span.title | background-color:${color};`, {
                    onclick: () => ContextMenu.toggleContextMenu(address),
                    onmouseleave: ContextMenu.contextMenuIsActive(address)?() => ContextMenu.toggleContextMenu(address):null,
                }, [
                    description,
                    [ContextMenu.builder, address],
                ]],
                ['span.children', {}, [
                    [`ul | display:${collapsed?'none':'block'};`, {},
                        children.map((t) => (
                            [Task, t, showCompleted, toggleCollapsed, ContextMenu]
                        )),
                    ],
                ]],
            ]],
        ]]
    );
};

module.exports = Task;
