/*jshint esversion: 6 */

(function() {

    // calculates the number of days between two days using the moment library
    moment.day_difference = function(date) {
        return moment(date, 'DD/MM/YYYY').startOf('day').diff(moment().startOf('day'), 'days');
    };

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
        var result = '<ul>';
        for (let i = 0; i < this.children.length; i++) {
            result += this.children[i].to_string();
        }
        return result + '</ul>';
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
    function Node(address, info, completed, due, children, color, collapsed) {
        this.address = (Object.prototype.toString.call(address) === '[object Array]' && address)  || [];
        this.info = info || '663663663663';
        this.completed = completed?true:false;
        this.due = due || moment().format('DD/MM/YYYY');
        this.children = (Object.prototype.toString.call(children) === '[object Array]' && children)  || [];
        this.color = color || '';
        this.collapsed = collapsed?true:false;
    }

    // highlight colors
    Node.prototype.colors = [['RED', 'YELLOW', 'GREEN', 'BLUE', 'PURPLE'], 'rgb(255,205,191)', 'rgb(255,250,193)', 'rgb(199,255,191)', 'rgb(191,255,235)', 'rgb(233,191,255)'];

    // formatted html string of the Node
    Node.prototype.to_string = function() {
        var that = this;
        return `
        <li>
            <span class="${that.address.join('')} node ${that.children.length?'branch':'leaf'}">
                <span class="title">
                    ${that.children.length?(that.collapsed?'+':'-'):'&nbsp;'} ${moment.day_difference(that.due)}d ${that.info}
                </span>
                <span class="children" style="display:${that.collapsed?'none':'block'};">
                    ${(function() {
                        let result = '<ul>';
                        for (let i = 0; i < that.children.length; i++) {
                            result += that.children[i].to_string();
                        }
                        return result + '</ul>';
                    }())}
                </span>
            </span>
        </li>`;
    };

    // calls a function on all DOM elements of this Node
    Node.prototype.dom_update = function(action) {
        var elements = document.getElementsByClassName(this.address.join(''));
        for (let i = 0; i < elements.length; i++) {
            action(elements[i]);
        }
    };

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
    Node.prototype.toggle_completion = function() {
        this.completed = this.completed?false:true;
        console.log('toggle complete');
    };

    // toggle collapsed
    Node.prototype.toggle_collapse = function() {
        var that = this;
        that.collapsed = that.collapsed?false:true;
        that.dom_update(function(element) {
            element.children[1].style.display = that.collapsed?'none':'block';
        });
    };

    // add a child node
    Node.prototype.add_child = function() {
        this.dom_update(function(element) {
            element.innerHTML = 'potato';
        });
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
                <div class="item" data-call="toggle_completion">${this.completed?'TODO':'DONE'}</div>
                <div class="item" data-call="add_child">ADD</div>
                <div class="item" data-call="">COLOR
                    <div class="submenu">
                        ${(function() {
                            let result = '';
                            for (let i = 1; i < that.colors.length; i++) {
                                result += `<div class="item" data-call="set_color%${i}"><span style="background-color:${that.colors[i]};">${that.colors[0][i-1]}</span></div>`;
                            }
                            return result + '<div class="item" data-call="set_color%"><span>NONE</span></div>';
                        }())}
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
        function add_children(node, depth, address) {
            if (depth <= 0) {
                return;
            }
            node.children = [new Node((address.join('')+'0').split(''), depth),
                            new Node((address.join('')+'1').split(''), depth),
                            new Node((address.join('')+'2').split(''), depth)];
            add_children(node.children[0], depth - 1, (address.join('')+'0').split(''));
            add_children(node.children[1], depth - 1, (address.join('')+'1').split(''));
            add_children(node.children[2], depth - 1, (address.join('')+'2').split(''));
        }
        add_children(root, 3, []);
        root.save_recipe();

        // reading and displaying stored data
        // var root = new Root('root');
        document.getElementById('tree_container').innerHTML = root.html_list();

        // event listener for right clicks on items
        var items = document.getElementsByClassName('node');
        for (var i = 0; i < items.length; i++) {
            items[i].children[0].addEventListener('contextmenu', item_contextmenu);
            items[i].children[0].addEventListener('click', toggle);
        }
        function item_contextmenu(e) {
            e.preventDefault();
            root.access(e.srcElement.parentNode.className.split(' ')[0].split('')).contextmenu(e.clientX, e.clientY);
        }
        function toggle(e) {
            root.access(e.srcElement.parentNode.className.split(' ')[0].split('')).toggle_collapse();
        }

    });

}());
