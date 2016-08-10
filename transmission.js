/*jshint esversion: 6 */

// TODO simplify/update Root constructor
// TODO update recipie read/write

var root;

(function() {

    // calculates the number of days between two days using the moment library
    moment.day_difference = function(date) {
        return moment(date, 'DD/MM/YYYY').startOf('day').diff(moment().startOf('day'), 'days');
    };

    // Root Object constructor
    function Root() {
        this.children = [];
    }

    // saves the Root to localStorage
    Root.prototype.save_recipe = function() {
        localStorage.root = JSON.stringify(this.children, function(key, value) {
            if (key === 'address') {
                return undefined;
            } else {
                return value;
            }
        });
    };

    // reads the Root from localStorage
    Root.prototype.read_recipie = function() {
        var temp = JSON.parse(localStorage.root);
        for (var i = 0; i < temp.length; i++) {
            nodify(root, temp[i]);
        }
        function nodify(parent, node) {
            var temporary =  new Node(node.info, node.completed, node.due, node.color, node.collapsed),
                index = parent.add_child(temporary);
            for (var i = 0; i < node.children.length; i++) {
                nodify(parent.children[index], node.children[i]);
            }
        }
    };

    // adds a child to this Root
    Root.prototype.add_child = function(node) {
        var temp = this.children.length;
        node.address = [temp];
        this.children.push(node);
        return temp;
    };

    // returns the node at the specified indicies in the Root's children (left to right)
    Root.prototype.access = function(indecies) {
        temp = this;
        while (indecies.length !== 0 && this.children.length >= indecies[0]) {
            temp = temp.children[indecies.shift()];
        }
        return temp;
    };

    // updates the tree
    Root.prototype.dom_update = function() {
        var result = '<ul>';
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i]) {
                result += this.children[i].to_string();
            }
        }
        result += '</ul>';
        document.getElementById('tree_container').innerHTML = result;
        this.refresh_listeners();
    };

    // event listeners for right clicks on items and the collapse button
    Root.prototype.refresh_listeners = function () {
        var that = this,
            items = document.getElementsByClassName('node');
        for (var i = 0; i < items.length; i++) {
            items[i].children[1].removeEventListener('contextmenu', item_contextmenu);
            items[i].children[0].removeEventListener('click', toggle);
            items[i].children[1].addEventListener('contextmenu', item_contextmenu);
            items[i].children[0].addEventListener('click', toggle);
        }
        function item_contextmenu(e) {
            e.preventDefault();
            that.access(e.srcElement.parentNode.className.split(' ')[0].split('')).contextmenu(e.clientX, e.clientY);
        }
        function toggle(e) {
            that.access(e.srcElement.parentNode.className.split(' ')[0].split('')).toggle_collapse();
        }
    };

    // Node Object contructor
    function Node(info, completed, due, color, collapsed) {
        this.info = info || '663663663663';
        this.due = due || moment().format('DD/MM/YYYY');
        this.collapsed = collapsed?true:false;
        this.completed = completed?true:false;
        this.color = color || 'transparent';
        this.children = [];
    }

    // highlight colors
    Node.prototype.colors = [['NONE', 'RED', 'YELLOW', 'GREEN', 'BLUE', 'PURPLE'], 'transparent', 'rgb(255,205,191)', 'rgb(255,250,193)', 'rgb(199,255,191)', 'rgb(191,255,235)', 'rgb(233,191,255)'];

    // adds a child to this Node and give it an address
    Node.prototype.add_child = function(node) {
        var temp = this.children.length;
        node.address = this.address.slice(0);
        node.address.push(temp);
        this.children.push(node);
        return temp;
    };

    // returns an array [innerHTML, style.cssText] for the symbol
    Node.prototype.get_symbol = function() {
        var temp;
        if (!this.children.length) {
            temp = ['&nbsp;', 'pointer-events:none;'];
        } else if (this.collapsed) {
            temp = ['+', ''];
            if (this.completed) {
                temp[1] = 'pointer-events:none;';
            } else {
                temp[1] = 'pointer-events:all;';
            }
        } else {
            temp = ['-', 'pointer-events:all;'];
        }
        if (this.completed) {
            temp[1] += 'opacity:0.1;';
        } else {
            temp[1] += 'opacity:1;';
        }
        return temp;
    };

    // returns an array [innerHTML, style.cssText] for the title
    Node.prototype.get_title = function() {
        var temp = [`${moment.day_difference(this.due)}d ${this.info}`, ''];
        if (this.completed) {
            temp[1] += 'opacity:0.2;';
        } else {
            temp[1] += 'opacity:1;';
        }
        temp[1] += `background-color:${this.color};`;
        return temp;
    };

    // returns an array [innerHTML, style.cssText] for the children
    Node.prototype.get_children = function(refresh) {
        var temp = ['', ''];
        if (refresh) {
            temp[0] = '<ul>';
            for (let i = 0; i < this.children.length; i++) {
                if (this.children[i]) {
                    temp[0] += this.children[i].to_string();
                }
            }
            temp[0] += '</ul>';
        }
        if (this.collapsed) {
            temp[1] = 'display:none;';
        } else {
            temp[1] = 'display:inline;';
        }
        return temp;
    };

    // formatted html string of the Node
    Node.prototype.to_string = function() {
        var symbol = this.get_symbol(),
            title = this.get_title(),
            children = this.get_children(true);
        return `
        <li>
            <span class="${this.address.join('')} node">
                <span class="symbol" style="${symbol[1]}">
                    ${symbol[0]}
                </span>
                <span class="title" style="${title[1]}">
                     ${title[0]}
                </span>
                <span class="children" style="${children[1]}">
                    ${children[0]}
                </span>
            </span>
        </li>`;
    };

    // updates the DOM elements of this Node and optionally the children
    Node.prototype.dom_update = function(refresh_children) {
        var elements = document.getElementsByClassName(this.address.join(''));
        for (let i = 0; i < elements.length; i++) {
            var elem = elements[i],
                symbol = this.get_symbol(),
                title = this.get_title(),
                children = this.get_children(refresh_children);
            elem.children[0].style.cssText = symbol[1];
            elem.children[0].innerHTML = symbol[0];
            elem.children[1].style.cssText = title[1];
            elem.children[1].innerHTML = title[0];
            elem.children[2].style.cssText = children[1];
            if (refresh_children) {
                elem.children[2].innerHTML = children[0];
                window.root.refresh_listeners();
            }
        }
    };

    // toggle completion
    Node.prototype.toggle_completion = function() {
        this.completed = this.completed?false:true;
        if (this.completed) {
            this.collapsed = true;
        }
        this.dom_update(false);
    };

    // toggle collapsed
    Node.prototype.toggle_collapse = function() {
        this.collapsed = this.collapsed?false:true;
        this.dom_update(false);
    };

    // add a child node
    Node.prototype.new_child = function() {
        console.log('add');
    };

    // set overlay color
    Node.prototype.set_color = function(color) {
        this.color = this.colors[color];
        this.dom_update(false);
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
        var parent = window.root.access(this.address.slice(0,-1));
        parent.children[this.address[this.address.length-1]] = undefined;
        parent.dom_update(true);
    };

    // function to draw contextmenu for this Node
    Node.prototype.contextmenu = function(x, y) {
        var that = this;
        var contextmenu_container = document.getElementById('contextmenu_container');
        contextmenu_container.innerHTML = `
        <div id="contextmenu" style="top:${y}px;left:${x}px;">
            <div class="item" data-funcall="toggle_completion">${this.completed?'NOT DONE':'DONE'}</div>
            <div class="item" data-funcall="new_child">ADD</div>
            <div class="item" data-funcall="">COLOR
                <div class="submenu">
                    ${(function() {
                        var result = '';
                        for (let i = 1; i < that.colors.length; i++) {
                            result += `
                            <div class="item" data-funcall="set_color%${i}">
                                <span style="background-color:${that.colors[i]};">${that.colors[0][i-1]}</span>
                            </div>`;
                        }
                        return result;
                    }())}
                </div>
            </div>
            <div class="item" data-funcall="">EDIT
                <div class="submenu">
                    <div class="item" data-funcall="set_info">INFO</div>
                    <div class="item" data-funcall="set_date">DATE</div>
                </div>
            </div>
            <div class="item" data-funcall="remove">REMOVE</div>
        </div>`;
        contextmenu_container.style.display = 'block';
        contextmenu = contextmenu_container.children[0];
        window.addEventListener('mousedown', hide_contextmenu);
        function hide_contextmenu(e) {
            contextmenu_container.style.display = 'none';
            window.removeEventListener('mousedown', hide_contextmenu);
        }
        contextmenu.addEventListener('mousedown', function(e) {
            var param = e.srcElement.getAttribute('data-funcall').split('%');
            if(param[0]) {
                that[param[0]](param[1]||false);
            }
        });
    };

    // document ready code
    document.addEventListener("DOMContentLoaded", function() {

        root = new Root();
        function add_children(node, depth) {
            if (depth <= 0) {
                return;
            }
            node.add_child(new Node('0'));
            node.add_child(new Node('1'));
            node.add_child(new Node('2'));
            add_children(node.children[0], depth-1);
            add_children(node.children[1], depth-1);
            add_children(node.children[2], depth-1);
        }
        // add_children(root, 3, []);

        // displaying Nodes
        root.read_recipie();
        root.dom_update();
        // root.save_recipe();

    });

}());
