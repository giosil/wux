namespace APP {

    export class Mock {
        dat: { [coll: string]: any[] };
        seq: { [coll: string]: number };

        constructor() {
            this.dat = JSON.parse(localStorage.getItem("mockd"));
            this.seq = JSON.parse(localStorage.getItem("mocks"));
            if(!this.dat) this.dat = {};
            if(!this.seq) this.seq = {};
        }
        
        clean(coll: string) {
            coll = this.norm(coll);
            this.dat[coll] = [];
            this.seq[coll] = 0;
            localStorage.setItem('mockd', JSON.stringify(this.dat));
            localStorage.setItem('mocks', JSON.stringify(this.seq));
        }

        clear() {
            this.dat = {};
            this.seq = {};
            localStorage.setItem('mockd', JSON.stringify(this.dat));
            localStorage.setItem('mocks', JSON.stringify(this.seq));
        }

        inc(coll: string): number {
            coll = this.norm(coll);
            let r = this.seq[coll];
            if(!r) {
                this.seq[coll] = 1;
                localStorage.setItem('mocks', JSON.stringify(this.seq));
                return 1;
            }
            this.seq[coll] = ++r;
            localStorage.setItem('mocks', JSON.stringify(this.seq));
            return r;
        }

        find(coll: string, filter?: any): any[] {
            coll = this.norm(coll);
            console.log('[Mock] find ' + coll, filter);
            let r = this.dat[coll];
            if(!r) return [];
            if(filter) {
                let rf = [];
                for(let i = 0; i < r.length; i++) {
                    if(this.match(r[i], filter)) {
                        rf.push(r[i]); 
                    }
                }
                return rf;
            }
            return r;
        }
        
        ins(coll: string, ent: any, key?: string): any {
            coll = this.norm(coll);
            console.log('[Mock] ins ' + coll, ent);
            if(!ent) return null;
            let r = this.dat[coll];
            if(!r) r = [];
            if(key && !ent[key]) {
                ent[key] = this.inc(coll);
            }
            r.push(ent);
            this.dat[coll] = r;
            localStorage.setItem('mockd', JSON.stringify(this.dat));
            return ent;
        }
        
        upd(coll: string, ent: any, key: string): any {
            coll = this.norm(coll);
            console.log('[Mock] upd ' + coll, ent);
            if(!ent || !key) return null;
            let r = this.dat[coll];
            if(!r) return null;
            for(let i = 0; i < r.length; i++) {
                if(r[i][key] == ent[key]) {
                    r[i] = {...r[i], ...ent};
                    localStorage.setItem('mockd', JSON.stringify(this.dat));
                    return r[i];
                }
            }
            return null;
        }

        del(coll: string, val: any, key: string): boolean {
            coll = this.norm(coll);
            console.log('[Mock] del ' + coll + ', ' + val + ', ' + key);
            if(!key || !val) return false;
            let r = this.dat[coll];
            if(!r) return false;
            if(typeof val == 'object') {
                val = val[key];
            }
            let x = -1;
            for(let i = 0; i < r.length; i++) {
                if(r[i][key] == val) {
                    x = i;
                    break;
                }
            }
            if(x < 0) return false;
            r.splice(x, 1);
            this.dat[coll] = r;
            localStorage.setItem('mockd', JSON.stringify(this.dat));
            if(r.length == 0) {
                this.seq[coll] = 0;
                localStorage.setItem('mocks', JSON.stringify(this.seq));
            }
            return true;
        }

        read(coll: string, key: string, val: any): any {
            coll = this.norm(coll);
            console.log('[Mock] read ' + coll + ', ' + key + ', ' + val);
            if(!key || !val) return null;
            let r = this.dat[coll];
            if(!r) return null;
            for(let i = 0; i < r.length; i++) {
                if(r[i][key] == val) return r[i];
            }
            return null;
        }

        protected match(rec: any, flt: any): boolean  {
            if(!rec) return false;
            if(!flt) return true;
            for (let f in flt) {
                if (flt.hasOwnProperty(f)) {
                    let a = rec[f];
                    let b = flt[f];
                    if(typeof a == 'string') {
                        if(b && a.indexOf(b) < 0)  return false;
                    }
                    else if(a == undefined || a == null) {
                        if(b == undefined || b == null || b == '') return true;
                        return false;
                    }
                    else if(b == undefined || b == null) {
                        return true;
                    }
                    else if(a != b) {
                        return false;
                    }
                }
            }
            return true;
        }

        protected norm(coll: string): string {
            if(!coll) return 'default';
            let s = coll.indexOf('/');
            if(s > 0) coll = coll.substring(0, s);
            return coll.trim().toLowerCase();
        }
    }
}