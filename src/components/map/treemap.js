import {JaavTMClient as Client} from "../../blockchain/client";

export class TreeMap {

    production = false;
    dataset = 'groningen';

    constructor(production) {
        this.production = production;
    }

    connect() {
        return new Promise(async (resolve, reject) => {
            try {
                const client = new Client(true);
                window.client = client;
                const account = await client.getWorkingAccount();
                const result = await fetch('./contracts/trees.js');
                const cls = await result.text();
                window.treeMap = await client.getContract(cls, account, '1234');
                const treeMap = window.treeMap;
                treeMap.onAddTree = this.onAddTree;
                treeMap.onUpdateTree = this.onUpdateTree;
                resolve(treeMap);
            } catch (err) {
                reject(err);
            }
        })
    }

    updateTree(feature){
        return window.treeMap.updateTree(this.dataset, feature);
    }

    getGEOJson() {
        return window.treeMap.getTrees(this.dataset);
    }


    onUpdateTree(data) {
        console.log(data);
    }

    onAddTree(data) {
        console.log(data);
    }

}
