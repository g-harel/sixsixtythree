const Task = ({completed, collapsed, color, description, address, children}, showCompleted, toggleCollapsed, toggleContextMenu, contextMenuAddress, ContextMenu) => {
    const isDisplayed = completed && !showCompleted;
    const textColor = completed?'rgba(0,0,0,0.2)':'inherit';
    const hasChildren = !!children.length;
    const symbol = hasChildren?collapsed?'+ ':'- ':'~ ';
    const contextMenuIsActive = contextMenuAddress && contextMenuAddress.toString() === address.toString();
    return [() => (
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
                    onclick: toggleContextMenu(address),
                    onmouseleave: contextMenuIsActive?toggleContextMenu(address):null,
                }, [
                    description,
                    (contextMenuIsActive
                        ? [ContextMenu, address, completed]
                        : null),
                ]],
                ['span.children', {}, [
                    [`ul | display:${collapsed?'none':'block'};`, {},
                        children.map((t) => (
                            [Task, t, showCompleted, toggleCollapsed, toggleContextMenu, contextMenuAddress, ContextMenu]
                        )),
                    ],
                ]],
            ]],
        ]]
    )];
};

module.exports = Task;
