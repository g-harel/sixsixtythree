// TODO expanding/collapsing right panel

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
            var temp = '<li><span id="' + info + position.join('');
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

    // returns the completion percentage of a Node or Root
    Root.prototype.percent_completion = Node.prototype.percent_completion = function() {
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

    // returns the node at the specified indicies in the Node's children (left to right)
    Root.prototype.access = Node.prototype.access = function(indecies) {
        if (indecies.length === 0 || this.children.length < indecies[0]) {
            return this;
        }
        return this.children[indecies.shift()].access(indecies);
    };

    // on ready
    document.addEventListener("DOMContentLoaded", function() {

        var root = new Root('root', []);
        console.log(root);
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
        document.getElementById('tree_container').innerHTML = root.html_list();
        console.log(root.percent_completion());

    });
}());
