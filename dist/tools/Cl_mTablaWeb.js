export default class Cl_mTablaWeb {
    constructor({ id, creadoEl, alias, }) {
        this._id = id !== null && id !== void 0 ? id : null;
        this._creadoEl = creadoEl !== null && creadoEl !== void 0 ? creadoEl : null;
        this._alias = alias !== null && alias !== void 0 ? alias : null;
    }
    set id(id) {
        this._id = id;
    }
    get id() {
        return this._id;
    }
    get creadoEl() {
        return this._creadoEl;
    }
    get alias() {
        return this._alias;
    }
    toJSON() {
        return {
            id: this._id,
            creadoEl: this._creadoEl,
            alias: this._alias,
        };
    }
}
