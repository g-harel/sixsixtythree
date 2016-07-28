// TODO pick and implement a date format

(function() {

    // Node Object contructor
    function Node(info, completed, due, children) {
        this.info = info || '663663663663';
        this.completed = completed || false;
        this.due = due || moment().format('DD/MM/YYYY');
        this.children = (Object.prototype.toString.call(children) === '[object Array]' && children)  || [];
    }

    // returns a formatted string of the Node and its children
    Node.prototype.stringify = function(tabs) {
        tabs = tabs || '\t';
        var stringified = this.info + (this.children.length?' >':'');
        for (var i = 0; i < this.children.length; i++) {
            stringified += '\n' + tabs + this.children[i].stringify(tabs + '\t');
        }
        return stringified;
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

    // overrides the completion status of a Node and its children
    Node.prototype.override_completion = function(value) {
        this.completed = value?true:false;
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].override_completion(value);
        }
    };

    // returns the node at the specified indicies in the Node's children (left to right)
    Node.prototype.access = function(indecies) {
        if (indecies.length === 0 || this.children.length < indecies[0]) {
            return this;
        }
        return this.children[indecies.shift()].access(indecies);
    };

    // saves the Node to the cookie
    Node.prototype.save_recipe = function(key) {
        document.cookie = 'expires=Fri, 24 Jul 2026 21:09:23 GMT';
        document.cookie = (key || this.info || 'backup') + '=' + JSON.stringify(this);
    };

    // returns an html list of the Node's children
    Node.prototype.html_list = function(identifier) {
        if (!this.children) {
            return '';
        }
        if (!identifier) {
            identifier = this.info.replace(/\s+/, '');
        }
        function list(node, position) {
            var temp = '<li><span id="' + identifier + position.join('');
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
        var temporary = '<ul>';
        for (var j = 0; j < this.children.length; j++) {
            temporary += list(this.children[j], [j]);
        }
        return temporary + '</ul>';
    };

    // returns an array of Nodes for each days element where all child Nodes are due within the specified amount of days, skips duplicates
    Node.prototype.deadlines = function(days) {
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

    // retrieves the Node from the cookie/key and rebuilds it
    function prepare(key) {
        function nodify(obj) {
            var temp =  new Node(obj.info, obj.completed, obj.due, []);
            for (var i = 0; i < obj.children.length; i++) {
                temp.children.push(nodify(obj.children[i]));
            }
            return temp;
        }
        var pattern = new RegExp('(?:(?:^|.*;\\s*)' + (key || 'backup') + '\\s*\=\\s*([^;]*).*$)|^.*$');
        return nodify(JSON.parse(document.cookie.replace(pattern, "$1") || '{"children":[]}'));
    }

    // on ready
    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById('tree_container').innerHTML = prepare('root').html_list('root');
    });

    // code for testing //

    // var a = [],b = [],c = [];
    // for(var k=0;k<4;k++){c[k]=new Node(k+'c',false,'27/07/2016',[]);}
    // for(var j=0;j<3;j++){b[j]=new Node(j+'b',false,'28/07/2016',[c[0],c[1],c[2],c[3]]);}
    // for(var i=0;i<3;i++){a[i]=new Node(i+'a',false,'29/07/2016',[b[0],b[1],b[2]]);}
    // var root=new Node('root',false,'30/07/2016',[a[0],a[1],a[2]]);
    // c[0].completed = true;
    // b[0].completed = true;
    // a[0].completed = true;
    // console.log(root.stringify());
    var root = prepare('root');
    // root.override_completion(false);
    // root.access([0,0]).override_completion(true);
    // console.log('completion percent of root : ' + root.percent_completion()*100 + '%');
    // console.log(root.stringify());
    // root.save_recipe();
    // console.log(this.root);
    console.log(root.deadlines([0,1,2,3,30]));

}());
