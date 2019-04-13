class TreeMap {

    constructor(initialState) {
        this.state = initialState || {
            trees : {}
        };
    }

    addTree (tree) {
        if(!tree.id)
            throw new Error('The tree should have an id');

        if(this.state.trees[tree.id])
            throw new Error('The tree is already in the chain, please use update function');

        if (!tree.values) {
            tree.values = [];
        }

        this.state.trees[tree.id] = tree;
        return tree;
    }

    updateTree (tree) {
        if(!this.state.trees[tree.id])
            return this.addTree(tree);

        Object.assign(this.state.trees[tree.id], tree);
        return this.state.trees[tree.id];
    }

    getTree (id) {
        if (!this.trees[id])
            throw new Error('Tree not found');

        return this.state.trees[id];
    }

    getNormalizedTreeValue(id) {
        const tree = this.getTree(id);
        const values = tree.values || [];
    }

    getTrees () {
        return this.state.trees;
    }
}
