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

    getNewTreeTemplate(id, height, plantingDate, geometry, type = "Tilia vulgaris",
                       street, city

    ) {
        return {
            "type": "Feature",
                "properties": {
                    "LINKNR": id,
                    "CODE": "0010",
                    "HOEK": 0,
                    "OMSCHRIJV": street,
                    "OMSCHRIJVA": city,
                    "OMSCHRIJVB": street,
                    "LATNAAM": type,
                    "KIEMJAAR": plantingDate,
                    "AANTAL": 1,
                    "BOOMHOOGTE": height,
                    "OMSCHRIJVO": "Particulier",
                    "OMSCHRIJVP": "Particulier",
                    "OMSCHRIJVQ": "Boomspiegel beplanting",
                    "STAMDIAM": 0,
                    "KROONDIAM": 0.0,
                    "POTMONUM": 0,
                    "MEERSTAMM": 0,
                    "XCOORD": 0,
                    "YCOORD": 0
                },
                "geometry": geometry
            }
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
