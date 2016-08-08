/*jshint esversion: 6 */

// TODO use template litterals for html_list

(function() {

    // Root Object constructor
    function Root(info, children) {
        function nodify(node) {
            var temp =  new Node(node.info, node.completed, node.due, []);
            for (var i = 0; i < node.children.length; i++) {
                temp.children.push(nodify(node.children[i]));
            }
            return temp;
        }
        this.info = info || 'root';
        if (children) {
            this.children = (Object.prototype.toString.call(children) === '[object Array]' && children)  || [];
        } else {
            this.children = [];
            temp = JSON.parse(localStorage[this.info]);
            for (var i = 0; i < temp.length; i++) {
                this.children.push(nodify(temp[i]));
            }
        }
    }

    // saves the Node to localStorage
    Root.prototype.save_recipe = function() {
        localStorage[(this.info || 'backup')] = JSON.stringify(this.children);
    };

    // returns an html list of the Root's children
    Root.prototype.html_list = function() {
        if (!this.children) {
            return '';
        }
        function list(node, position) {
            var temp = '<li><span id="' + position.join('');
            if (!node.children.length) {
                return temp + '" class="node leaf">' + node.info + '</span></li>';
            } else {
                temp = temp + '" class="node branch">' + node.info + '</span><ul>';
            }
            for (var i = 0; i < node.children.length; i++) {
                position.push(i);
                temp += list(node.children[i], position);
                position.pop();
            }
            // temp += '<li><span class="add_child" data-access="' + position.join('') + '">+ ADD ITEM</span></li>';
            return temp + '</ul></li>';
        }
        var info = this.info,
            temporary = '<ul>';
        for (var j = 0; j < this.children.length; j++) {
            temporary += list(this.children[j], [j]);
        }
        return temporary + '</ul>';
    };

    // returns an array of Nodes for each "days" element where all elements are due within the amount of days, skips duplicates
    Root.prototype.deadlines = function(days) {
        if (Object.prototype.toString.call(days) !== '[object Array]') {
            return [];
        }
        function find_nodes(current) {
            for (var i = 0; i < days.length; i++) {
                if (moment(current.due, 'DD/MM/YYYY').startOf('day').diff(moment().startOf('day'), 'days') <= days[i]) {
                    result[days[i]].push(current);
                    break;
                }
            }
            for (var j = 0; j < current.children.length; j++) {
                find_nodes(current.children[j]);
            }
        }
        var result = {
            keys: days
        };
        for (var i = 0; i < days.length; i++) {
            result[days[i]] = [];
        }
        for (var j = 0; j < this.children.length; j++) {
            find_nodes(this.children[j]);
        }
        return result;
    };

    // returns the node at the specified indicies in the Root's children (left to right)
    Root.prototype.access = function(indecies) {
        temp = this;
        while (indecies.length !== 0 && this.children.length >= indecies[0]) {
            temp = temp.children[indecies.shift()];
        }
        return temp;
    };

    // Node Object contructor
    function Node(info, completed, due, children) {
        this.info = info || '663663663663';
        this.completed = completed || false;
        this.due = due || moment().format('DD/MM/YYYY');
        this.children = (Object.prototype.toString.call(children) === '[object Array]' && children)  || [];
    }

    // highlight colors
    Node.prototype.colors = ['rgb(255,205,191)','rgb(255,250,193)','rgb(199,255,191)','rgb(191,255,235)','rgb(233,191,255)'];

    // returns the completion percentage of a Node
    Node.prototype.percent_completion = function() {
        var percentage = 0,
            dependants = this.children.length;
        if (this.completed === true) {
            return 1;
        }
        for (var i = 0; i < dependants; i++) {
            percentage += this.children[i].percent_completion()/dependants;
        }
        return percentage;
    };

    // toggle completion
    Node.prototype.toggle = function() {
        this.completed = this.completed?false:true;
        console.log('toggle');
    };

    // add a child node
    Node.prototype.add_child = function() {
        console.log('add');
    };

    // set overlay color
    Node.prototype.set_color = function(color) {
        console.log('color ' + this.colors[color]);
    };

    // change the info property
    Node.prototype.set_info = function() {
        console.log('set_info');
    };

    // change the date property
    Node.prototype.set_date = function() {
        console.log('set_date');
    };

    // delete this node
    Node.prototype.remove = function() {
        console.log('remove');
    };

    // function to draw contextmenu for this Node
    Node.prototype.contextmenu = function(x, y) {
        var that = this;
        var contextmenu_container = document.getElementById('contextmenu_container');
        contextmenu_container.innerHTML = `
            <div id="contextmenu" style="top:${y}px;left:${x}px;">
                <div class="item" data-call="toggle">${this.completed?'TODO':'DONE'}</div>
                <div class="item" data-call="add_child">ADD</div>
                <div class="item" data-call="">COLOR
                    <div class="submenu">
                        <div class="item" data-call="set_color%0"><span style="background-color:${this.colors[0]};">RED</span></div>
                        <div class="item" data-call="set_color%1"><span style="background-color:${this.colors[1]};">YELLOW</span></div>
                        <div class="item" data-call="set_color%2"><span style="background-color:${this.colors[2]};">GREEN</span></div>
                        <div class="item" data-call="set_color%3"><span style="background-color:${this.colors[3]};">BLUE</span></div>
                        <div class="item" data-call="set_color%4"><span style="background-color:${this.colors[4]};">PURPLE</span></div>
                        <div class="item" data-call="set_color%"><span>NONE</span></div>
                    </div>
                </div>
                <div class="item" data-call="">EDIT
                    <div class="submenu">
                        <div class="item" data-call="set_info">INFO</div>
                        <div class="item" data-call="set_date">DATE</div>
                    </div>
                </div>
                <div class="item" data-call="remove">REMOVE</div>
            </div>`;
        contextmenu_container.style.display = 'block';
        contextmenu = contextmenu_container.children[0];
        window.addEventListener('mousedown', hide_contextmenu);
        function hide_contextmenu(e) {
            contextmenu_container.style.display = 'none';
            window.removeEventListener('mousedown', hide_contextmenu);
        }
        contextmenu.addEventListener('mousedown', function(e) {
            var param = e.srcElement.getAttribute('data-call').split('%');
            if(param[0]) {
                that[param[0]](param[1]||false);
            }
        });
    };

    // document ready code
    document.addEventListener("DOMContentLoaded", function() {

        var root = new Root('root', []);
        function add_children(node, depth) {
            if (depth <= 0) {
                return;
            }
            node.children = [new Node(depth), new Node(depth), new Node(depth)];
            add_children(node.children[0], depth - 1);
            add_children(node.children[1], depth - 1);
            add_children(node.children[2], depth - 1);
        }
        add_children(root, 3);
        root.save_recipe();

        // reading and displaying stored data
        // var root = new Root('root');
        document.getElementById('tree_container').innerHTML = root.html_list();

        // event listener for right clicks on items
        var items = document.getElementsByClassName('node');
        for (var i = 0; i < items.length; i++) {
            items[i].addEventListener('contextmenu', item_contextmenu);
        }
        function item_contextmenu(e) {
            e.preventDefault();
            root.access(e.srcElement.id.split('')).contextmenu(e.clientX, e.clientY);
        }

    });

}());
