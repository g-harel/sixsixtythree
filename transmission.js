// TODO pick and implement a date format

(function() {

    // Node Object contructor
    var Node = function(info, completed, due, children) {
        this.info = info || '663663663663';
        this.completed = completed || false;
        this.due = due || 'today';
        this.children = (Object.prototype.toString.call(children) === '[object Array]' && children)  || [];
    };

    // returns a formatted string of the Node and its children
    Node.prototype.format = function(tabs) {
        tabs = tabs || '\t';
        var stringified = this.info + (this.children.length?' >':'');
        for (var i = 0; i < this.children.length; i++) {
            stringified += '\n' + tabs + this.children[i].format(tabs + '\t');
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

    // TODO saves the Node to the cookie
    Node.prototype.save_recipe = function(key) {

    };

    // TODO retrieves the Node from the cookie and rebuilds it
    Node.prototype.prepare = function(key) {

    };

    // code for testing
    var a = [],b = [],c = [];
    for(var k=0;k<4;k++){c[k]=new Node(k+'c',false,'date',[]);}
    for(var j=0;j<3;j++){b[j]=new Node(j+'b',false,'date',[c[0],c[1],c[2],c[3]]);}
    for(var i=0;i<3;i++){a[i]=new Node(i+'a',false,'date',[b[0],b[1],b[2]]);}
    var root=new Node('root',false,'date',[a[0],a[1],a[2]]);
    c[0].completed = true;
    b[0].completed = true;
    a[0].completed = true;
    console.log(root.format());
    console.log(root.percent_completion()*100 + '%');
    console.log(root.access([2,1]));

}());
