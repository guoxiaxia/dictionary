//字典过滤

//存放两层键值对{CN: "China"},第一层为某一字典名称，如status
const dictionarys = new Map();
//存放键值对和数组结构数据-用于下拉列表[{id: 'CN', name: 'China'}]

const dictionaryArray = new Map();
import {Message} from 'element-ui'


//返回code中的数组格式的数据
export function getCodeArray(api, code) {
    return new Promise(resolve => {
        if (dictionaryArray.get(code)) {
            resolve(dictionaryArray.get(code));
        }else{
            saveDiction(api, code).then(res => {
                resolve(res);
            })
        }
    })
}

//返回code中的键值对格式的数据
export function getCodeMap(api, code) {
    return new Promise(resolve => {
        if (dictionarys.get(code)) {
            resolve(dictionarys.get(code));
        }else{
            saveDiction(api, code).then(res => {
                resolve(res);
            })
        }
    })
}

//返回所有字典数据（键值对）
export function getMap() {
    return dictionarys.entries();
}

//返回所有字典数据（数组格式）
export function getArray() {
    return dictionaryArray;
}

//获取指定key的值
//参数：key所查key值，api接口，code接口代表名称
export function getKeyValue(key, api, code) {
    return new Promise(resolve => {
        if (dictionarys.get(code)) {
            resolve(dictionarys.get(code).get(key));
        }else{
            saveDiction(api, code).then(res => {
                resolve(res.key);
            })
        }
    })
}

//转换字典数据，如：
//[{id: 'CN', name: 'China'},{id: 'US', name: 'USA'},] ===>  CN : "China", US : "USA" }
function handleDiction(array) {
    let map = new Map();
    array.forEach(ele => {
        map.set(ele.id, ele.categoryName);
    });
    return map;
}

//请求接口，保存子典
function saveDiction(api, code) {
   return new Promise(resolve => {
       api().then(res => {
           if (res.rel) {
               if (res.data && res.data.length) {
                   dictionaryArray.set(code, res.data);
                   let obj = handleDiction(res.data);
                   dictionarys.set(code, obj);
                   resolve(obj);
               } else {
                   Message.warning("未获取到字典数据！");
                   resolve({});
               }
           } else {
               Message.error(res.msg || "网络请求错误！");
               resolve({});
           }
       })
   })
}

// import {requestTypeValue} from 'api/login'
//在组件中直接使用，默认第一个参数key为当前字段的值
// filters:{
//     getValue: (value) => {
//         if(!value) return;
//         return this.status[value];
//     }
// },
// getKeyValue(1, requestTypeValue, 'status').then(res => {
//     this.status = res;
// })

