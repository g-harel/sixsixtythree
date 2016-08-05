/*jshint esversion: 6 */

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

    // returns a formatted string of the Root and its children
    Root.prototype.stringify = function(tabs) {
        tabs = tabs || '\t';
        var stringified = this.info + (this.children.length?' >':'');
        for (var i = 0; i < this.children.length; i++) {
            stringified += '\n' + tabs + this.children[i].stringify(tabs + '\t');
        }
        return stringified;
    };

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

    // overrides the completion status of a Node and its children
    Node.prototype.override_completion = function(value) {
        this.completed = value?true:false;
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].override_completion(value);
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

    // function to draw contextmenu for this Node
    Node.prototype.contextmenu = function(x, y) {
        var contextmenu_container = document.getElementById('contextmenu_container');
        contextmenu_container.innerHTML = `
            <div id="contextmenu" style="top:${y}px;left:${x}px;">
                <ul id="contextmenu_list">
                    <li>ONE</li>
                    <li>TWO</li>
                    <li>THREE</li>
                    <li>FOUR</li>
                    <li>FIVE</li>
                </ul>
            </div>`;
        contextmenu_container.style.display = 'block';
        contextmenu_container.children[0].addEventListener('mousedown', function(e) {
            console.log('click');
        });
        window.addEventListener('mousedown', hide_contextmenu);
        function hide_contextmenu() {
            contextmenu_container.style.display = 'none';
            console.log('removed');
            window.removeEventListener('mousedown', hide_contextmenu);
        }
    };

    // document ready code
    document.addEventListener("DOMContentLoaded", function() {

        // function add_children(node, depth) {
        //     if (depth <= 0) {
        //         return;
        //     }
        //     node.children = [new Node(depth), new Node(depth), new Node(depth)];
        //     add_children(node.children[0], depth - 1);
        //     add_children(node.children[1], depth - 1);
        //     add_children(node.children[2], depth - 1);
        // }
        // add_children(root, 3);
        // root.save_recipe();

        // reading and displaying stored data
        var root = new Root('root');
        document.getElementById('tree_container').innerHTML = root.html_list();

        // event listeners for toggling the report div
        var close_report = document.getElementById('close_report'),
            report_container = document.getElementById('report_container');
        close_report.addEventListener('click', function() {
            report_container.style.display = 'none';
            close_report.style.display = 'none';
        });
        document.getElementById('open_report').addEventListener('click', function() {
            report_container.style.display = 'block';
            close_report.style.display = 'block';
        });

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
