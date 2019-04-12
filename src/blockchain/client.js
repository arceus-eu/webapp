import { environment } from './client.properties.js';
import { WebClient } from './src/client.js';


export class JaavTMClient {

    client: any;
    address: string; // contract address set in environment
    contract: any;
    connected = false;

    constructor() {
        this.client = new WebClient(environment.tendermintHost);
        this.address = window.localStorage.getItem('address') || environment.contract;
    }

    connect () {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                this.client.connect().then(() => {
                    this.connected = true;
                    resolve();
                }).catch(reject);
            } else {
                resolve();
            }
        });
    }

    createAccount (name, password) {
        return new Promise((resolve, reject) => {
            this.connect().then(() => {
                this.client.createNamedAccount(password, name).then(resolve).catch(reject);
            }).catch(reject);
        });
    }

    getAccount(name , password) {
        return new Promise((resolve, reject) => {
            this.connect().then(() => {
                this.client.getAccount(name, password).then(resolve).catch(reject);
            }).catch(reject);
        });
    }

    getContract(contract, account, password) {
        if (this.contract) {
            this.client.unregisterContract(this.contract);
        }

        return new Promise((resolve, reject) => {
            this.client.getContract(this.address, account).then(contract => {
                this.contract = contract;
                resolve(contract);
            }).catch(e => this.deployContract(contract, account, password).then(resolve).catch(ee => reject(ee)));
        });
    }

    getConstractInstance () {
        return this.contract;
    }

    deployContract(contract, account, password) {
        const me = this;

        window.localStorage.clear();

        return new Promise( (resolve, reject) => {
            me.client.upload(contract).then((uploadResult) => {
                me.client.deploy(account, password, uploadResult.name).then((result: any) => {
                    me.address = result.data.address;
                    window.localStorage.setItem('address', me.address);
                    me.getContract(contract, account, password).then(resolve).catch(reject);
                }).catch(reject);
            }).catch(reject);
        });
    }
}
