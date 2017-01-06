/*jshint esversion: 6 */

var root;

(function() {

    // document ready code
    document.addEventListener("DOMContentLoaded", function() {
        root = new Root();
        root.update(true);
    });

    // Root Object constructor
    function Root() {
        this.children = [];
        this.show_completed = true;
        this.previous_state = '';
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
                    <div class="button">----</div>
                </div>
                <div id='tree_container'></div>
            </div>`;
        // adding event listeners to the permanent DOM
        body.children[2].children[0].children[0].addEventListener('click', function() {
            prompt('ENTER PARENT NODE\'S DESCRIPTION', function(description) {
                that.save_state();
                that.children.push(new Node(description));
                that.update();
            });
        });
        body.children[2].children[0].children[1].addEventListener('mousedown', this.toggle_show_completed);
        body.children[2].children[0].children[2].addEventListener('mousedown', function() {
            if (that.previous_state) {
                that.read_recipie(that.previous_state);
                that.previous_state = '';
                that.update();
            }
        });
        body.children[2].children[1].addEventListener('click', function(e) {
            let source = e.target,
                type = source.getAttribute('data-type'),
                which = source.parentNode.getAttribute('data-address');
            if (!which) {
                return false;
            }
            let node = that.access(which.split('%'));
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
    Root.prototype.save_recipe = function(nosave) {
        var recipie = JSON.stringify(this.children, function(key, value) {
            if (key === 'address' || key === 'previous_state' || value === undefined || value === null) {
                return undefined;
            } else {
                return value;
            }
        });
        if (!nosave) {
            console.log('saved');
            localStorage.root = recipie;
        }
        return recipie;
    };

    // reads the Root from localStorage and parses it as Nodes
    Root.prototype.read_recipie = function(model) {
        this.children = [];
        this.address = [];
        var temp = (model && JSON.parse(model)) || (localStorage.root && JSON.parse(localStorage.root)) || [];
        for (var i = 0; i < temp.length; i++) {
            nodify(this, temp[i]);
        }
        function nodify(parent, node) {
            if (node === null) { return; }
            var temporary =  new Node(node.info, node.completed, node.color, node.collapsed),
                index = parent.children.length;
            temporary.address = parent.address.slice(0);
            temporary.address.push(index);
            parent.children.push(temporary);
            for (var i = 0; i < node.children.length; i++) {
                nodify(parent.children[index], node.children[i]);
            }
        }
    };

    // saves current state in memory
    Root.prototype.save_state = function() {
        this.previous_state = this.save_recipe(true);
    };

    // returns the node at the specified indicies in the Root's children (left to right)
    Root.prototype.access = function(indecies) {
        temp = this;
        while (indecies.length !== 0 && temp.children.length >= indecies[0]) {
            temp = temp.children[indecies.shift()];
        }
        return temp;
    };

    // updates the tree
    Root.prototype.update = function(nosave) {
        if (!nosave) { root.save_recipe(); }
        root.read_recipie();
        var result = '<ul>';
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i]) {
                result += this.children[i].to_string();
            }
        }
        result += '</ul>';
        document.body.children[2].children[1].innerHTML = result;
        document.body.children[2].children[0].children[2].innerHTML = this.previous_state?'UNDO':'----';
    };

    // toggles the show completed variable and refreshes the dom
    Root.prototype.toggle_show_completed = function(e) {
        root.save_state();
        root.show_completed = root.show_completed?false:true;
        root.update();
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

    // formatted html string of the Node
    Node.prototype.to_string = function() {
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
        temp.title = {innerHTML:` ${esc(this.info)}`, cssText:''};
        temp.title.cssText += `background-color:${this.color};`;
        // children
        temp.children = {innerHTML:'', cssText:''};
        temp.children.innerHTML = '<ul>';
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i]) {
                temp.children.innerHTML += this.children[i].to_string();
            }
        }
        temp.children.innerHTML += '</ul>';
        if (this.collapsed) {
            temp.children.cssText += 'display:none;';
        }
        //
        return `
        <li style="${temp.outer.cssText}">
            <span data-address="${that.address.join('%')}">
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
            var param = e.target.getAttribute('data-funcall');
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
        root.save_state();
        this.completed = this.completed?false:true;
        root.update();
    };

    // toggle collapsed
    Node.prototype.toggle_collapse = function() {
        root.save_state();
        this.collapsed = this.collapsed?false:true;
        root.update();
    };

    // add a child node
    Node.prototype.new_child = function() {
        let that = this;
        prompt('ENTER CHILD NODE\'S DESCRIPTION', function(description) {
            root.save_state();
            that.children.push(new Node(description));
            root.update();
        });
    };

    // set overlay color
    Node.prototype.set_color = function(color) {
        root.save_state();
        this.color = this.colors[color];
        root.update();
    };

    // edit the node
    Node.prototype.edit = function() {
        let that = this;
        prompt('ENTER NEW DESCRIPTION', function(description) {
            root.save_state();
            that.info = description || 'invalid description';
            root.update();
        });
    };

    // delete the node
    Node.prototype.remove = function() {
        root.save_state();
        window.root.access(this.address.slice(0,-1)).children[this.address[this.address.length-1]] = undefined;
        root.update();
    };

    // calculates the number of days between two dates using the moment library
    function day_difference(date) {
        return moment(date, 'DD/MM/YYYY').startOf('day').diff(moment().startOf('day'), 'days');
    }

    // prevents html tags to work when user inputted data is shown
    function esc(string) {
        return String(string).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // prompts the user for input
    function prompt(description, callback) {
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
            if (e.target.id === 'field') { return; }
            window.removeEventListener('mousedown', hide_prompt);
            container.style.display = 'none';
        }
    }

}());
