/*jshint esversion: 6 */

// TODO dialogs
// TODO make date be taken from info

var root;

(function() {

    // document ready code
    document.addEventListener("DOMContentLoaded", function() {
        root = new Root();
        root.read_recipie();
        root.update();
    });

    // Root Object constructor
    function Root() {
        this.children = [];
        this.show_completed = true;
        // setting up all the necessary DOM elements
        var body = document.body,
            that = this;
        // NOTE some code depends on the order/number of children, beware when editing
        body.innerHTML = `
            <div id='prompt'></div>
            <div id='contextmenu_container'></div>
            <div id='root_container'>
                <div id='buttons'>
                    <div class="button">NEW PARENT</div>
                    <div class="button">TOGGLE COMPLETED</div>
                </div>
                <div id='tree_container'></div>
            </div>`;
        // adding event listeners to the permanent DOM buttons
        body.children[2].children[0].children[0].addEventListener('click', function() {
            that.prompt('ENTER PARENT NODE\'S DESCRIPTION', function(description) {
                that.add_child(new Node(description));
                that.update();
            });
        });
        body.children[2].children[0].children[1].addEventListener('mousedown', this.toggle_show_completed);
        // adding an event listener for the node tree
        body.children[2].children[1].addEventListener('click', function(e) {
            let source = e.srcElement,
                type = source.getAttribute('data-type'),
                which = source.parentNode.getAttribute('data-address');
            if (isNaN(Number(which)) || which === null) {
                return false;
            }
            let node = that.access(which.split(''));
            if (!node) {
                return false;
            }
            if (type === 'symbol') {
                node.toggle_collapse();
            } else if (type == 'title') {
                node.contextmenu(e.clientX, e.clientY);
            } else {
                return false;
            }
        });
    }

    // saves the Root to localStorage
    Root.prototype.save_recipe = function() {
        console.log('saved');
        localStorage.root = JSON.stringify(this.children, function(key, value) {
            if (key === 'address' || value === undefined || value === null) {
                return undefined;
            } else {
                return value;
            }
        });
    };

    // reads the Root from localStorage
    Root.prototype.read_recipie = function() {
        this.children = [];
        var temp = JSON.parse(localStorage.root);
        for (var i = 0; i < temp.length; i++) {
            nodify(this, temp[i]);
        }
        function nodify(parent, node) {
            if (node === null) { return; }
            var temporary =  new Node(node.info, node.completed, node.color, node.collapsed),
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
    Root.prototype.update = function() {
        var result = '<ul>';
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i]) {
                result += this.children[i].to_string();
            }
        }
        result += '</ul>';
        document.body.children[2].children[1].innerHTML = result;
        root.save_recipe();
        root.read_recipie();
    };

    // toggles the show completed variable and refreshes the dom
    Root.prototype.toggle_show_completed = function(e) {
        root.show_completed = root.show_completed?false:true;
        root.update();
    };

    Root.prototype.prompt = function(description, callback) {
        container = document.body.children[0];
        container.innerHTML = `
        <form>
            <label> ${description} </br>
                <input id="field" type="text"></input>
            </label>
        </form>`;
        container.style.display = 'block';
        var field = container.children[0].children[0].children[1];
        container.children[0].addEventListener('submit', function(e) {
            e.preventDefault();
            container.style.display = 'none';
            callback(field.value);
        });
        // workaround to prevent prompt from instantly dissapearing, I don't like it
        setTimeout(function() {
            window.addEventListener('mousedown', hide_prompt);
            field.focus();
        }, 0);
        function hide_prompt(e) {
            if (e.srcElement.id === 'field') { return; }
            window.removeEventListener('mousedown', hide_prompt);
            container.style.display = 'none';
        }
    };

    // Node Object contructor
    function Node(info, completed, color, collapsed) {
        this.info = info || '663663663663';
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

    // formatted html string of the Node
    Node.prototype.to_string = function(children) {
        var that = this;
        // outer
        var temp = {};
        temp.outer = {innerHTML: '', cssText: ''};
        if (this.completed && !root.show_completed) {
            temp.outer.cssText = 'display:none;';
        }
        if (this.completed) {
            temp.outer.cssText += 'color:rgba(0,0,0,0.2);';
        }
        // symbol
        if (!this.children.length) {
            temp.symbol = {innerHTML:'&nbsp;', cssText:'pointer-events:none;'};
        } else if (this.collapsed) {
            temp.symbol = {innerHTML:'+', cssText: ''};
        } else {
            temp.symbol = {innerHTML:'-', cssText: ''};
        }
        // title
        temp.title = {innerHTML:`${this.address.join('')} ${esc(this.info)}`, cssText:''};
        temp.title.cssText += `background-color:${this.color};`;
        // children
        temp.children = {innerHTML:'', cssText:''};
        if (!children || children === '') {
            temp.children.innerHTML = '<ul>';
            for (let i = 0; i < this.children.length; i++) {
                if (this.children[i]) {
                    temp.children.innerHTML += this.children[i].to_string();
                }
            }
            temp.children.innerHTML += '</ul>';
        } else {
            temp.children.innerHTML = children;
        }
        if (this.collapsed) {
            temp.children.cssText += 'display:none;';
        }
        //
        return `
        <li style="${temp.outer.cssText}">
            <span data-address="${that.address.join('')}">
                <span class="symbol" data-type="symbol" style="${temp.symbol.cssText}">
                    ${temp.symbol.innerHTML}
                </span>
                <span class="title" data-type="title" style="${temp.title.cssText}">
                    ${temp.title.innerHTML}
                </span>
                <span class="children" style="${temp.children.cssText}">
                    ${temp.children.innerHTML}
                </span>
            </span>
        </li>`;
    };

    // updates the DOM elements of this Node's instance and optionally the children
    Node.prototype.update = function(refresh_children) {
        let target = document.body.children[2].children[1],
            temp = this.address.slice(0);
        try {
            while (temp.length > 0) {
                target = target.children[0];
                target = target.children[temp[0]];
                target = target.children[0];
                target = target.children[2];
                temp.shift();
            }
        } catch(e) {
            console.log(e);
            return false;
        }
        target = target.parentNode;
        target.parentNode.outerHTML = this.to_string(refresh_children?false:target.children[2].innerHTML);
        root.save_recipe();
        root.read_recipie();
    };

    // function to draw contextmenu for this Node
    Node.prototype.contextmenu = function(x, y) {
        var contextmenu_container = document.body.children[1],
            colors = '';
        for (let i = 1; i < this.colors.length; i++) {
            colors += `
            <div class="item" data-funcall="set_color%${i}">
                <span style="background-color:${this.colors[i]};">${this.colors[0][i-1]}</span>
            </div>`;
        }
        contextmenu_container.innerHTML = `
            <div id="contextmenu" style="top:${y}px;left:${x}px;">
                <div class="item" data-funcall="toggle_completion">
                    ${this.completed?'NOT DONE':'DONE'}
                </div>
                <div class="item" data-funcall="new_child">ADD</div>
                <div class="item" data-funcall="">COLOR
                    <div class="submenu">
                        ${colors}
                    </div>
                </div>
                <div class="item" data-funcall="edit">EDIT</div>
                <div class="item" data-funcall="remove">REMOVE</div>
            </div>`;
        contextmenu_container.style.display = 'block';
        contextmenu = contextmenu_container.children[0];
        window.addEventListener('mousedown', hide_contextmenu);
        function hide_contextmenu(e) {
            contextmenu_container.style.display = 'none';
            window.removeEventListener('mousedown', hide_contextmenu);
        }
        let that = this;
        contextmenu.addEventListener('mousedown', function(e) {
            var param = e.srcElement.getAttribute('data-funcall');
            if (!param) {
                return false;
            }
            param = param.split('%');
            if(param[0]) {
                that[param[0]](param[1]||false);
            }
        });
    };

    // toggle completion
    Node.prototype.toggle_completion = function() {
        this.completed = this.completed?false:true;
        this.update(false);
    };

    // toggle collapsed
    Node.prototype.toggle_collapse = function() {
        this.collapsed = this.collapsed?false:true;
        this.update(false);
    };

    // add a child node
    Node.prototype.new_child = function() {
        let that = this;
        root.prompt('ENTER CHILD NODE\'S DESCRIPTION', function(description) {
            that.add_child(new Node(description));
            that.update(true);
        });
    };

    // set overlay color
    Node.prototype.set_color = function(color) {
        this.color = this.colors[color];
        this.update(false);
    };

    // edit the node
    Node.prototype.edit = function() {
        let that = this;
        root.prompt('ENTER NEW DESCRIPTION', function(description) {
            that.info = description || 'invalid description';
            that.update(true);
        });
    };

    // delete this node
    Node.prototype.remove = function() {
        var parent = window.root.access(this.address.slice(0,-1));
        parent.children[this.address[this.address.length-1]] = undefined;
        parent.update(false);
    };

    // calculates the number of days between two dates using the moment library
    function day_difference(date) {
        return moment(date, 'DD/MM/YYYY').startOf('day').diff(moment().startOf('day'), 'days');
    }

    // prevents html tags to work when user inputted data is shown
    function esc(string) {
        return String(string).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

}());
