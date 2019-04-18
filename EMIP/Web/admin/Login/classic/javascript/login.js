
Ext.util.JSON = new (function(){
    var useHasOwn = !!{}.hasOwnProperty,
        isNative = function() {
            var useNative = null;

            return function() {
                if (useNative === null) {
                    useNative = Ext.USE_NATIVE_JSON && window.JSON && JSON.toString() == '[object JSON]';
                }
        
                return useNative;
            };
        }(),
        pad = function(n) {
            return n < 10 ? "0" + n : n;
        },
        doDecode = function(json){
            return json ? eval("(" + json + ")") : "";    
        },
        doEncode = function(o){
            if(!Ext.isDefined(o) || o === null){
                return "null";
            }else if(Ext.isArray(o)){
                return encodeArray(o);
            }else if(Ext.isDate(o)){
                return Ext.util.JSON.encodeDate(o);
            }else if(Ext.isString(o)){
                return encodeString(o);
            }else if(typeof o == "number"){
                
                return isFinite(o) ? String(o) : "null";
            }else if(Ext.isBoolean(o)){
                return String(o);
            }else {
                var a = ["{"], b, i, v;
                for (i in o) {
                    
                    if(!o.getElementsByTagName){
                        if(!useHasOwn || o.hasOwnProperty(i)) {
                            v = o[i];
                            switch (typeof v) {
                            case "undefined":
                            case "function":
                            case "unknown":
                                break;
                            default:
                                if(b){
                                    a.push(',');
                                }
                                a.push(doEncode(i), ":",
                                        v === null ? "null" : doEncode(v));
                                b = true;
                            }
                        }
                    }
                }
                a.push("}");
                return a.join("");
            }    
        },
        m = {
            "\b": '\\b',
            "\t": '\\t',
            "\n": '\\n',
            "\f": '\\f',
            "\r": '\\r',
            '"' : '\\"',
            "\\": '\\\\'
        },
        encodeString = function(s){
            if (/["\\\x00-\x1f]/.test(s)) {
                return '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                    var c = m[b];
                    if(c){
                        return c;
                    }
                    c = b.charCodeAt();
                    return "\\u00" +
                        Math.floor(c / 16).toString(16) +
                        (c % 16).toString(16);
                }) + '"';
            }
            return '"' + s + '"';
        },
        encodeArray = function(o){
            var a = ["["], b, i, l = o.length, v;
                for (i = 0; i < l; i += 1) {
                    v = o[i];
                    switch (typeof v) {
                        case "undefined":
                        case "function":
                        case "unknown":
                            break;
                        default:
                            if (b) {
                                a.push(',');
                            }
                            a.push(v === null ? "null" : Ext.util.JSON.encode(v));
                            b = true;
                    }
                }
                a.push("]");
                return a.join("");
        };

    
    this.encodeDate = function(o){
        return '"' + o.getFullYear() + "-" +
                pad(o.getMonth() + 1) + "-" +
                pad(o.getDate()) + "T" +
                pad(o.getHours()) + ":" +
                pad(o.getMinutes()) + ":" +
                pad(o.getSeconds()) + '"';
    };

    
    this.encode = function() {
        var ec;
        return function(o) {
            if (!ec) {
                
                ec = isNative() ? JSON.stringify : doEncode;
            }
            return ec(o);
        };
    }();


    
    this.decode = function() {
        var dc;
        return function(json) {
            if (!dc) {
                
                dc = isNative() ? JSON.parse : doDecode;
            }
            return dc(json);
        };
    }();

})();

Ext.encode = Ext.util.JSON.encode;
Ext.decode = Ext.util.JSON.decode;

CookieProvider = function(config){
    
    this.path = "/";
    this.expires = new Date(new Date().getTime()+(1000*60*60*24*7)); 
    this.domain = null;
    this.secure = false;
    this.namespace = 'ys-',
    Ext.apply(this, config);

    this.decodeValue = function(cookie){
        
        var re = /^(a|n|d|b|s|o|e)\:(.*)$/,
            matches = re.exec(unescape(cookie)),
            all,
            type,
            v,
            kv;
        if(!matches || !matches[1]){
            return; 
        }
        type = matches[1];
        v = matches[2];
        switch(type){
            case 'e':
                return null;
            case 'n':
                return parseFloat(v);
            case 'd':
                return new Date(Date.parse(v));
            case 'b':
                return (v == '1');
            case 'a':
                all = [];
                if(v != ''){
                    Ext.each(v.split('^'), function(val){
                        all.push(this.decodeValue(val));
                    }, this);
                }
                return all;
           case 'o':
                all = {};
                if(v != ''){
                    Ext.each(v.split('^'), function(val){
                        kv = val.split('=');
                        all[kv[0]] = this.decodeValue(kv[1]);
                    }, this);
                }
                return all;
           default:
                return v;
        }
    };
    
    this.encodeValue = function(v){
        var enc,
            flat = '',
            i = 0,
            len,
            key;
        if(v == null){
            return 'e:1';    
        }else if(typeof v == 'number'){
            enc = 'n:' + v;
        }else if(typeof v == 'boolean'){
            enc = 'b:' + (v ? '1' : '0');
        }else if(Ext.isDate(v)){
            enc = 'd:' + v.toGMTString();
        }else if(Ext.isArray(v)){
            for(len = v.length; i < len; i++){
                flat += this.encodeValue(v[i]);
                if(i != len - 1){
                    flat += '^';
                }
            }
            enc = 'a:' + flat;
        }else if(typeof v == 'object'){
            for(key in v){
                if(typeof v[key] != 'function' && v[key] !== undefined){
                    flat += key + '=' + this.encodeValue(v[key]) + '^';
                }
            }
            enc = 'o:' + flat.substring(0, flat.length-1);
        }else{
            enc = 's:' + v;
        }
        return escape(enc);
    };
    
    this.set = function(name, value){
        if(typeof value == "undefined" || value === null){
            this.clear(name);
            return;
        }
        this.setCookie(name, value);
    };
    
    this.get = function(name, defaultValue){
        return typeof this.state[name] == "undefined" ?
            defaultValue : this.state[name];
    };
    
    this.clear = function(name){
        this.clearCookie(name);
    };
    
    this.readCookies = function(){
        var cookies = {},
            c = document.cookie + ";",
            re = /\s?(.*?)=(.*?);/g,
    	    matches,
            name,
            value;
    	while((matches = re.exec(c)) != null){
            name = matches[1];
            value = matches[2];
            if(name && name.substring(0,3) == this.namespace){
                cookies[name.substr(3)] = this.decodeValue(value);
            }
        }
        return cookies;
    };

    this.setCookie = function(name, value){
        document.cookie = this.namespace + name + "=" + this.encodeValue(value) +
           ((this.expires == null) ? "" : ("; expires=" + this.expires.toGMTString())) +
           ((this.path == null) ? "" : ("; path=" + this.path)) +
           ((this.domain == null) ? "" : ("; domain=" + this.domain)) +
           ((this.secure == true) ? "; secure" : "");
    };

    this.clearCookie = function(name){
        document.cookie = this.namespace + name + "=null; expires=Thu, 01-Jan-70 00:00:01 GMT" +
           ((this.path == null) ? "" : ("; path=" + this.path)) +
           ((this.domain == null) ? "" : ("; domain=" + this.domain)) +
           ((this.secure == true) ? "; secure" : "");
    };
    
    this.state = this.readCookies();
};